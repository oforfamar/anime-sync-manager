import "./env.js";
import config from "./config/index.js";
import { getFilesInFolder, moveFile } from "./helpers/fileHelpers.js";
import { getDestinationFilename } from "./helpers/getDestinationFilename.js";
import { logger } from "./helpers/logger.js";

const main = async (): Promise<void> => {
  const currentDate = new Date();
  const formattedDate = [
    currentDate.getDate(),
    (currentDate.getMonth() + 1).toString().padStart(2, "0"),
    currentDate.getFullYear(),
  ].join("-");
  logger.info(`${formattedDate} - Starting the process on...`);

  try {
    const files = await getFilesInFolder(config.sourceFolder);

    for (const file of files) {
      const sourceFile = `${config.sourceFolder}/${file}`;
      const destinationFileName = await getDestinationFilename(file);

      if (destinationFileName === "NOT_PROCESSED") {
        logger.warn(`${file} was not found in shows data, skipping!`);
        continue;
      }

      const destinationFile = `${config.destinationBasePath}/${destinationFileName}`;

      await moveFile(sourceFile, destinationFile);

      logger.info(`${sourceFile} -> ${destinationFile}`);
    }
  } catch (error) {
    logger.error("An error occurred when trying to move the files.");
    logger.error(error);
  }
};

await main();
