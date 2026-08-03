/**
 * Splits extracted text into smaller chunks with a specified size and overlap.
 * 
 * @param {string} text - The extracted text from the PDF.
 * @param {number} chunkSize - Maximum characters per chunk (approximate).
 * @param {number} overlap - Number of overlapping characters between chunks.
 * @returns {Array<string>} An array of text chunks.
 */
function chunkText(text, chunkSize = 1000, overlap = 200) {
    if (!text || typeof text !== 'string') return [];
    
    // Normalize whitespace
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    
    const chunks = [];
    let startIndex = 0;
    
    while (startIndex < normalizedText.length) {
        // Find the end index for the current chunk
        let endIndex = startIndex + chunkSize;
        
        // If we're not at the very end of the text, try to find a natural break point (like a space or punctuation)
        if (endIndex < normalizedText.length) {
            // Search backwards from endIndex for a space to avoid cutting words in half
            let spaceIndex = normalizedText.lastIndexOf(' ', endIndex);
            
            // If we found a space and it's not too far back (e.g., within the last 100 chars of the chunk)
            if (spaceIndex > startIndex && endIndex - spaceIndex < 100) {
                endIndex = spaceIndex;
            }
        }
        
        // Push the chunk
        chunks.push(normalizedText.substring(startIndex, endIndex).trim());
        
        // Advance the start index, considering the overlap
        startIndex = endIndex - overlap;
        
        // Ensure we don't get stuck in an infinite loop if overlap >= chunkSize (shouldn't happen with valid inputs)
        if (startIndex <= 0 || endIndex - startIndex <= 0) {
            startIndex = endIndex;
        }
    }
    
    return chunks;
}

module.exports = {
    chunkText
};
