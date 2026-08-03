/**
 * Vector Service Abstraction Layer.
 * Currently uses an in-memory store for rapid development and testing.
 * Designed to be easily switchable to Pinecone or MongoDB Vector Search later.
 */

// In-memory store: Array of { id, text, embedding, metadata }
let vectorStore = [];

/**
 * Calculates the cosine similarity between two vectors.
 * 
 * @param {Array<number>} vecA - First vector
 * @param {Array<number>} vecB - Second vector
 * @returns {number} Cosine similarity score (-1 to 1)
 */
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Stores embeddings in the vector database.
 * 
 * @param {Array<Object>} embeddings - Array of {text, embedding} objects
 * @param {Object} metadata - Optional metadata (e.g., document name, timestamp)
 */
async function storeEmbeddings(embeddings, metadata = {}) {
    try {
        const newEntries = embeddings.map((item, index) => ({
            id: `doc_${Date.now()}_chunk_${index}`,
            text: item.text,
            embedding: item.embedding,
            metadata: { ...metadata, storedAt: new Date().toISOString() }
        }));
        
        // Append to in-memory store
        vectorStore = [...vectorStore, ...newEntries];
        
        return { success: true, count: newEntries.length };
    } catch (error) {
        console.error('Error storing embeddings:', error);
        throw new Error('Failed to store embeddings in vector database');
    }
}

/**
 * Searches the vector database for the top K most similar chunks.
 * 
 * @param {Array<number>} queryEmbedding - The embedding vector of the search query
 * @param {number} topK - Number of results to return
 * @returns {Promise<Array<Object>>} Top K matching document chunks with their similarity scores
 */
async function searchSimilar(queryEmbedding, topK = 3) {
    if (vectorStore.length === 0) {
        return [];
    }
    
    try {
        // Calculate similarity for all stored vectors
        const results = vectorStore.map(item => {
            const score = cosineSimilarity(queryEmbedding, item.embedding);
            return {
                id: item.id,
                text: item.text,
                metadata: item.metadata,
                score: score
            };
        });
        
        // Sort by highest score descending and take top K
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, topK);
        
    } catch (error) {
        console.error('Error searching vector store:', error);
        throw new Error('Failed to search vector database');
    }
}

/**
 * Clears the vector store (useful for testing or full resets).
 */
async function clearStore() {
    vectorStore = [];
    return { success: true };
}

module.exports = {
    storeEmbeddings,
    searchSimilar,
    clearStore
};
