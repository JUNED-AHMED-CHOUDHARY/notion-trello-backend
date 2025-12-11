import { prisma } from "../setup/prisma.setup.js";

let isPinging = false;

const KEEP_ALIVE_INTERVAL = 3 * 60 * 1000; // 3 minutes

const keepAliveNeonDb = async () => {
  if (isPinging) {
    console.log("Skipping keep-alive: previous ping still running");
    return;
  }

  isPinging = true;

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Neon keep-alive ping sent");
  } catch (err) {
    console.error("Neon keep-alive error:", err);

    // Try reconnecting Prisma safely
    try {
      await prisma.$disconnect();
      await prisma.$connect();
      console.log("Prisma reconnected after failure");
    } catch (reconnectErr) {
      console.error("Prisma reconnection failed:", reconnectErr);
    }
  } finally {
    isPinging = false;
  }
};

const interval = setInterval(keepAliveNeonDb, KEEP_ALIVE_INTERVAL);

// Graceful shutdown
process.on("SIGTERM", () => {
  clearInterval(interval);
  prisma.$disconnect();
  console.log("Server shutting down gracefully");
});

process.on("SIGINT", () => {
  clearInterval(interval);
  prisma.$disconnect();
  console.log("Server interrupted, shutting down gracefully");
});
