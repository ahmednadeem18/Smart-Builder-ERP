import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/ErrorHandler.js";
import adminRoutes from "./routes/admin.routes.js";
import clientRoutes from "./routes/client.routes.js"
import materialRoutes from "./routes/material.routes.js"
import equipmentRoutes from './routes/equipment.routes.js';

const app = express();

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
app.use('/admin/clients', clientRoutes);
app.use('/admin/materials', materialRoutes);
app.use("/admin", adminRoutes);
app.use(errorHandler);
app.use('/api/equipment', equipmentRoutes);

export default app;