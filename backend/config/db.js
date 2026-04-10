import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'; 

dotenv.config();
// ES Modules mein __dirname define karna parta hai
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sslConfig = {};

if (process.env.DB_CA_CERT) {
    // Render ke liye: seedha string use karein
    sslConfig.ca = process.env.DB_CA_CERT;
} else {
    // Local ke liye: file dhoondein
    const caPath = path.join(__dirname, '../ca.pem');
    if (fs.existsSync(caPath)) {
        sslConfig.ca = fs.readFileSync(caPath);
    }
}

sslConfig.rejectUnauthorized = true;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: sslConfig // Updated SSL block
});

export default pool;
