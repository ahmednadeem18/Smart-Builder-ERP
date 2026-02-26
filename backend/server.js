import dotenv from "dotenv"
import app from "./src/app.js"
import db from "./config/db.js"
import cors from "cors"

dotenv.config();

const PORT = process.env.PORT || 5000;

async function StartServer()
{
  try {
    await db.query("SELECT 1");
    console.log("Suceesfully connected to the DATABASE. :)");

    app.listen(PORT, () => {
      console.log(`Server is now running on PORT ${PORT} :) `);
    });
  }
  catch (err)  {
    console.error(":( DATABASE connection Failed: ", err);
  }
}



app.use(cors({
  origin: "https://smartbuildererp.onrender.com",
  credentials: true
}));

StartServer();