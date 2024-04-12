import fs from "node:fs/promises";
import yaml from "js-yaml";
import config from "../config/index.js";
import type { Shows } from "../types/show.js";

const showsData: Shows | null = null;

export const getShowsData = async (): Promise<Shows> => {
  if (!showsData) {
    const fileContent = await fs.readFile(`./${config.showsConfigFile}`);

    return yaml.load(fileContent.toString()) as Shows;
  }

  return showsData;
};
