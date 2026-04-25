import QRCode from "qrcode";
import { Request, Response, NextFunction } from "express";
export const getQRCode = async (
 req: Request,
 res: Response,
 next: NextFunction
) => {
 try {
   const { shortCode } = req.params;

   const shortUrl =
   `${process.env.BASE_URL}/${shortCode}`;

   const buffer =
   await QRCode.toBuffer(shortUrl);

   res.setHeader(
     "Content-Type",
     "image/png"
   );

   return res.send(buffer);

 } catch (error) {
   next(error);
 }
};