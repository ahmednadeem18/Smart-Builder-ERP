import db from "../config/db.js"; 

export const ExecuteQuery = async (query, params = []) => {
  try {
    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    console.error("Database Error:", error.message);
    console.log(query);
    throw new Error("Database query failed");
  }
};