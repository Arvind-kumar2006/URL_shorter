import prisma from "../lib/prisma";


export const getAnalyticsService = async (shortCode : string) => {
      const url = await prisma.url.findUnique({
            where : {shortCode}
      })

      if(!url){
            const err : any = new Error("Short URL not found");
            err.status = 404;
            throw err;
      }
      const clicks = await prisma.click.findMany({
            where : {
                  urlId : url.id
            },
            orderBy : {
                  clickAt : "asc",
            }
      })
      console.log(`Clicks found for URL ID ${url.id}:`, clicks.length);
      const totalClicks = clicks.length;
      const uniqueClicks = new Set(
            clicks.map((item)=> item.ipAddress)
      ).size;

      const clickByTimeMap : Record<string , number> = {}

      for(const click of clicks){
            const day = click.clickAt.toISOString().split("T")[0];
            clickByTimeMap[day] = (clickByTimeMap[day] || 0) + 1;
      }
      const clickByTime = Object.entries(
            clickByTimeMap 
      ).map(([period , count]) => ({period , clicks : count}))

      const refereMap : Record<string , number> = {}
      
      for (const click of clicks) {
            const ref = click.referrer || "direct";
            refereMap[ref] = (refereMap[ref] || 0) + 1;
      }
      const topReferers = Object.entries(refereMap)
            .map(([referer, count]) => ({ referer, clicks:count }))
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 5);

            const deviceBreakdown = {
                  mobile : 0,
                  desktop : 0,
                  tablet : 0,
            }

            for(const click of clicks){
                  const device = click.deviceType as keyof typeof deviceBreakdown;

                  if(device && deviceBreakdown[device] !== undefined){
                        deviceBreakdown[device]++;
                  }

            }
            return {
                  shortCode : url.shortCode,
                  originalUrl : url.originalUrl,
                  totalClicks,
                  uniqueClicks,
                  clicksByTime: clickByTime,
                  topReferers,
                  deviceBreakdown,
                  createdAt : url.createdAt,
                  expiresAt : url.expiresAt
            }

      
}