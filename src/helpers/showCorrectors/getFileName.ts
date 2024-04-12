import config from "../../config/index.js";
import { getShowsData } from "../getShowsData.js";

export const getFileName = async (
  originalShowName: string,
  showName: string,
  seasonNumber: string,
  episode: string,
): Promise<string> => {
  const showsData = await getShowsData();

  const show = showsData.shows[originalShowName];

  let correctEpisode = Number(episode);

  if (show.episodeNumberOffset) {
    correctEpisode = correctEpisode - show.episodeNumberOffset;
  }

  const episodeString = correctEpisode.toString().padStart(2, "0");

  return `${showName} - s${seasonNumber}e${episodeString}.${config.extension}`;
};
