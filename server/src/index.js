import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import wasteRoutes from "./routes/waste.js";
import pickupRoutes from "./routes/pickups.js";
import complaintRoutes from "./routes/complaints.js";
import rewardRoutes from "./routes/rewards.js";
import marketplaceRoutes from "./routes/marketplace.js";

const requiredEnv = ["MONGODB_URI", "JWT_SECRET", "CLIENT_ORIGIN"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  throw new Error(`Missing required environment variables: ${missingEnv.join(", ")}`);
}
if (process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long.");
}

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "cleancity-api" });
});
app.use("/api/auth", authRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use((_req, res) => {
  res.status(404).json({ message: "The requested API route was not found." });
});
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

const port = Number(process.env.PORT || 5000);
await mongoose.connect(process.env.MONGODB_URI);
app.listen(port, () => {
  console.log(`CleanCity API listening on port ${port}`);
});
