import fs from 'fs';
import { fileURLToPath } from 'url';
import markdownPdf from 'markdown-pdf';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const saveFormattedText = async (
  text: string,
  videoIndex: number,
  playlist_id: string
) => {
  try {
    const MarkdownDir = path.resolve(__dirname, `../OutputFiles/Markdown`);

    // Create the folder if it dosn't exist
    if (!fs.existsSync(MarkdownDir)) {
      fs.mkdirSync(MarkdownDir, { recursive: true });
    }

    const markdownFile = `${playlist_id}${videoIndex}.md`;

    const mdOutputPath = path.resolve(
      __dirname,
      `../OutputFiles/Markdown/${markdownFile}`
    );

    // Save the Markdown content to a file
    fs.writeFileSync(mdOutputPath, text, 'utf8');
  } catch (error) {
    throw new Error(`Error saving the file error: ${error}`);
  }
};
