# Telegram → Article Pipeline

Bridges your existing services into one flow: send a PDF in Telegram → it's
indexed by your RAG server → Gemini drafts an article → you approve it in
Telegram → it's published through your blog backend.

```
Telegram (you) --PDF--> telegram-bot --> server/server (RAG, :5000)
                                            |  /api/pdf/upload, /api/pdf/clear
                                            v
                                        vector store + Gemini
                                            |
                                     /api/rag/generate
                                            v
telegram-bot <--draft + Approve/Regenerate/Discard buttons--
      |
      | on Approve
      v
  blog backend (:3000) --/api/auth/signin, /api/post/create--> your live site
```

## Prerequisites

1. `server/server` (the RAG microservice in this repo) running, e.g. on `:5000`.
2. Your blog backend (the one `client/` calls for `/api/auth/*` and `/api/post/*`,
   not included in this zip) running, e.g. on `:3000`, with an admin account
   (`isAdmin: true`) you can log in with.

## Setup

```bash
cd telegram-bot
npm install
cp .env.example .env
```

Fill in `.env`:

- `BOT_TOKEN` — message [@BotFather](https://t.me/BotFather) on Telegram,
  `/newbot`, copy the token it gives you.
- `ADMIN_CHAT_IDS` — message [@userinfobot](https://t.me/userinfobot) to get
  your numeric id, add it here (comma-separate if more than one person should
  be able to approve articles).
- `RAG_API_URL` — where `server/server` is running.
- `BLOG_API_URL`, `BLOG_SITE_URL`, `BLOG_ADMIN_EMAIL`, `BLOG_ADMIN_PASSWORD` —
  your blog backend and an admin login for it.
- `DEFAULT_ARTICLE_TYPE` / `DEFAULT_PRODUCT` / `DEFAULT_CATEGORY` /
  `DEFAULT_DEPARTMENT` — match these to your Post schema's expected values
  (see `client/src/pages/CreatePost.jsx` for the categories your app uses).

Run it:

```bash
npm start
```

Keep this running alongside `server/server` and your blog backend.

## Using it

1. Send a PDF to the bot in Telegram.
2. It replies once indexing is done, then asks for a title/topic.
3. Reply with the topic — it drafts the article and sends you a preview with
   three buttons: **✅ Publish**, **🔄 Regenerate**, **❌ Discard**.
4. Publish calls your blog's create-post endpoint and replies with the live
   link.

Only chat ids in `ADMIN_CHAT_IDS` can talk to the bot — everyone else gets an
"not authorized" reply.

## Important assumption to double-check

I don't have your blog backend's source (only `client/` and `server/` were
in the zip), so `src/services/blogClient.js` assumes it mirrors
`client/src/api/auth.js` and `client/src/api/posts.js`:

- `POST {BLOG_API_URL}/api/auth/signin` with `{ email, password }` sets a
  session cookie.
- `POST {BLOG_API_URL}/api/post/create` with `{ title, content, ... }`,
  authenticated via that cookie, creates the post and returns something
  with a `slug` field.

If your real backend's routes, field names, or auth mechanism differ, that
one file is the only place to change — everything else (Telegram handling,
RAG calls) doesn't need to know about it.

## Notes / things worth tightening later

- Sessions and drafts are stored in memory — restarting the bot loses any
  in-progress draft (fine for a single-admin approval flow; move to a DB/Redis
  if you need durability or multiple concurrent editors).
- The RAG server's vector store is a single global in-memory array, not
  namespaced per document. The bot calls the new `/api/pdf/clear` endpoint
  before every upload so each article is generated from exactly one PDF —
  don't remove that call, or old PDFs' content can leak into new drafts.
- No image is attached on publish (`formData.image` is optional in
  `CreatePost.jsx`) — add a step here if you want the bot to also pull a
  cover image from the PDF or let the admin send one.
- There's no "edit before publish" step yet — Regenerate re-runs generation
  with the same topic; add a text-based edit stage if you want inline tweaks
  before publishing.
