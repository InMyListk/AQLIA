import { transcribeVideo } from '../utils/transcripeAudio';
import { youtubeAudioDownloader } from '../utils/youtubeAudioDonwloader';
import { processingYoutubeData } from './youtubePlaylistService';
import { generateFormattedText } from '../utils/formatingTextAi';
import { saveFormattedText } from '../utils/savingVideoAsMd';
import { convertMdToPdf } from '../utils/convertMdToPDF';

// Example
const PLAYLIST_ID: string = 'PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA';

class YouTubeVideosPipeline {
  private async processVideo(
    videoID: string,
    index: number,
    playlistID?: string
  ): Promise<string> {
    await youtubeAudioDownloader(videoID);
    const transcribed = await transcribeVideo(videoID);

    if (!transcribed) {
      throw new Error(`Undefined text and language code`);
    }

    const { text, code } = transcribed;
    const formattedText = await generateFormattedText(text!);
    await saveFormattedText(formattedText!, index, playlistID, videoID);

    return code;
  }

  async playListVideosProcessing(playlistID: string): Promise<void> {
    try {
      const playListVideos: string[] = await processingYoutubeData(playlistID);

      let videoIndex = 0;
      let languageCode = '';

      for (const video of playListVideos) {
        try {
          languageCode = await this.processVideo(video, videoIndex, playlistID);
          videoIndex++;
          console.log(`Finished processing video ${videoIndex}`);
        } catch (error) {
          console.error(`Error processing video: ${video}, skipping.`, error);
          continue;
        }
      }

      console.log('All videos processed. Now converting to PDF...');
      await convertMdToPdf(languageCode, undefined, playlistID);
    } catch (error) {
      console.error('Failed to process playlist videos.', error);
    }
  }

  async videoProcessing(videoID: string): Promise<void> {
    try {
      const languageCode = await this.processVideo(videoID, 0);
      console.log(`Finished processing video`);
      await convertMdToPdf(languageCode, videoID);
    } catch (error) {
      console.error('Failed to process video.', error);
    }
  }
}

// For testing

const YoutubeVideosPiplineObj = new YouTubeVideosPipeline();

// YoutubeVideosPiplineObj.playListVideosProcessing(PLAYLIST_ID);
YoutubeVideosPiplineObj.videoProcessing('sTJct25q69w');
