
import prisma from "../lib/prisma";
import { Request } from 'express'; 
import redis from "../lib/redis";
import AppError from "../utils/AppError";

type Input = {
      url : string , 
      customCode ? : string,
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
      const {url , customCode , expiresIn} = input;
      
      let shortCode = customCode || generateCode();
      
      // Check if the shortcode already exists
      const existing = await prisma.url.findUnique({
            where : {shortCode : shortCode}
      })
      if(existing){
            throw new AppError("Custom code already in use, please choose another one", 400);
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

  let cached  = null;

   if (process.env.NODE_ENV !== "test") {
    cached = await redis.get(cacheKey);

  }

//   if (cached) {
//   console.log("CACHE HIT");
// }
// else {
//   console.log("CACHE MISS");
// }

  if (cached) {
    const url = JSON.parse(cached);

    logClick(url.id, req);

    return url;
  }

  const url = await prisma.url.findUnique({
    where: { shortCode }
  });

  if (!url) {
      throw new AppError("Short URL not found", 404);
  }

  if (!url.isActive) {
    throw new AppError("This link has been deactivated", 410);
  }

  if (url.expiresAt && new Date() > url.expiresAt) {
      throw new AppError("This link has expired", 410);
  }

  if (process.env.NODE_ENV !== "test") {
  await redis.setEx(
    cacheKey,
    3600,
    JSON.stringify(url)
  );
}

  logClick(url.id, req)
  .catch(console.error);

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
            throw new AppError("Short URL not found", 404);
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