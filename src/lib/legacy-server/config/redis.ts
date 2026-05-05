import IORedis from "ioredis";

import { env } from "@/lib/legacy-server/config/env";

declare global {
  // eslint-disable-next-line no-var
  var __redis: IORedis | undefined;
}

function createRedis() {
  return new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
    lazyConnect: false,
  });
}

export const redis: IORedis = globalThis.__redis ?? createRedis();
if (env.NODE_ENV !== "production") globalThis.__redis = redis;

