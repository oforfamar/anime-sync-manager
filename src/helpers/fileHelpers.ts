import fs from "node:fs/promises";
import path from "node:path";
import config from "../config/index.js";
import { logger } from "./logger.js";

export const getFilesInFolder = async (
  folderPath: string,
): Promise<string[]> => {
  try {
    const files = await fs.readdir(folderPath);
    return files;
  } catch (error) {
    logger.error(`Error reading files from directory: "${folderPath}"`);
    logger.error(error);
    return [];
  }
};

const createFolders = async (dest: string): Promise<void> => {
  const dir = path.dirname(dest);

  try {
    // will throw error if folder doesn't exist
    await fs.stat(dir);
  } catch (error) {
    await fs.mkdir(dir, { recursive: true });
  }
};

export const moveFile = async (src: string, dest: string): Promise<void> => {
  try {
    const stat = await fs.stat(src);

    if (!stat.isFile()) {
      throw new Error(`${src} is not a file`);
    }

    await createFolders(dest);

    await fs.copyFile(src, dest);
    await fs.unlink(src);

    // change user and group
    await fs.chown(dest, config.uid, config.gid);
  } catch (error) {
    logger.error(`Error moving file ${src} to ${dest}`);
    logger.error(error);
  }
};
