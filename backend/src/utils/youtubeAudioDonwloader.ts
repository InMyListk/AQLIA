import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "node:util";
import child_process from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import ytdl from "@distube/ytdl-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const youtubeAudioDownloader = async (
  videoID: string
): Promise<string> => {
  try {
    const videoURL = `https://www.youtube.com/watch?v=${videoID}`;
    console.log(`Downloading audio from: ${videoURL}`);

    // Define output directory and file name
    const outputDir = path.resolve(__dirname, "../audios");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `${videoID}.mp3`; // Use video ID as the file name
    const filePath = path.join(outputDir, fileName);

    // Start downloading audio

    // await new Promise<void>((resolve, reject) => {
    //   ytdl(videoURL, {
    //     quality: 'highestaudio',
    //     filter: 'audioonly',
    //   })
    //     .on('progress', (chunkSize, downloaded, total) => {
    //       const progress = ((downloaded / total) * 100).toFixed(2);
    //       console.log(`Progress: ${progress}%`);
    //     })
    //     .on('error', (err) => {
    //       console.error('Download error:', err);
    //       reject(err);
    //     })
    //     .on('end', () => {
    //       console.log('Download complete.');
    //       resolve();
    //     })
    //     .pipe(fs.createWriteStream(filePath));
    // });

    // Please install python then yt-dlp (pip install yt-dlp)

    const exec = promisify(child_process.exec);
    const ytDlpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "src",
      "bin",
      "yt-dlp",
      "yt-dlp.exe"
    );
    // const ffmpegPath = path.resolve(__dirname, "..", "bin", "ffmpeg");
    const outputPath = path.resolve(outputDir, fileName);
    const command = `yt-dlp -x https://www.youtube.com/watch?v=${videoID} --ffmpeg-location "${ffmpegPath}" -o "${outputPath}" --audio-format mp3`;
    const { stdout, stderr } = await exec(command);
    setTimeout(() => {});

    if (stderr) {
      console.error("Download error:", stderr);
      throw stderr;
    }

    console.log(`Audio saved at: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};
