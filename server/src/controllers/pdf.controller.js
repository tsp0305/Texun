const { extractTextFromPDF, deleteFile } = require('../services/pdf/pdf.service');
const { chunkText } = require('../utils/chunking.util');
const { generateEmbeddings } = require('../services/vector/embedding.service');
const { storeEmbeddings } = require('../services/vector/vector.service');

/**
 * Handles the PDF upload, text extraction, chunking, and embedding generation process.
 */
exports.uploadPDF = async (req, res) => {
    let filePath = null;
    
    try {
        // 1. Check if file exists in request
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No PDF file uploaded.' });
        }
        
        filePath = req.file.path;
        
        // 2. Extract text from PDF
        const extractedText = await extractTextFromPDF(filePath);
        
        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Could not extract text from the provided PDF.' });
        }
        
        // 3. Chunk the text
        const chunks = chunkText(extractedText, 1000, 200);
        
        if (chunks.length === 0) {
            return res.status(400).json({ success: false, message: 'Extracted text was too short or empty.' });
        }
        
        // 4. Generate Embeddings via OpenAI
        const embeddingsData = await generateEmbeddings(chunks);
        
        // 5. Store in Vector Database
        const metadata = { filename: req.file.originalname };
        await storeEmbeddings(embeddingsData, metadata);
        
        // 6. Return success
        return res.status(200).json({ 
            success: true, 
            message: 'PDF processed successfully.',
            chunksProcessed: chunks.length
        });
        
    } catch (error) {
        console.error('Error in PDF upload controller:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'An error occurred while processing the PDF.',
            error: error.message 
        });
    } finally {
        // 7. MUST delete PDF file after processing, regardless of success or failure
        if (filePath) {
            deleteFile(filePath);
        }
    }
};
