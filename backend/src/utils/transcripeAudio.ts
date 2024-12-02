import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { AssemblyAI } from 'assemblyai';
import { fileURLToPath } from 'url';

dotenv.config();

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

const uploadLocalFile = async (filePath: string): Promise<string> => {
  console.log('Uploading file:', filePath);
  const fileStream = fs.createReadStream(filePath);

  try {
    const response = await axios.post(
      'https://api.assemblyai.com/v2/upload',
      fileStream,
      {
        headers: {
          authorization: process.env.ASSEMBLYAI_API_KEY || '',
          'content-type': 'application/octet-stream',
        },
      }
    );
    console.log('File uploaded successfully!');
    return response.data.upload_url;
  } catch (error) {
    console.error('Upload failed:', error.response?.data || error.message);
    throw error;
  }
};

const uploadWithRetry = async (
  filePath: string,
  retries = 3
): Promise<string> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await uploadLocalFile(filePath);
    } catch (error) {
      if (i < retries - 1) {
        console.log(`Retrying... (${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      } else {
        throw error;
      }
    }
  }
  return ''; // Fallback, should never reach here
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const transcribeVideo = async (filename: string) => {
  try {
    const filePath = path.resolve(__dirname, `../audios/${filename}.mp3`);
    console.log('Starting upload...');
    const audioUrl = await uploadWithRetry(filePath); // Retry logic
    console.log('Audio URL:', audioUrl);

    const transcript = await client.transcripts.transcribe({
      audio_url: audioUrl,
    });

    console.log('Transcription:', transcript.text);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
