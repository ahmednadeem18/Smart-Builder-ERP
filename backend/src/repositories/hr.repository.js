import db from '../../config/db.js'
import { ExecuteQuery } from '../../utils/queryhandler.js';

// --- 1. PM ACTION: Request Generation ---

export const CreateHRAllocationRequest = async (projectId, categoryId, categoryType, quantity, userId) => {
  const query = `
    INSERT INTO HR_Allocation_Request (project_id, category_id, category_type, quantity, user_id, status)
    VALUES (?, ?, ?, ?, ?, 'Pending');`;
  return await ExecuteQuery(query, [projectId, categoryId, categoryType, quantity, userId]);
};

// --- 2. HR MANAGER VIEW: Dashboard ---

export const GetPendingHRRequests = async () => {
  const query = `
    SELECT 
        har.id AS requestId, p.project_name, p.id AS project_id,
        hc.id AS category_id, hc.name AS category_name,
        har.category_type, har.quantity, u.username AS requested_by
    FROM HR_Allocation_Request har
    JOIN Project p ON har.project_id = p.id
    JOIN HR_Category hc ON har.category_id = hc.id
    JOIN User u ON har.user_id = u.id
    WHERE har.status = 'Pending';`;
  return await ExecuteQuery(query);
};

// --- 3. AUTO-SELECTION LOGIC: Finding First Available ---

export const GetFirstAvailableWorkers = async (tableName, categoryId, quantity) => {
  // Ye query un bando ki list degi jo free hain (allocation_id is NULL)
  const query = `
    SELECT hr_id, daily_wage 
    FROM ${tableName} 
    WHERE category_id = ? AND allocation_id IS NULL AND status = 'Active'
    ORDER BY hr_id ASC
    LIMIT ?;`;
  return await ExecuteQuery(query, [categoryId, quantity]);
};

// Special case for Engineers (No allocation_id check as they can be on multiple projects)
export const GetEngineersByCategory = async (categoryId) => {
  const query = `
    SELECT hr_id, (salary / 30) AS daily_wage 
    FROM Engineer 
    WHERE category_id = ? AND status = 'Active';`;
  return await ExecuteQuery(query, [categoryId]);
};

// --- 4. APPROVAL & ALLOCATION ACTION ---

export const CreateHRAllocationEntry = async (projectId, requestId, startDate, endDate, totalAmount) => {
  const query = `
    INSERT INTO HR_Allocation (project_id, request_id, start_date, end_date, total_amount, status)
    VALUES (?, ?, ?, ?, ?, 'Allocated');`;
  return await ExecuteQuery(query, [projectId, requestId, startDate, endDate, totalAmount]);
};

export const UpdateWorkersAllocationID = async (tableName, workerIds, allocationId) => {
  // workerIds ek array hoga [1, 2, 3]
  const query = `UPDATE ${tableName} SET allocation_id = ? WHERE hr_id IN (?);`;
  return await ExecuteQuery(query, [allocationId, workerIds]);
};

export const UpdateHRRequestStatus = async (requestId, status) => {
  const query = `UPDATE HR_Allocation_Request SET status = ? WHERE id = ?;`;
  return await ExecuteQuery(query, [status, requestId]);
};

// --- 5. FINANCE HELPERS ---

export const GetHRExpenseCategoryId = async () => {
  const query = `SELECT id FROM Expense_Category WHERE name = 'HR' OR name = 'Labour' LIMIT 1;`;
  const result = await ExecuteQuery(query);
  return result[0]?.id;
};

// --- 6. RELEASE LOGIC: The "Free" Button ---

export const GetAllActiveAllocations = async () => {
  const query = `
    SELECT ha.*, p.project_name, har.category_type, har.category_id
    FROM HR_Allocation ha
    JOIN Project p ON ha.project_id = p.id
    JOIN HR_Allocation_Request har ON ha.request_id = har.id
    WHERE ha.status = 'Allocated';`;
  return await ExecuteQuery(query);
};

export const ReleaseLabourPool = async (allocationId, categoryType) => {
  const tableName = categoryType === 'Skilled' ? 'Skilled_Labour' : 'Unskilled_Labour';
  
  // 1. Labour ko free karna (allocation_id = NULL)
  const freeLabourQuery = `UPDATE ${tableName} SET allocation_id = NULL WHERE allocation_id = ?;`;
  await ExecuteQuery(freeLabourQuery, [allocationId]);

  // 2. Allocation status complete karna
  const closeAllocQuery = `UPDATE HR_Allocation SET status = 'Completed' WHERE id = ?;`;
  return await ExecuteQuery(closeAllocQuery, [allocationId]);
};