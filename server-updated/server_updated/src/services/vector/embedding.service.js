const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function withRetry(fn, maxRetries = 4) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (error.status === 429 && i < maxRetries - 1) {
                console.log(`Rate limit hit (429). Retrying in 15 seconds... (Attempt ${i+1}/${maxRetries})`);
                await new Promise(r => setTimeout(r, 15000));
            } else {
                throw error;
            }
        }
    }
}

async function generateEmbeddings(chunks) {
    if (!chunks || chunks.length === 0) return [];
    
    try {
        const BATCH_SIZE = 100;
        let allEmbeddings = [];

        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
            const batch = chunks.slice(i, i + BATCH_SIZE);
            
            const response = await withRetry(() => ai.models.embedContent({
                model: "gemini-embedding-2",
                contents: batch,
            }));
            
            const batchMapped = response.embeddings.map((item, index) => ({
                text: batch[index],
                embedding: item.values
            }));
            
            allEmbeddings = allEmbeddings.concat(batchMapped);

            if (i + BATCH_SIZE < chunks.length) {
                console.log(`Waiting 4 seconds before next batch to respect rate limits...`);
                await new Promise(r => setTimeout(r, 4000));
            }
        }
        
        return allEmbeddings;
        
    } catch (error) {
        console.error('Error generating embeddings with Gemini:', error);
        throw new Error('Failed to generate embeddings via Gemini API');
    }
}

async function generateQueryEmbedding(query) {
    try {
        const response = await withRetry(() => ai.models.embedContent({
            model: "gemini-embedding-2",
            contents: query,
        }));
        
        return response.embeddings[0].values;
    } catch (error) {
        console.error('Error generating query embedding with Gemini:', error);
        throw new Error('Failed to generate query embedding via Gemini API');
    }
}

module.exports = {
    generateEmbeddings,
    generateQueryEmbedding
};
