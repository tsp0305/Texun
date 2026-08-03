const { generateBlogContent } = require('../services/rag/rag.service');

/**
 * Handles requests to generate a blog post using the RAG pipeline.
 */
exports.generateBlog = async (req, res) => {
    try {
        const { topic, articleLength, customPrompt } = req.body;
        
        if (!topic || topic.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a topic for the blog post.' 
            });
        }
        
        // Generate the blog content using RAG service
        const blogContent = await generateBlogContent(topic, articleLength, customPrompt);
        
        return res.status(200).json({
            success: true,
            data: {
                topic,
                content: blogContent
            }
        });
        
    } catch (error) {
        console.error('Error in RAG generate controller:', error);
        
        // Check for specific error thrown when vector store is empty
        if (error.message.includes('No context found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: 'An error occurred while generating the blog post.',
            error: error.message 
        });
    }
};
