import { time, timeStamp } from "node:console";
import prisma from "../lib/prisma";

export const healthService = async () => {
      await prisma.$queryRaw`SELECT 1`;
      return {
            status : "ok" , 
            postgres : "connected" , 
            uptime : Math.floor(process.uptime()),
            timeStamp : new Date().toISOString()
      }
}