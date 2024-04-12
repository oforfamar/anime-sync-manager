import type { TransformCallback } from "node:stream";
import config from "../../config/index.js";
import { getShowsData } from "../getShowsData.js";
import {
  getCorrectFileName,
  getCorrectSeason,
  getCorrectSeasonFolder,
  getCorrectShowName,
} from "../showCorrectors/index.js";

const extractShowNameAndEpisode = (input: string): [string, string] => {
  const parts = input.split(config.delimiter);

  if (parts.length === 2) {
    return [parts[0], parts[1]];
  }

  // it's possible the show contains the delimiter in the name
  // for this reason we remove the episode and join the rest in a single string
  const episode = parts.pop() as string;
  const showName = parts.join(config.delimiter);

  return [showName, episode];
};

export const convertToObject = async (
  chunk: Buffer,
  _: BufferEncoding,
  callback: TransformCallback,
): Promise<void> => {
  try {
    const showsData = await getShowsData();

    const [showName, episode] = extractShowNameAndEpisode(chunk.toString());

    // ignore files that are not found in shows file
    if (showName in showsData.shows === false) {
      return callback(null, "NOT_PROCESSED");
    }

    const correctShowName = await getCorrectShowName(showName);
    const correctSeasonNumber = await getCorrectSeason(showName);
    const correctSeasonFolder = await getCorrectSeasonFolder(
      showName,
      correctSeasonNumber,
      episode,
    );
    const correctFileName = await getCorrectFileName(
      showName,
      correctShowName,
      correctSeasonNumber,
      episode,
    );

    const fileArr = [correctShowName, correctSeasonFolder, correctFileName];

    callback(null, fileArr.join("/"));
  } catch (error) {
    callback(error as Error);
  }
};
