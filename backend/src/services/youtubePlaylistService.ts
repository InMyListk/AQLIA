import { fetchPlaylistItems } from '../repository/youtubePlaylistRepo';

export const processingYoutubeData = async (
  playlistID: string
): Promise<string[]> => {
  const playlistItems = await fetchPlaylistItems(playlistID);
  let videos: string[] = [];

  playlistItems.map((item: any) => {
    return item.map((video: any) => {
      videos.push(video.contentDetails.videoId);
    });
  });

  return videos;
};
