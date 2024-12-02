import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
const PLAYLIST_ID = 'PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb';
const BASE_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';

const fetchPlaylistItems = async () => {
  // const url = `${BASE_URL}?part=snippet,contentDetails&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;
  let items = [];
  let videos: any = [];
  let nextPageToken = null;

  try {
    do {
      const response: any = await axios.get(BASE_URL, {
        params: {
          part: 'snippet,contentDetails',
          playlistId: PLAYLIST_ID,
          maxResults: 50, // Maximum items per request
          pageToken: nextPageToken, // For pagination
          key: API_KEY,
        },
      });

      items.push(response.data.items);

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    // const playlistItemsContent = playlist.items.map((item: any) => item);
    const playlistItemsContent = items.map((item: any) => {
      return item.map((video: any) => {
        videos.push(video.contentDetails.videoId);
      });
    });

    console.log(videos);

    return items;
  } catch (error) {
    throw new Error(`There is an error in fetchPlaylistItems: ${error}`);
  }
};

fetchPlaylistItems();
