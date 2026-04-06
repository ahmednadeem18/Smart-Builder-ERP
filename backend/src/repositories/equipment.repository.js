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


// 1. Pending requests dikhane ke liye
export const GetPendingEquipmentRequests = async () => {
    const query = `
        SELECT ear.id AS requestId, p.project_name, p.id AS project_id, 
               ec.name AS category_name, ec.id AS category_id, 
               u.username AS requested_by
        FROM Equipment_Allocation_Request ear
        JOIN Project p ON ear.project_id = p.id
        JOIN Equipment_Category ec ON ear.category_id = ec.id
        JOIN User u ON ear.user_id = u.id
        WHERE ear.status = 'Pending';`;
    return await ExecuteQuery(query);
};

// 2. Category ke mutabiq pehla available equipment dhoondna
export const FindAvailableEquipment = async (categoryId) => {
    const query = `
        SELECT id, name, ownership_type 
        FROM Equipment 
        WHERE category_id = ? AND status = 'Available' 
        LIMIT 1;`;
    const result = await ExecuteQuery(query, [categoryId]);
    return result[0];
};

// 3. Rented equipment ka per day rate calculate karna
export const GetRentalRate = async (equipmentId) => {
    const query = `
        SELECT total_rent, DATEDIFF(end_date, start_date) AS total_days, renter_id
        FROM Rental_Details 
        WHERE equipment_id = ?;`;
    const result = await ExecuteQuery(query, [equipmentId]);
    return result[0];
};

// 4. Allocation entry aur Status update
export const SaveAllocation = async (equipmentId, projectId, requestId, startDate, endDate) => {
    const insertAlloc = `
        INSERT INTO Equipment_Allocation (equipment_id, project_id, request_id, start_date, end_date)
        VALUES (?, ?, ?, ?, ?);`;
    await ExecuteQuery(insertAlloc, [equipmentId, projectId, requestId, startDate, endDate]);

    const updateEquip = `UPDATE Equipment SET status = 'In-use' WHERE id = ?;`;
    await ExecuteQuery(updateEquip, [equipmentId]);

    const updateReq = `UPDATE Equipment_Allocation_Request SET status = 'Approved' WHERE id = ?;`;
    await ExecuteQuery(updateReq, [requestId]);
};

// 5. Active Allocations (In-use items)
export const GetActiveAllocations = async () => {
    const query = `
        SELECT ea.id AS allocation_id, e.name AS equipment_name, e.id AS equipment_id,
               p.project_name, ea.start_date, ea.end_date, e.ownership_type
        FROM Equipment_Allocation ea
        JOIN Equipment e ON ea.equipment_id = e.id
        JOIN Project p ON ea.project_id = p.id
        WHERE e.status = 'In-use';`;
    return await ExecuteQuery(query);
};

// 6. Release Equipment
export const UpdateToAvailable = async (equipmentId) => {
    const query = `UPDATE Equipment SET status = 'Available' WHERE id = ?;`;
    return await ExecuteQuery(query, [equipmentId]);
};

// 7. Expense Category ID for Equipment
export const GetEquipExpenseId = async () => {
    const query = `SELECT id FROM Expense_Category WHERE name = 'equipment';`;
    const result = await ExecuteQuery(query);
    return result[0]?.id;
};
export const CreateEquipmentPaymentRequest = async (projectId, expenseCategoryId, renterId, userId, amount) => {
    const query = `
        INSERT INTO Payment_Request (project_id, category_id, receiver_id, user_id, amount, status, date)
        VALUES (?, ?, ?, ?, ?, 'Requested', CURDATE());`;
    return await ExecuteQuery(query, [projectId, expenseCategoryId, renterId, userId, amount]);
};
export const CreateAllocationRequest = async (projectId, userId, categoryId) => {
    const query = `INSERT INTO Equipment_Allocation_Request (project_id, user_id, category_id, status) VALUES (?, ?, ?, 'Pending');`;
    return await ExecuteQuery(query, [projectId, userId, categoryId]);
};