import { ur } from 'zod/v4/locales';
import { link } from "node:fs";
import prisma from "../lib/prisma";
import { Request } from 'express'; 
import redis from "../lib/redis";
import { log } from "node:console";

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

export const redirectService = async (
  shortCode: string,
  req: Request
) => {
  const cacheKey = `url:${shortCode}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
  console.log("CACHE HIT");
}
else {
  console.log("CACHE MISS");
}

  if (cached) {
    const url = JSON.parse(cached);

    logClick(url.id, req);

    return url;
  }

  const url = await prisma.url.findUnique({
    where: { shortCode }
  });

  if (!url) {
    const err: any = new Error("Short URL not found");
    err.status = 404;
    throw err;
  }

  if (!url.isActive) {
    const err: any = new Error("This link has been deactivated");
    err.status = 410;
    throw err;
  }

  if (url.expiresAt && new Date() > url.expiresAt) {
    const err: any = new Error("This link has expired");
    err.status = 410;
    throw err;
  }

  await redis.setEx(
    cacheKey,
    3600,
    JSON.stringify(url)
  );

  logClick(url.id, req);

  return url;
};

type Intput = {
      page : number ,
      limit : number , 
      sort : "createdAt" | "clickCount" ,
}

export const listLinksService = async(input : Intput)=>{
       const {page , limit , sort } = input;
      
       const skip = ((page)-1) * limit;

       const [links , total ] = await Promise.all([
            prisma.url.findMany({
                  skip : skip , 
                  take : limit ,
                  orderBy : {
                     [sort] : "desc"
                  },
                  select : {
                        id : true , 
                        shortCode : true , 
                        originalUrl : true ,
                        clickCount : true , 
                        createdAt : true , 
                        expiresAt : true , 
                        isActive : true
                  }
            }),
            prisma.url.count()
       ])
       return {
            data : links , 
            pagination : {
                  total , page , limit , totalPages : Math.ceil(total/limit)
            }
       }
}

export const deactivateLinkService = async (shortCode : string) => {
      await redis.del(`url:${shortCode}`);

      const existing = await prisma.url.findUnique({
            where : {shortCode : shortCode}
      })

      if(!existing){
            const err : any = new Error("Short URL not found");
            err.status = 404;
            throw err;
      }
      const updated = await prisma.url.update({
            where : {shortCode},
            data : {
                  isActive : false
            }
      })
      return updated;
}


// extract click logging 
const logClick = async (urlId : number , req : Request) => {
      const ipAddress = req.ip ?? "Unknown";

      prisma.url.update({
            where : {id : urlId} , 
            data : {
                  clickCount:{
                        increment : 1
                  }
            }
      }).catch(console.error);

      prisma.click.create({
            data : {
                  urlId : urlId ,
                  ipAddress : ipAddress,
                  userAgent : req.headers["user-agent"] || "",
                  referrer : req.headers.referer || "direct",
                  deviceType : "desktop"
            }
      }).catch(console.error);
}