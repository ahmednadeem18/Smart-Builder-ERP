import db from '../../config/db.js'

/* 

*/
export const GetAllEquipments = async () => {
  const query = `
  SELECT
  e.id,
  e.name,
  ec.name AS category,
  e.status,
  e.ownership_type
  FROM Equipment e
  JOIN Equipment_Category ec
  ON e.category_id = ec.id;`;
  const [rows] = await db.query(query);
  return rows;
}

/*

*/
export const GetAllRentedEquipments = async () => {

  const query = `
  SELECT
  e.name AS equipment,
  r.name AS renter,
  rd.start_date,
  rd.end_date,
  rd.total_rent,
  rd.payment_status
  FROM Rental_Details rd
  JOIN Equipment e
  ON rd.equipment_id = e.id
  JOIN Renter r
  ON rd.renter_id = r.id;`;
  const [rows] = await db.query(query);
  return rows;
}


/*

*/

export const GetOwnedEquipments = async () => {
  const query = `
  SELECT
  e.id,
  e.name,
  ec.name AS category,
  e.status
  FROM Equipment e
  JOIN Equipment_Category ec
  ON e.category_id = ec.id
  WHERE e.ownership_type='Company-owned';`;
  const [rows] = await db.query(query);
  return rows;
}