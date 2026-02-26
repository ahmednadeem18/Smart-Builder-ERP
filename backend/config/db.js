import mysql from "mysql2"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'

dotenv.config()

// These two lines help find the ca.pem file relative to this folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  // Add this SSL block for Aiven
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "../ca.pem")), 
    rejectUnauthorized: true
  }
});

export default pool.promise();