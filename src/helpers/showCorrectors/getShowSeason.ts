import { getShowsData } from "../getShowsData.js";

export const getShowSeasonNumber = async (
  showName: string,
): Promise<string> => {
  const showsData = await getShowsData();

  return (showsData.shows[showName]?.season ?? 1).toString().padStart(2, "0");
};

const calculateSubFolder = (episode: number): string => {
  let check = 100;
  while (check <= episode) {
    check += 100;
  }

  return `${check - 99}-${check}`;
};

export const getShowSeasonFolder = async (
  showName: string,
  season: string,
  episode: string,
): Promise<string> => {
  const showsData = await getShowsData();

  if (!showsData.shows[showName]?.isLongRunning) {
    return `Season ${season}`;
  }

  return `Season 01/${calculateSubFolder(Number(episode))}`;
};
