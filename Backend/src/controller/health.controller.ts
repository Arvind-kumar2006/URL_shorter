import { healthService } from "../services/health.service";
import { Request , Response } from "express";
export const healthCheck = async (req : Request , res : Response) => {
      try {
            const result = await healthService();
            return res.status(200).json(result);
      } catch (error :any) {
            return res.status(500).json({
                  status : "error",
                  message : error.message
            })
      }
}