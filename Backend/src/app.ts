import express from "express";
import urlRoutes from "./routes/url.routes";
import healthRoutes from "./routes/health.routes";
import analyticsRoutes from "./routes/analytics.routes";
import { redirectToOriginal } from "./controller/url.controller";
import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
const app = express();



app.use(cors());
app.use(express.json());
app.use("/api/v1", authRoutes);
app.use("/api/v1", healthRoutes);
app.use("/api/v1", analyticsRoutes);
app.use("/api/v1", urlRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/:shortCode", redirectToOriginal);

// LAST
app.use(errorHandler);

export default app;
