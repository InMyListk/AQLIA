import { transcribeVideo } from '../utils/transcripeAudio';
import { youtubeAudioDownloader } from '../utils/youtubeAudioDonwloader';
import { processingYoutubeData } from './youtubePlaylistService';

const formatedVideo = async () => {
  try {
    const videos: string[] = await processingYoutubeData();
    await youtubeAudioDownloader(videos[0]);
    const videoText = await transcribeVideo(videos[0]);
    console.log(videoText);
  } catch (error) {
    throw new Error(`${error}`);
  }
};

formatedVideo();
