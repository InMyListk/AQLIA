export type PlaylistItemType = {
  kind: 'youtube#playlistItem';
  etag: string;
  id: string;
  snippet: {
    publishedAt: string; // ISO 8601 datetime string
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      [key: string]: {
        url: string;
        width: number; // unsigned integer
        height: number; // unsigned integer
      };
    };
    channelTitle: string;
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
    playlistId: string;
    position: number; // unsigned integer
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
  contentDetails: {
    videoId: string;
    startAt?: string; // optional
    endAt?: string; // optional
    note?: string; // optional
    videoPublishedAt: string; // ISO 8601 datetime string
  };
  status: {
    privacyStatus: string;
  };
};

export type YouTubePlaylistResponseType = {
  nextPageToken: Number;
  kind: string;
  etag: string;
  items: PlaylistItemType[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};
