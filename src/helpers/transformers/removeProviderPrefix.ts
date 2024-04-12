import type { TransformCallback } from "node:stream";
import config from "../../config/index.js";
import { logger } from "../logger.js";

export const removeProviderPrefix = (
  input: Buffer,
  _: BufferEncoding,
  callback: TransformCallback,
): void => {
  const file = input.toString().replace(config.provider, "").trim();

  logger.debug(
    JSON.stringify({
      order: 1,
      transformer: "removeProviderPrefixTransformer",
      file,
    }),
  );

  callback(null, file);
};
