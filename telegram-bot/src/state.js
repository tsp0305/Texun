/**
 * Very small in-memory session store, keyed by Telegram chat id.
 * One draft in flight per chat at a time.
 *
 * Stages:
 *  - AWAITING_TOPIC : PDF indexed, waiting for the admin to send a title/topic
 *  - DRAFT_READY    : article generated, waiting for Publish / Regenerate / Discard
 */
const sessions = new Map();

function get(chatId) {
  return sessions.get(chatId) || null;
}

function set(chatId, data) {
  sessions.set(chatId, { ...(sessions.get(chatId) || {}), ...data });
  return sessions.get(chatId);
}

function clear(chatId) {
  sessions.delete(chatId);
}

module.exports = { get, set, clear };
