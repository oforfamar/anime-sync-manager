import { describe, it, expect, vi, type Mock } from "vitest";
import { logger } from "./helpers/logger.js";
import { getFilesInFolder, moveFile } from "./helpers/fileHelpers.js";
import { getDestinationFilename } from "./helpers/getDestinationFilename.js";
import { main } from "./index.js";

vi.mock("./helpers/logger.js", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("./helpers/fileHelpers.js", () => ({
  getFilesInFolder: vi.fn(),
  moveFile: vi.fn(),
}));

vi.mock("./helpers/getDestinationFilename.js", () => ({
  getDestinationFilename: vi.fn(),
}));

describe("index.ts", () => {
  it("should do nothing if no files are present in the folder", async () => {
    (getFilesInFolder as Mock).mockResolvedValue([]);

    await main();

    expect(logger.info).toBeCalledWith(
      `12-04-2024 - Starting the process on...`,
    );
  });

  it("should move the files to the destination folder", async () => {
    (getFilesInFolder as Mock).mockResolvedValue([
      "[Provider] file1.mp4",
      "[Provider] file2.mp4",
    ]);
    (getDestinationFilename as Mock)
      .mockResolvedValueOnce("file1.mp4")
      .mockResolvedValueOnce("file2.mp4");

    await main();

    expect(logger.info).toBeCalledWith(
      `12-04-2024 - Starting the process on...`,
    );

    expect(getDestinationFilename).toBeCalledWith("[Provider] file1.mp4");
    expect(getDestinationFilename).toBeCalledWith("[Provider] file2.mp4");

    expect(moveFile).toBeCalledWith(
      "/path/to/source/folder/[Provider] file1.mp4",
      "/path/to/destination/folder/file1.mp4",
    );
    expect(moveFile).toBeCalledWith(
      "/path/to/source/folder/[Provider] file2.mp4",
      "/path/to/destination/folder/file2.mp4",
    );

    expect(logger.info).toBeCalledWith(
      "/path/to/source/folder/[Provider] file1.mp4 -> /path/to/destination/folder/file1.mp4",
    );
    expect(logger.info).toBeCalledWith(
      "/path/to/source/folder/[Provider] file2.mp4 -> /path/to/destination/folder/file2.mp4",
    );
  });

  it("should skip the file if it is not found in the shows data", async () => {
    (getFilesInFolder as Mock).mockResolvedValue([
      "[Provider] file1.mp4",
      "[Provider] file2.mp4",
    ]);
    (getDestinationFilename as Mock)
      .mockResolvedValueOnce("file1.mp4")
      .mockResolvedValueOnce("NOT_PROCESSED");

    await main();

    expect(logger.info).toBeCalledWith(
      `12-04-2024 - Starting the process on...`,
    );

    expect(getDestinationFilename).toBeCalledWith("[Provider] file1.mp4");
    expect(getDestinationFilename).toBeCalledWith("[Provider] file2.mp4");

    expect(moveFile).toBeCalledWith(
      "/path/to/source/folder/[Provider] file1.mp4",
      "/path/to/destination/folder/file1.mp4",
    );

    expect(logger.info).toBeCalledWith(
      "/path/to/source/folder/[Provider] file1.mp4 -> /path/to/destination/folder/file1.mp4",
    );

    expect(logger.warn).toBeCalledWith(
      "[Provider] file2.mp4 was not found in shows data, skipping!",
    );
  });

  it("should throw an error if getFilesInFolder throws an error", async () => {
    const error = new Error("Some error");
    (getFilesInFolder as Mock).mockRejectedValue(error);

    await main();

    expect(logger.error).toBeCalledWith(
      "An error occurred when trying to move the files.",
    );
    expect(logger.error).toBeCalledWith(error);
  });
});
