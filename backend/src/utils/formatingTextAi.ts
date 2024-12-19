import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

export const generateFormattedText = async (
  text: string
): Promise<string | undefined> => {
  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMENI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // AI Prompt for Markdown formatting
    const AiPrompt = `
      You are an AI model that formats text into Markdown (.md) for a book page layout. 
      Format the following text into valid Markdown format, ensuring it is well-organized and readable.

      Here is the text:

      {${text}}

      Make sure the output:
      - Uses the original language from the text
      - Uses valid Markdown syntax for headings, paragraphs, lists, and emphasis where appropriate.
      - Is clean, professional, and does not include these instructions.
      - Reads like a well-organized section of a book or article.
    `;

    // Get AI-formatted text
    const result = await model.generateContent(AiPrompt);
    const formattedMarkdown: string = result.response.text() as string;
    // Post-process the Markdown for right-to-left layout

    console.log('Formatted Markdown Text:', formattedMarkdown);

    return formattedMarkdown;
  } catch (error) {
    console.error('Error formatting text to PDF:', error);
  }
};
