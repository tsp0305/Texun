const { generateArticleViaAgent } = require('../services/pythonAgent.service');
const { getCurrentFile, clearCurrentFile } = require('../services/uploadSession.service');
const { deleteFile } = require('../services/pdf/pdf.service');

/**
 * Forwards content generation to the Python workflow while preserving the frontend contract.
 */
exports.generateBlog = async (req, res) => {
    const filePath = getCurrentFile();

    try {
        const { topic, articleLength, customPrompt } = req.body;
        
        if (!topic || topic.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a topic for the blog post.' 
            });
        }

        if (!filePath) {
            return res.status(404).json({
                success: false,
                message: 'No PDF has been uploaded yet. Upload a source PDF before generating.',
            });
        }
        
        const promptText = customPrompt && customPrompt.trim().length > 0
            ? customPrompt.trim()
            : `Write an SEO article about ${topic}${articleLength ? ` at approximately ${articleLength} words` : ''}.`;

        const result = await generateArticleViaAgent(filePath, promptText);
        
        return res.status(200).json({
            success: true,
            data: {
                topic,
                content: result.article
            }
        });
        
    } catch (error) {
        console.error('Error in RAG generate controller:', error);
        
        return res.status(500).json({ 
            success: false, 
            message: 'An error occurred while generating the blog post.',
            error: error.message 
        });
    } finally {
        if (filePath) {
            deleteFile(filePath);
            clearCurrentFile();
        }
    }
};
