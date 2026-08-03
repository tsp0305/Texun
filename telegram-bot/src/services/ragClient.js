const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const WORKFLOW_AGENT_URL = process.env.WORKFLOW_AGENT_URL || 'http://localhost:8000/api/v1/generate-article';

/**
 * The workflow agent is stateless per request, so there is no persistent store to clear.
 */
async function clearStore() {
  return;
}

/**
 * Sends the PDF + prompt in a single request to the workflow agent.
 */
async function generateArticleFromPdf(buffer, filename, prompt) {
  const form = new FormData();
  form.append('file', buffer, { filename, contentType: 'application/pdf' });
  form.append('prompt', prompt);

  const { data } = await axios.post(WORKFLOW_AGENT_URL, form, {
    headers: form.getHeaders(),
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
  return data;
}

module.exports = { clearStore, generateArticleFromPdf };
