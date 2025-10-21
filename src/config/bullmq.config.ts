import { type ConnectionOptions, type DefaultJobOptions } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
};

export const defaultQueueOptions: DefaultJobOptions = {
  removeOnComplete: {
    count: 20,
    age: 60 * 60,
  },
  attempts: 5,
  backoff: {
    type: "exponential",
    delay: 1000,
    jitter: 0.5,
  },
  removeOnFail: {
    count: 100,
  },
  stackTraceLimit: 10,
};
