import express from "express";
import urlRoutes from "./routes/url.routes";
import healthRoutes from "./routes/health.routes";
import analyticsRoutes from "./routes/analytics.routes";
import { redirectToOriginal } from "./controller/url.controller";
import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
const app = express();

const allowedOrigins = [
  process.env.ALLOWED_ORIGIN || "https://url-shortner-frontend1-ij2y.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy blocked origin: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Explicitly handle preflight for all routes
app.options("*", cors(corsOptions));

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