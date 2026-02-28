
export const HandleQuery = async(res, query, params = []) => {
  try {
    const [rows] = await db.query(query, params);

    res.status(200).json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: `Database query failed :( ${query}`
    });

  }

}