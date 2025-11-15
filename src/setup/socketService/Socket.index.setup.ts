import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis, type CommonRedisOptions } from "ioredis";
import { Server as HttpServer } from "http";
import { redisConnection } from "../../config/bullmq.config.js";

class SocketServerSetup {
  private static instance: SocketServerSetup;
  private io: Server | null = null;
  private pubClient: Redis | null = null;
  private subClient: Redis | null = null;

  public static getInstance() {
    if (!SocketServerSetup.instance) {
      SocketServerSetup.instance = new SocketServerSetup();
    }
    return SocketServerSetup.instance;
  }

  private constructor() {}

  public async initialize(httpServer: HttpServer): Promise<void> {
    if (this.io) return;

    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      path: "/socket.io",
    });

    this.pubClient = new Redis(redisConnection as CommonRedisOptions);
    this.subClient = this.pubClient.duplicate();

    try {
      await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
      this.io.adapter(createAdapter(this.pubClient, this.subClient));
    } catch (error) {
      console.error(
        "Failed to connect Socket.IO to Redis. Running in single-node mode.",
        error,
      );
    }
    console.log("Socket.IO server initialized.");
  }

  public getIo(): Server | undefined {
    if (!this.io) {
      console.log(
        "Socket.IO has not been initialized. Please call initialize() first",
      );
      return;
    }
    return this.io;
  }

  public async close(): Promise<void> {
    this.io?.close();
    await this.pubClient?.quit();
    await this.subClient?.quit();
    console.log("Socket.IO server and Redis connections closed.");
  }
}

export default SocketServerSetup.getInstance();
