import {Request , Response , NextFunction} from "express";
export const errorHandler = (err : any , req : Request , res : Response , next : NextFunction) => {
      const statusCode = err.statusCode || err.status || 500;

      res.status(statusCode).json({
            status : "error" ,
            message : err.message || "Internal Server Error",
            ...(process.env.NODE_ENV === "development" && {
                  stack : err.stack
            })
      })
}