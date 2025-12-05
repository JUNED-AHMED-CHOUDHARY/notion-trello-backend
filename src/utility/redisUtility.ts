import redisClient from "../setup/redis.setup.js";

const DEFAULT_TTL = 24 * 60 * 60; // 24 hours in seconds
const APP_PREFIX = "notion-trello";

export const getDataFromRedis = async <T>(redisKey: string): Promise<T | undefined | null> => {
  try {
    const key = `${APP_PREFIX}:${redisKey}`;
    let data: any = await redisClient.get(key);
    if (data) data = JSON.parse(data);
    return data;
  } catch (error) {
    console.error(`Error getting data from Redis for key ${redisKey}:`, error);
    throw error;
  }
};

export const storeInCacheWithTTL = async (redisKey: string, data: string | number, ttl: number = DEFAULT_TTL): Promise<"OK"> => {
  try {
    const key = `${APP_PREFIX}:${redisKey}`;
    return await redisClient.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting data in Redis for key ${redisKey}:`, error);
    throw error;
  }
};
