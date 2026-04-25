import { Request , Response } from "express";
import {shortenSchema} from "../validators/url.schema";
import {createShortUrlService} from "../services/url.service";
import {redirectService} from "../services/url.service";




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
      res.json({message : "List of all links"});
}

export const deactivateLink = async (req : Request , res : Response) => {
      res.json({message : "Link deactivated successfully"});
}