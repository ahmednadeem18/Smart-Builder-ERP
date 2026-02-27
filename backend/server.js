const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());


const allowedOrigins = [
  "https://smartbuildererp.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));




const projectRoutes = require("./routes/project.routes.js");
app.use("/api", projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));