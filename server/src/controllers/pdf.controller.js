const { deleteFile } = require('../services/pdf/pdf.service');
const { getCurrentFile, setCurrentFile, clearCurrentFile } = require('../services/uploadSession.service');

/**
 * Stores the uploaded PDF until the generation request consumes it.
 */
exports.uploadPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No PDF file uploaded.' });
        }

        const previousFilePath = getCurrentFile();
        if (previousFilePath) {
            deleteFile(previousFilePath);
        }

        setCurrentFile(req.file.path);

        return res.status(200).json({ 
            success: true, 
            message: 'PDF received and ready for generation.'
        });
        
    } catch (error) {
        console.error('Error in PDF upload controller:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'An error occurred while processing the PDF.',
            error: error.message 
        });
    }
};

exports.clearStore = async (req, res) => {
    try {
        const currentFilePath = getCurrentFile();

        if (currentFilePath) {
            deleteFile(currentFilePath);
        }

        clearCurrentFile();

        return res.status(200).json({ success: true, message: 'Pending upload cleared.' });
    } catch (error) {
        console.error('Error clearing pending upload:', error);
        return res.status(500).json({ success: false, message: 'Failed to clear pending upload.', error: error.message });
    }
};
