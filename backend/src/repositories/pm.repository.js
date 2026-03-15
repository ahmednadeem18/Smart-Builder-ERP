import db from '../../config/db.js'
import { ExecuteQuery } from '../../utils/queryhandler.js';

/* Adds a manual progress update to the project timeline.
*/
export const CreateProgressLog = async (projectId, logText) => {
  const query = `
    INSERT INTO Progress_Log (project_id, log_text, log_date)
    VALUES (?, ?, NOW());`;
  return ExecuteQuery(query, [projectId, logText]);
};

/* Retrieves the full history of progress logs for a specific project.
*/
export const GetProjectLogs = async (projectId) => {
  const query = `
    SELECT id, log_text, log_date 
    FROM Progress_Log 
    WHERE project_id = ? 
    ORDER BY log_date DESC;`;
  return ExecuteQuery(query, [projectId]);
};

/* Requests Materials from the Material Manager.
*/
export const RequestMaterials = async (projectId, categoryId, userId, quantity) => {
  const query = `
    INSERT INTO Material_Allocation_Request (project_id, category_id, user_id, quantity, status)
    VALUES (?, ?, ?, ?, 'Pending');`;
  return ExecuteQuery(query, [projectId, categoryId, userId, quantity]);
};

/* Requests Personnel (Skilled, Unskilled, or Engineers) from the HR Manager.
*/
export const RequestHR = async (projectId, category_id, user_id) => {
  const query = `
    INSERT INTO HR_Allocation_Request (project_id, category_id, user_id, status)
    VALUES (?, ?, ?, 'Pending');`;
  return ExecuteQuery(query, [projectId, category_id, user_id]);
};

/* Requests Equipment from the Equipment Manager.
*/
export const RequestEquipment = async (projectId, categoryId, userId) => {
  const query = `
    INSERT INTO Equipment_Allocation_Request (project_id, category_id, user_id, status)
    VALUES (?, ?, ?, 'Pending');`;
  return ExecuteQuery(query, [projectId, categoryId, userId]);
};

/* Requests a Subcontractor
*/
export const RequestSubcontractor = async (projectId, categoryId, userId) => {
  const query = `
    INSERT INTO Subcontractor_Allocation_Request (project_id, category_id, user_id, status)
    VALUES (?, ?, ?, 'Pending');`;
  return ExecuteQuery(query, [projectId, categoryId, userId]);
};

/* Shows the PM all projects.
*/
export const GetAssignedProjects = async (managerId) => {
  const query = `
    SELECT 
        p.id, 
        p.project_name, 
        p.start_date, 
        p.end_date, 
        p.status,
        c.name AS client_name
    FROM Project p
    JOIN Client c ON p.client_id = c.id
    WHERE p.manager_id = ?;`;
  return ExecuteQuery(query, [managerId]);
};

