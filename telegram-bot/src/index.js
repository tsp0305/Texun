require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const state = require('./state');
const ragClient = require('./services/ragClient');
const blogClient = require('./services/blogClient');

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('Missing BOT_TOKEN in .env');
  process.exit(1);
}

const ADMIN_CHAT_IDS = (process.env.ADMIN_CHAT_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const bot = new Telegraf(BOT_TOKEN);

// ---- Auth guard: only whitelisted chat/user ids may talk to this bot ----
bot.use((ctx, next) => {
  const chatId = String(ctx.chat?.id ?? '');
  if (!ADMIN_CHAT_IDS.includes(chatId)) {
    if (ctx.chat) {
      ctx.reply(`Not authorized. Your chat id is ${chatId} — add it to ADMIN_CHAT_IDS to use this bot.`);
    }
    return;
  }
  return next();
});

bot.start((ctx) =>
  ctx.reply(
    'Send me a PDF and I\'ll draft an article from it with Gemini.\n' +
      'After that, tell me the title/topic to write about, review the draft, then Publish, Regenerate, or Discard.'
  )
);

// ---- Step 1: PDF received ----
bot.on('document', async (ctx) => {
  const doc = ctx.message.document;
  const isPdf =
    doc.mime_type === 'application/pdf' || doc.file_name?.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return ctx.reply('Please send a PDF file.');
  }

  const chatId = ctx.chat.id;

  try {
    await ctx.reply(`Indexing "${doc.file_name}"...`);

    const fileLink = await ctx.telegram.getFileLink(doc.file_id);
    const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    state.set(chatId, {
      stage: 'AWAITING_TOPIC',
      filename: doc.file_name,
      pdfBuffer: buffer,
    });

    await ctx.reply('PDF received. Now reply with the article title/topic you want me to write about.');
  } catch (err) {
    console.error('PDF handling error:', err.response?.data || err.message);
    await ctx.reply(`Failed to process the PDF: ${err.response?.data?.message || err.message}`);
  }
});

// ---- Step 2 & follow-ups: plain text messages ----
bot.on('text', async (ctx) => {
  const chatId = ctx.chat.id;
  const text = ctx.message.text.trim();
  if (text.startsWith('/')) return; // let command handlers deal with it

  const session = state.get(chatId);

  if (!session || session.stage === 'IDLE') {
    return ctx.reply('Send me a PDF first, then I\'ll ask you for a topic.');
  }

  if (session.stage === 'AWAITING_TOPIC') {
    await generateDraft(ctx, chatId, text);
    return;
  }

  if (session.stage === 'DRAFT_READY') {
    return ctx.reply(
      'A draft is already waiting for your decision below — tap Publish, Regenerate, or Discard first.'
    );
  }
});

async function generateDraft(ctx, chatId, topic) {
  try {
    await ctx.reply(`Drafting "${topic}"...`);

    const length = process.env.DEFAULT_ARTICLE_LENGTH || 'Medium';
    const session = state.get(chatId);
    const prompt = `Write a ${length.toUpperCase()} blog post about: "${topic}".`;
    const content = await ragClient.generateArticleFromPdf(session.pdfBuffer, session.filename || 'upload.pdf', prompt);

    state.set(chatId, { stage: 'DRAFT_READY', topic, content: content.article || content });

    await sendDraftPreview(ctx, topic, content.article || content);
  } catch (err) {
    console.error('Generation error:', err.response?.data || err.message);
    await ctx.reply(`Failed to generate the article: ${err.response?.data?.message || err.message}`);
  }
}

async function sendDraftPreview(ctx, topic, content) {
  const preview = content.replace(/<[^>]+>/g, '').trim();
  const chunks = chunkMessage(`*${escapeMd(topic)}*\n\n${preview}`, 4000);

  for (const chunk of chunks) {
    await ctx.reply(chunk, { parse_mode: 'Markdown' });
  }

  await ctx.reply(
    'Publish this article?',
    Markup.inlineKeyboard([
      [Markup.button.callback('✅ Publish', 'publish')],
      [Markup.button.callback('🔄 Regenerate', 'regenerate')],
      [Markup.button.callback('❌ Discard', 'discard')],
    ])
  );
}

// ---- Step 3: admin decision ----
bot.action('publish', async (ctx) => {
  const chatId = ctx.chat.id;
  const session = state.get(chatId);
  await ctx.answerCbQuery();

  if (!session || session.stage !== 'DRAFT_READY') {
    return ctx.reply('No draft waiting to be published.');
  }

  try {
    await ctx.reply('Publishing...');

    const payload = {
      title: session.topic,
      content: session.content,
      articleType: process.env.DEFAULT_ARTICLE_TYPE || 'Others',
      product: process.env.DEFAULT_PRODUCT || '',
      category: process.env.DEFAULT_CATEGORY || '',
      department: process.env.DEFAULT_DEPARTMENT || '',
    };

    const result = await blogClient.createPost(payload);
    state.clear(chatId);

    const siteUrl = process.env.BLOG_SITE_URL || '';
    const link = result?.slug ? `${siteUrl}/post/${result.slug}` : null;

    await ctx.reply(link ? `Published! ${link}` : 'Published!');
  } catch (err) {
    console.error('Publish error:', err.response?.data || err.message);
    await ctx.reply(
      `Failed to publish: ${err.response?.data?.message || err.message}\n` +
        'Check BLOG_ADMIN_EMAIL/PASSWORD and that the account has isAdmin=true, or adjust src/services/blogClient.js if your API differs.'
    );
  }
});

bot.action('regenerate', async (ctx) => {
  const chatId = ctx.chat.id;
  const session = state.get(chatId);
  await ctx.answerCbQuery();

  if (!session || !session.topic) {
    return ctx.reply('Nothing to regenerate - send a PDF and topic first.');
  }

  state.set(chatId, { stage: 'AWAITING_TOPIC' });
  await generateDraft(ctx, chatId, session.topic);
});

bot.action('discard', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.answerCbQuery();
  state.clear(chatId);
  await ctx.reply('Draft discarded. Send a new PDF whenever you\'re ready.');
});

// ---- helpers ----
function chunkMessage(text, size) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks.length ? chunks : [''];
}

function escapeMd(text) {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

bot.launch().then(() => console.log('Telegram bot is running.'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
