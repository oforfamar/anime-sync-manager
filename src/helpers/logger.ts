import pinoLogger from "pino";
import config from "../config/index.js";

export const logger = pinoLogger({
  level: config.log_level,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});
