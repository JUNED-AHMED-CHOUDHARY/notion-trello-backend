import { Redis, type CommonRedisOptions } from "ioredis";
import dotenv from "dotenv";
import { redisConnection } from "../config/bullmq.config.js";

dotenv.config();

export const redisClient = new Redis(redisConnection as CommonRedisOptions);

redisClient.on("ready", () => {
  console.log("redis ready");
});

export default redisClient;
