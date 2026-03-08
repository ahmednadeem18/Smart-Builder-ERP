import db from '../../config/db.js'
import { ExecuteQuery } from '../../utils/queryhandler.js';

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
  return ExecuteQuery(query);
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
  return ExecuteQuery(query);
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
  return ExecuteQuery(query);
}

export const GetPendingEquipmentRequests = async () => {
  const query = `
    SELECT 
      ear.id, p.project_name, ec.name AS category, u.username AS requester, ear.status
    FROM Equipment_Allocation_Request ear
    JOIN Project p ON ear.project_id = p.id
    JOIN Equipment_Category ec ON ear.category_id = ec.id
    JOIN User u ON ear.user_id = u.id
    WHERE ear.status = 'Pending';`;
  return ExecuteQuery(query);
};
export const CreateEquipmentAllocation = async (equipmentId, projectId, requestId, startDate) => {
  const query = `
    INSERT INTO Equipment_Allocation (equipment_id, project_id, request_id, start_date)
    VALUES (?, ?, ?, ?);`;
  return ExecuteQuery(query, [equipmentId, projectId, requestId, startDate]);
};
export const UpdateRequestStatus = async (requestId, status) => {
  const query = `UPDATE Equipment_Allocation_Request SET status = ? WHERE id = ?;`;
  return ExecuteQuery(query, [status, requestId]);
};
export const GetExistingRentalInfo = async (equipmentId) => {
  const query = `
    SELECT renter_id, total_rent 
    FROM Rental_Details 
    WHERE equipment_id = ?;`;
  return ExecuteQuery(query, [equipmentId]);
};
// Add to equipment.repository.js
export const GetRentalRateAndAccount = async (equipmentId) => {
  const query = `
    SELECT rd.total_rent AS daily_rate, r.account_id 
    FROM Rental_Details rd
    JOIN Renter r ON rd.renter_id = r.id
    WHERE rd.equipment_id = ?;`;
  return ExecuteQuery(query, [equipmentId]);
};
export const GetAvailableByCategory = async (categoryId) => {
  const query = `
    SELECT id, name, ownership_type 
    FROM Equipment 
    WHERE category_id = ? AND status = 'Available';`;
  return ExecuteQuery(query, [categoryId]);
};
export const CreatePaymentRequest = async (projectId, categoryId, accountId, amount) => {
  const query = `
    INSERT INTO Payment_Request (project_id, category_id, account_id, amount, status, date)
    VALUES (?, ?, ?, ?, 'Requested', CURDATE());`;
  return ExecuteQuery(query, [projectId, categoryId, accountId, amount]);
};
export const GetEquipmentCategoryId = async () => {
  const query = `SELECT id FROM Expense_Category WHERE name = 'equipment';`;
  const result = await ExecuteQuery(query);
  return result[0]?.id;
};