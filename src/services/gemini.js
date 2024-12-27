import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const geminiService = {
  async generateFromImage(imageFile, targetLanguage) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // Convertir l'image en base64
      const buffer = await imageFile.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      const prompt = `Convert this image to ${targetLanguage} code. Only provide the code without any additional comments or explanations.`;
      
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64,
            mimeType: imageFile.type
          }
        }
      ]);

      return result.response.text();
    } catch (error) {
      console.error('Error generating from image:', error);
      throw error;
    }
  },

  async convertCode(sourceCode, sourceLang, targetLang) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Convert this ${sourceLang} code to ${targetLang}. Only provide the converted code without any additional comments or explanations:

${sourceCode}`;
      
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error converting code:', error);
      throw error;
    }
  },

  async correctCode(code, instructions) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Correct this code according to these instructions. Only provide the corrected code without any additional comments or explanations.

Code:
${code}

Instructions:
${instructions}`;
      
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error correcting code:', error);
      throw error;
    }
  },

  async debugCode(code, description) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Debug this code based on the following description. Provide detailed debugging steps with emojis for better visualization.

Description of the issue:
${description}

Code:
${code}`;
      
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error debugging code:', error);
      throw error;
    }
  },

  async chatWithFile(file, message) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      let fileContent = '';
      if (file) {
        if (file.type.includes('image')) {
          const buffer = await file.arrayBuffer();
          fileContent = btoa(
            new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
        } else {
          fileContent = await file.text();
        }
      }

      const prompt = `Context: ${fileContent ? `File content:\n${fileContent}\n\n` : ''}
User question: ${message}`;
      
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error in file chat:', error);
      throw error;
    }
  },

  async programmerChat(message, file = null) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      let prompt = message;
      if (file) {
        const fileContent = await file.text();
        prompt = `Context: File content:\n${fileContent}\n\nUser question: ${message}`;
      }
      
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error in programmer chat:', error);
      throw error;
    }
  }
};
