import { transcribeVideo } from '../utils/transcripeAudio';
import { youtubeAudioDownloader } from '../utils/youtubeAudioDonwloader';
import { processingYoutubeData } from './youtubePlaylistService';
import { generateFormattedText } from '../utils/formatingTextAi';
import { saveFormattedText } from '../utils/savingVideoAsMd';
import { convertMdToPdf } from '../utils/convertMdToPDF';

// Example
const PLAYLIST_ID: string = 'PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA';

const playListVideoProcessing = async () => {
  try {
    // All the play list videos
    const playListVideos: string[] = await processingYoutubeData(PLAYLIST_ID);

    // Iterator to iterate to all the videos array
    let videoIndex = 0;

    // For of loop to iterate to each video and proccessing it and saving it
    let language_code = '';

    for (const video of playListVideos) {
      try {
        await youtubeAudioDownloader(video);
      } catch (error) {
        continue;
      } // Function that downloads the video audio

      const transcribed = await transcribeVideo(video);

      if (!transcribed) {
        throw new Error(`undefined text and language code`);
      }

      const { text, code } = transcribed; // Function that trancribe the audio

      language_code = code;

      const fromatedText = await generateFormattedText(text!); // Function that formating the audio text by AI

      await saveFormattedText(fromatedText!, videoIndex, PLAYLIST_ID); // Function that save the formated text in markdown format
      videoIndex++;
    }

    console.log('All videos processed. Now converting to PDF...');

    // After Proccessing the video and save it, this function take all the proccessed videos and combine them to one pdf book
    await convertMdToPdf(PLAYLIST_ID, language_code);
  } catch (error) {
    throw new Error(`${error}`);
  }
};

// For testing
playListVideoProcessing();
