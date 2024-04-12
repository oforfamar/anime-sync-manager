import type { Config } from "../types/config.js";

const config: Config = {
  log_level: process.env.log_level ?? "info",
  showsConfigFile: process.env.showsConfigFile ?? "",
  sourceFolder: process.env.sourceFolder ?? "",
  destinationBasePath: process.env.destinationBasePath ?? "",
  provider: process.env.provider ?? "",
  resolution: process.env.resolution ?? "",
  extension: process.env.extension ?? "",
  delimiter: process.env.delimiter ?? "",
  uid: Number(process.env.uid),
  gid: Number(process.env.gid),
};

export default config;
