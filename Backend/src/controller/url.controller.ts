import { Request , Response , NextFunction} from "express";
import {createShortUrlService} from "../services/url.service";
import {redirectService , listLinksService , deactivateLinkService} from "../services/url.service";


import { generateQRCode } from "../utils/qr";

export const createShortUrl = async (req : Request , res : Response , next : NextFunction) => {
      try {
            
            const result = await createShortUrlService(req.body);

            const shortUrl =`${process.env.BASE_URL}/${result.shortCode}`;
            const qrCode = await generateQRCode(shortUrl);

            res.status(201).json({
                  shortCode : result.shortCode,
                  shortenSchema : `${req.protocol}://${req.get('host')}/${result.shortCode}`,
                  originalUrl : result.originalUrl,
                  expiresAt : result.expiresAt,
                  createdAt : result.createdAt,
                  qrCode : qrCode
            })
      }catch (error : any) {
              console.error(error);
            next(error);
      }
}
export const redirectToOriginal = async(req : Request , res :Response , next : NextFunction)=>{
      try {
            const {shortCode} = req.params;
            const code = Array.isArray(shortCode) ? shortCode[0] : shortCode;
            console.log("Received short code:", code); // Debug log
            const url = await redirectService(code, req);

            return res.redirect(302 , url.originalUrl);
      } catch (error : any) {
            next(error);
      }
}

export const listLinks = async (req : Request , res : Response , next : NextFunction)=>{
      try {
            const page = Number(req.query.page ) || 1;
            const limit = Number(req.query.limit) || 20;

            const sort = req.query.sort ==="clicks" ? "clickCount" : "createdAt";

            // Call the service to get the list of links
            const result = await listLinksService({page , limit , sort });
          return res.status(200).json(result);

      } catch (error : any) {
            next(error);
      }
}

export const deactivateLink = async (req : Request , res : Response , next : NextFunction) => {
      try {
            const {shortCode} = req.params;
            const code = Array.isArray(shortCode) ? shortCode[0] : shortCode;
            const result = await deactivateLinkService(code);
            return res.status(200).json({

      message: "Link deactivated successfully",

      data: result,

    });
      } catch (error :any ) {
          next(error);
 }
}