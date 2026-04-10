import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sslConfig = {};

if (process.env.DB_CA_CERT) {
    // Render: Dashboard se string uthayega
    sslConfig.ca = process.env.DB_CA_CERT;
} else {
    // Local: ca.pem file se read karega
    const caPath = path.join(__dirname, '../ca.pem');
    if (fs.existsSync(caPath)) {
        sslConfig.ca = fs.readFileSync(caPath);
    }
}

// 🔥 FIX: Isay false karein taaki self-signed certificates accept ho sakein
sslConfig.rejectUnauthorized = false; 

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: sslConfig 
});

export default pool;