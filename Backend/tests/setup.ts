import prisma from "../src/lib/prisma";
import redis from "../src/lib/redis";

afterAll(async () => {
  try {
    await prisma.$disconnect();
  } catch {}

  try {
    if (redis.isOpen) {
      await redis.quit();
    }
  } catch {}
});