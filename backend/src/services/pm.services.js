import * as repo from '../repositories/pm.repository.js';

export const GetMyProjects = async (managerId) => {
  return await repo.GetAssignedProjects(managerId);
};

export const GetProjectHistory = async (projectId) => {
  return await repo.GetProjectLogs(projectId);
};

export const AddProgressUpdate = async (projectId, logText) => {
  if (!logText || logText.trim().length < 10) {
    const error = new Error("Progress log is too short. Please provide more detail.");
    error.status = 400;
    throw error;
  }
  return await repo.CreateProgressLog(projectId, logText);
};
export const FetchCategories = async (type) => {
    return await repo.GetCategoriesByType(type);
};
export const SubmitResourceRequest = async (type, data) => {
  const { projectId, categoryId, userId, quantity, categoryType } = data;

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
      // HR Request Validation: Ensure quantity and categoryType are present
      if (!quantity || quantity <= 0) {
        const error = new Error("Please specify the number of workers needed.");
        error.status = 400;
        throw error;
      }
      if (!categoryType) {
        const error = new Error("Please specify if it's Skilled, Unskilled, or Engineer.");
        error.status = 400;
        throw error;
      }
      // Passing all 5 parameters to match the repo function
      return await repo.RequestHR(projectId, categoryId, categoryType, quantity, userId);

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