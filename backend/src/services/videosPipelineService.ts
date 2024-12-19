import { transcribeVideo } from '../utils/transcripeAudio';
import { youtubeAudioDownloader } from '../utils/youtubeAudioDonwloader';
import { processingYoutubeData } from './youtubePlaylistService';
import { generateFormattedText } from '../utils/formatingTextAi';
import { saveFormattedText } from '../utils/savingVideoAsMd';
import { convertMdToPdf } from '../utils/convertMdToPDF';

// Example
const PLAYLIST_ID: string = 'PL8pYI62gCNsXfVcwXprTbJEWxQg3qlUur';

const playListVideoProcessing = async () => {
  try {
    // All the play list videos
    const playListVideos: string[] = await processingYoutubeData(PLAYLIST_ID);

    // Iterator to iterate to all the videos array
    let videoIndex = 0;

    // For of loop to iterate to each video and proccessing it and saving it
    for (const video of playListVideos) {
      await youtubeAudioDownloader(video); // Function that downloads the video audio

      const videoText = await transcribeVideo(video); // Function that trancribe the audio

      const fromatedText = await generateFormattedText(videoText!); // Function that formating the audio text by AI

      await saveFormattedText(fromatedText!, videoIndex, PLAYLIST_ID); // Function that save the formated text in markdown format
      videoIndex++;
    }

    // After Proccessing the video and save it, this function take all the proccessed videos and combine them to one pdf book
    await convertMdToPdf(PLAYLIST_ID);
  } catch (error) {
    throw new Error(`${error}`);
  }
};

// For testing
playListVideoProcessing();
