const { GoogleGenAI } = require('@google/genai');
const { generateQueryEmbedding } = require('../vector/embedding.service');
const { searchSimilar } = require('../vector/vector.service');
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
                console.log(`Rate limit hit (429) for Gemini generation. Retrying in 15 seconds... (Attempt ${i+1}/${maxRetries})`);
                await new Promise(r => setTimeout(r, 15000));
            } else {
                throw error;
            }
        }
    }
}

async function generateBlogContent(topic, length = 'Medium', customPrompt = '') {
    try {
        const queryEmbedding = await generateQueryEmbedding(topic);
        const topChunks = await searchSimilar(queryEmbedding, 5); 
        
        if (!topChunks || topChunks.length === 0) {
            throw new Error('No context found in the vector database. Please upload a PDF first.');
        }
        
        const contextString = topChunks.map(chunk => chunk.text).join('\n\n---\n\n');
        
        const systemPrompt = `You are an expert blog post writer. 
Your task is to write a high-quality, engaging blog post about the requested topic.

CRITICAL INSTRUCTION: You must strictly use ONLY the information provided in the context below. 
Do not hallucinate, invent, or include any outside information not present in the context. 
If the context does not contain enough information to write a comprehensive blog post on the topic, state that clearly and write what you can based ONLY on the context.

CONTEXT:
${contextString}`;

        let userPrompt = `Write a ${length.toUpperCase()} blog post about: "${topic}".`;
        
        if (customPrompt && customPrompt.trim().length > 0) {
            userPrompt += `\n\nADDITIONAL INSTRUCTIONS:\n${customPrompt}`;
        }

        const response = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.3,
                maxOutputTokens: 1500,
            }
        }));
        
        return response.text;
        
    } catch (error) {
        console.error('Error generating blog content with Gemini:', error);
        throw error;
    }
}

module.exports = {
    generateBlogContent
};
