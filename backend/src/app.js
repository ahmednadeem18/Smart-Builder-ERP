import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/ErrorHandler.js";
import adminRoutes from "./routes/admin.routes.js";
import clientRoutes from "./routes/client.routes.js"
import materialRoutes from "./routes/material.routes.js"
import equipmentRoutes from './routes/equipment.routes.js';
import authRoutes from "./routes/auth.routes.js";
import dotenv from 'dotenv';
import financeRoutes from "./routes/finance.routes.js";
import subcontractorRoutes from "./routes/subcontractor.routes.js";
import pmRoutes from "./routes/pm.routes.js";
const app = express();
dotenv.config();

app.use(express.json());
app.use(express.static("public"));

const allowedOrigins = [
  "http://localhost:5173",
  "https://smartbuildererp.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {

    console.log("Request Origin:", origin);

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS blocked"));
  },
  credentials: true
}));

// app.use("/api", projectRoutes);
app.use('/api/v1/admin/clients', clientRoutes);
app.use('/api/v1/admin/materials', materialRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/equipment', equipmentRoutes);
app.use('/api/v1/material', materialRoutes);
app.use('/api/v1/admin/finance', financeRoutes);
app.use('/api/v1/subcontractor', subcontractorRoutes);
app.use('/api/v1/pm', pmRoutes);
app.use(errorHandler);

export default app;
