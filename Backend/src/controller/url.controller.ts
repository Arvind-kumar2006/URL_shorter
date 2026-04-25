import { Request , Response } from "express";
import {shortenSchema} from "../validators/url.schema";
import {createShortUrlService} from "../services/url.service";
import {redirectService , listLinksService , deactivateLinkService} from "../services/url.service";



export const createShortUrl = async (req : Request , res : Response) => {
      try {
            const validateData = shortenSchema.parse(req.body);
            const result = await createShortUrlService(validateData);

            res.status(201).json({
                  shortCode : result.shortCode,
                  shortenSchema : `${req.protocol}://${req.get('host')}/${result.shortCode}`,
                  originalUrl : result.originalUrl,
                  expiresAt : result.expiresAt,
                  createdAt : result.createdAt
            })
      }catch (error : any) {
            res.status(400).json({message : error.message || "Something went wrong"});
      }
}
export const redirectToOriginal = async(req : Request , res :Response )=>{
      try {
            const {shortCode} = req.params;
            const code = Array.isArray(shortCode) ? shortCode[0] : shortCode;
            console.log("Received short code:", code); // Debug log
            const url = await redirectService(code, req);

            return res.redirect(301 , url.originalUrl);
      } catch (error : any) {
            res.status(404).json({message : error.message || "Something went wrong"});
      }
}

export const listLinks = async (req : Request , res : Response)=>{
      try {
            const page = Number(req.query.page ) || 1;
            const limit = Number(req.query.limit) || 20;

            const sort = req.query.sort ==="clicks" ? "clickCount" : "createdAt";

            // Call the service to get the list of links
            const result = await listLinksService({page , limit , sort });
          return res.status(200).json(result);

      } catch (error : any) {
            return res.status(500).json({
      message: error.message,
    });
}
}

export const deactivateLink = async (req : Request , res : Response) => {
      try {
            const {shortCode} = req.params;
            const code = Array.isArray(shortCode) ? shortCode[0] : shortCode;
            const result = await deactivateLinkService(code);
            return res.status(200).json({

      message: "Link deactivated successfully",

      data: result,

    });
      } catch (error :any ) {
          return res.status(error.statusCode || 500).json({
            message: error.message,
    });  
 }
}