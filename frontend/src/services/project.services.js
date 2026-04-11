import { request } from './api.js'


export function GetProjects() {
  return request('/api/projects');
}

export const CreateInvoiceRequest = async (projectId, clientId, userId, amount) => {
  if (!projectId || !clientId || !amount) {
    const error = new Error("Project, client and amount are required.");
    error.status = 400;
    throw error;
  }
  return await repo.CreateInvoiceRequest(projectId, clientId, userId, amount);
};