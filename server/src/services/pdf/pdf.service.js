const fs = require('fs');
const pdfParse = require('pdf-parse');

/**
 * Extracts text from a PDF file.
 * 
 * @param {string} filePath - The path to the uploaded PDF file.
 * @returns {Promise<string>} The extracted text.
 */
async function extractTextFromPDF(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        
        return data.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to extract text from PDF');
    }
}

/**
 * Securely deletes a file from the filesystem.
 * 
 * @param {string} filePath - The path to the file to delete.
 */
function deleteFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Successfully deleted file: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error deleting file at ${filePath}:`, error);
        // We don't throw here to avoid failing the main process if cleanup fails, 
        // but in a production environment, you might want to log this to a monitoring service.
    }
}

module.exports = {
    extractTextFromPDF,
    deleteFile
};
