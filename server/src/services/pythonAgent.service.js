const fs = require('fs');
const path = require('path');

const PYTHON_AGENT_URL = process.env.PYTHON_AGENT_URL || 'http://localhost:8000/api/v1/generate-article';

async function generateArticleViaAgent(filePath, promptText) {
    const fileBuffer = fs.readFileSync(filePath);
    const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('file', fileBlob, path.basename(filePath));
    formData.append('prompt', promptText);

    const response = await fetch(PYTHON_AGENT_URL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.detail || `Python agent responded with ${response.status}`);
    }

    return response.json();
}

module.exports = {
    generateArticleViaAgent,
};