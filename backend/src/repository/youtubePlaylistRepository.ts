import axios from 'axios';
import { YouTubePlaylistResponseType } from '../models/YoutubeModel';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY: string = process.env.GOOGLE_API_KEY as string;
const BASE_URL: string = 'https://www.googleapis.com/youtube/v3/playlistItems';

export const fetchPlaylistItems = async (playlistID: string) => {
  // const url = `${BASE_URL}?part=snippet,contentDetails&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;
  let items = [];
  let nextPageToken = null;

  try {
    do {
      const response: { data: YouTubePlaylistResponseType } = await axios.get(
        BASE_URL,
        {
          params: {
            part: 'snippet,contentDetails',
            playlistId: playlistID,
            maxResults: 50, // Maximum items per request
            pageToken: nextPageToken, // For pagination
            key: API_KEY,
          },
        }
      );

      items.push(response.data.items);

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return items;
  } catch (error) {
    throw new Error(`There is an error in fetchPlaylistItems: ${error}`);
  }
};
