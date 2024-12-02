import { fetchPlaylistItems } from '../repository/youtubePlaylistRepository';

const PLAYLIST_ID: string = 'PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb';

export const processingYoutubeData = async (): Promise<string[]> => {
  const playlistItems = await fetchPlaylistItems(PLAYLIST_ID);
  let videos: string[] = [];

  playlistItems.map((item: any) => {
    return item.map((video: any) => {
      videos.push(video.contentDetails.videoId);
    });
  });

  // console.log(videos);

  return videos;
};
