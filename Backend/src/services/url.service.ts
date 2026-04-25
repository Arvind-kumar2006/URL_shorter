import prisma from "../lib/prisma";
import { Request } from 'express'; 
type Input = {
      url : string , 
      customcode ? : string,
      expiresIn ? : number 
}

function generateCode(length = 6): string{
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
}

export const createShortUrlService = async (input : Input)=>{
      const {url , customcode , expiresIn} = input;
      
      let shortCode = customcode || generateCode();
      
      // Check if the shortcode already exists
      const existing = await prisma.url.findUnique({
            where : {shortCode : shortCode}
      })
      if(existing){
            throw new Error('Custom code already exists. Please choose a different one.');
      }
      const created = await prisma.url.create({
            data : {
                  shortCode : shortCode,
                  originalUrl : url,
                  expiresAt : expiresIn ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000) : null
            }
      })
      return created;

}

export const redirectService = async (shortCode : string , req : Request) => {
      const url  = await prisma.url.findUnique({
            where : {shortCode : shortCode}
      })
      if (!url ){
            const err : any = new Error("Short URL not found");
            err.status = 404;
            throw err;
      }
      if(!url.isActive){
            const err : any = new Error("This link has been deactivated");
            err.status = 410;
            throw err;
      }
      if(url.expiresAt && new Date() > url.expiresAt){
            const err : any = new Error("This link has expired");
            err.status = 410;
            throw err;
      }
      prisma.url.update({
            where : {id : url.id},
            data : {
                  clickCount : {
                        increment : 1
                  }
            }
      }).catch(console.error);

      return url;
}