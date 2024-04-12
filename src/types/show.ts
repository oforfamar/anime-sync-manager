interface Show {
  correctName?: string;
  season?: number;
  isLongRunning?: boolean;
  episodeNumberOffset?: number;
}

export interface Shows {
  shows: Record<string, Show>;
}
