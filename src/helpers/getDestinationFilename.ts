import { pipeline, Readable, Transform, Writable } from "node:stream";
import { promisify } from "node:util";
import {
  removeProviderPrefixTransformer,
  removeResolutionSuffixTransformer,
  convertToObjectTransformer,
} from "./transformers/index.js";

const pipelinePromise = promisify(pipeline);

export const getDestinationFilename = async (
  inputFileName: string,
): Promise<string> => {
  let destinationFileName = "";

  const fileReadable = Readable.from(inputFileName);

  const removeProviderPrefix = new Transform({
    transform: removeProviderPrefixTransformer,
  });

  const removeResolutionSuffix = new Transform({
    transform: removeResolutionSuffixTransformer,
  });

  const convertToObject = new Transform({
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    transform: convertToObjectTransformer,
  });

  const saveFullnameToVariable = new Writable({
    write(chunk: Buffer, _, callback): void {
      const input = chunk.toString();

      if (input === "NOT_PROCESSED") {
        destinationFileName = input;
        return callback();
      }

      destinationFileName = input;

      callback();
    },
  });

  await pipelinePromise(
    fileReadable,
    removeProviderPrefix,
    removeResolutionSuffix,
    convertToObject,
    saveFullnameToVariable,
  );

  return destinationFileName;
};
