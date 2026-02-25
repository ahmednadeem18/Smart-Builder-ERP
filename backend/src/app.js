import express from "express"
import cors from "cors"
import testRoutes from "./routes/testdb.routes.js"



const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);
app.use("/api/testdb", testRoutes);
export default app; 