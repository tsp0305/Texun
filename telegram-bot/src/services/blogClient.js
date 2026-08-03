const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
require('dotenv').config();

/**
 * ASSUMPTION (adjust here if your real blog backend differs):
 *   POST {BLOG_API_URL}/api/auth/signin  { email, password }  -> sets an httpOnly
 *     session/JWT cookie (this mirrors client/src/api/auth.js::signIn).
 *   POST {BLOG_API_URL}/api/post/create  { title, content, ... }  -> creates a post
 *     for the logged-in (cookie-authenticated) admin user, and requires isAdmin
 *     (this mirrors client/src/api/posts.js::createPost).
 *
 * This client logs in once, keeps the cookie in a jar, and re-logs-in
 * automatically if a request comes back 401/403 (cookie expired).
 */

const jar = new CookieJar();
const client = wrapper(
  axios.create({
    baseURL: process.env.BLOG_API_URL || 'http://localhost:3000',
    jar,
    withCredentials: true,
  })
);

let loggedIn = false;

async function login() {
  console.log('BOT debug: login request', {
    BLOG_API_URL: process.env.BLOG_API_URL || 'http://localhost:3000',
    email: process.env.BLOG_ADMIN_EMAIL ? '*****' : null,
  });
  const response = await client.post('/api/auth/signin', {
    email: process.env.BLOG_ADMIN_EMAIL,
    password: process.env.BLOG_ADMIN_PASSWORD,
  });
  console.log('BOT debug: login response', {
    status: response.status,
    data: response.data,
    cookies: jar.toJSON().cookies.length,
  });
  loggedIn = true;
}

async function ensureLoggedIn() {
  if (!loggedIn) await login();
}

/**
 * payload should match your Post schema, e.g.:
 * { title, content, articleType, product, category, department, image }
 */
async function createPost(payload) {
  console.log('BOT debug: createPost payload', {
    title: payload.title,
    articleType: payload.articleType,
    product: payload.product,
    category: payload.category,
    department: payload.department,
  });
  await ensureLoggedIn();
  try {
    const { data } = await client.post('/api/post/create', payload);
    console.log('BOT debug: create post success', { data });
    return data;
  } catch (err) {
    console.error('BOT debug: create post failed', {
      status: err.response?.status,
      data: err.response?.data,
      headers: err.response?.headers,
    });
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      // Session expired or first-call race - retry once after a fresh login.
      loggedIn = false;
      await login();
      const { data } = await client.post('/api/post/create', payload);
      console.log('BOT debug: create post success after retry', { data });
      return data;
    }
    throw err;
  }
}

module.exports = { login, createPost };
