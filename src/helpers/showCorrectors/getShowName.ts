import { getShowsData } from "../getShowsData.js";

export const getShowName = async (showName: string): Promise<string> => {
  const showsData = await getShowsData();

  return showsData.shows[showName]?.correctName ?? showName;
};
