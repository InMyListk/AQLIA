import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const youtubeAudioDownloader = async (
  videoID: string
): Promise<string> => {
  try {
    const videoURL = `https://www.youtube.com/watch?v=${videoID}`;
    console.log(`Downloading audio from: ${videoURL}`);

    // Define output directory and file name
    const outputDir = path.resolve(__dirname, '../audios');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `${videoID}.mp3`; // Use video ID as the file name
    const filePath = path.join(outputDir, fileName);

    // Start downloading audio
    await new Promise<void>((resolve, reject) => {
      ytdl(videoURL, {
        quality: 'highestaudio',
        filter: 'audioonly',
      })
        .on('progress', (chunkSize, downloaded, total) => {
          const progress = ((downloaded / total) * 100).toFixed(2);
          console.log(`Progress: ${progress}%`);
        })
        .on('error', (err) => {
          console.error('Download error:', err);
          reject(err);
        })
        .on('end', () => {
          console.log('Download complete.');
          resolve();
        })
        .pipe(fs.createWriteStream(filePath));
    });

    console.log(`Audio saved at: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
};

// Example usage
// youtubeAudioDownloader('DTxHyVn0ODg')
//   .then((filePath) => console.log(`Audio file downloaded to: ${filePath}`))
//   .catch((error) => console.error('Failed to download audio:', error));
