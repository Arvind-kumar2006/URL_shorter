
import { Request , Response } from "express";
import { getAnalyticsService } from "../services/analytics.service";

type Params = {
      shortCode : string
}

export const getAnalytics = async (req : Request<Params> , res : Response, next: Function) => {
      try {
            const {shortCode } = req.params;

            const result = await getAnalyticsService(shortCode);

            return res.status(200).json(result);

      } catch (error : any) {
            
            next(error);
      }
}