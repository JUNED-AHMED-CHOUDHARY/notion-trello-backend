import { Queue, Worker } from "bullmq";
import { Redis, type CommonRedisOptions } from "ioredis";
import {
  defaultQueueOptions,
  redisConnection as DefaultRedisConnection,
} from "../../config/bullmq.config.js";

class BullMqSetup {
  private static instance: BullMqSetup;
  private redisClient: Redis;

  private static Queues: Map<string, Queue> = new Map();

  private constructor() {
    this.redisClient = new Redis(DefaultRedisConnection as CommonRedisOptions);
    this.redisClient
      .on("connect", () => {})
      .on("error", (e) => {
        console.log("io redis error ", e);
      });
  }

  public static getInstance(): BullMqSetup {
    if (!this.instance) this.instance = new BullMqSetup();
    return this.instance;
  }

  public createQueue(queueName: string): Queue {
    if (BullMqSetup.Queues.has(queueName))
      return BullMqSetup.Queues.get(queueName)!;

    const queue = new Queue(queueName, {
      connection: DefaultRedisConnection,
      prefix: process.env.NODE_ENV,
      defaultJobOptions: defaultQueueOptions,
    });

    BullMqSetup.Queues.set(queueName, queue);

    return queue;
  }

  public createWorker(queueName: string, processor: any) {
    return new Worker(queueName, processor, {
      connection: DefaultRedisConnection,
      prefix: process.env.NODE_ENV,
    });
  }

  public status() {
    return !!BullMqSetup.instance;
  }

  public async closeConnections() {
    await this.redisClient.quit();
    console.log("bull mq disconnet");
  }
}

export default BullMqSetup.getInstance();
