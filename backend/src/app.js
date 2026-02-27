import express from "express";
import cors from "cors";
import projectRoutes from "./routes/project.routes.js";

const app = express();

app.use(express.json());

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

app.use("/api", projectRoutes);

export default app;