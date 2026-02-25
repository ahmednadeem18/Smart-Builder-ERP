import db from '../../config/db.js';

export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM Project"
    );

    res.status(200).json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database query failed :( "
    });
  }
};