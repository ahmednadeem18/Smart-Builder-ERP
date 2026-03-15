import * as repo from '../repositories/pm.repository.js';

/*Fetches all projects assigned to a specific PM.
 */
export const GetMyProjects = async (managerId) => {
  return await repo.GetAssignedProjects(managerId);
};


/*Retrieves the timeline/history of logs for a project.
 */
export const GetProjectHistory = async (projectId) => {
  return await repo.GetProjectLogs(projectId);
};

/*ADD LOG PROGRESS
 */
export const AddProgressUpdate = async (projectId, logText) => {
  if (!logText || logText.trim().length < 10) {
    const error = new Error("Progress log is too short. Please provide more detail.");
    error.status = 400;
    throw error;
  }
  return await repo.CreateProgressLog(projectId, logText);
};

/*his handles Materials, HR, Equipment, and Subcontractors.
 */
export const SubmitResourceRequest = async (type, data) => {
  const { projectId, categoryId, userId, quantity } = data;

  // Validation: Ensure we have a project and a user
  if (!projectId || !userId) {
    const error = new Error("Missing Project ID or User ID for the request.");
    error.status = 400;
    throw error;
  }

  switch (type.toLowerCase()) {
    case 'material':
      if (!quantity || quantity <= 0) {
        const error = new Error("Invalid material quantity.");
        error.status = 400;
        throw error;
      }
      return await repo.RequestMaterials(projectId, categoryId, userId, quantity);

    case 'hr':
      return await repo.RequestHR(projectId, categoryId, userId);

    case 'equipment':
      return await repo.RequestEquipment(projectId, categoryId, userId);

    case 'subcontractor':
      return await repo.RequestSubcontractor(projectId, categoryId, userId);

    default:
      const error = new Error(`Invalid resource type: ${type}`);
      error.status = 400;
      throw error;
  }
};
