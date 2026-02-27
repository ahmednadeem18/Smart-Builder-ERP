const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

const allowedOrigin = "https://smartbuildererp.vercel.app";

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

const projectRoutes = require("./routes/project.routes.js");
app.use("/api", projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));