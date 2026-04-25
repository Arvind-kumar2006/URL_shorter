import express from "express";
import {config} from "dotenv";
import urlRoutes from "./routes/url.routes";
config();
import { redirectToOriginal } from "./controller/url.controller";
import type { Request, Response } from "express";
import healthRoutes from "./routes/health.routes";
import analyticsRoutes from "./routes/analytics.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

app.use(errorHandler);
app.use("/api/v1/", healthRoutes);
app.use("/api/v1/", analyticsRoutes);

app.use("/api/v1" , urlRoutes);
app.get("/" , (req : Request , res : Response) => {
    res.send("Hello World");
})
app.get("/:shortCode", redirectToOriginal);
console.log(process.env.DATABASE_URL);
app.listen(3001 , () => {
    console.log("Server is running on port 3001");
})