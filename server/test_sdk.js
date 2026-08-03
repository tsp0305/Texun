const { GoogleGenAI } = require('@google/genai');
console.log('GoogleGenAI class:', GoogleGenAI);
try {
    const ai = new GoogleGenAI();
    console.log('Instance created successfully:', ai);
} catch (err) {
    console.error('Error during instantiation:', err);
}
