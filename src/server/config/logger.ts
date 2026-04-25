import pino from "pino";

import { env } from "@/server/config/env";

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  base: undefined,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.password",
      "*.token",
      "*.secret",
      "*.apiKey",
    ],
    remove: true,
  },
});

