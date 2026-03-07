import * as repo
  from '../repositories/project.repository.js'

export const GetAllProjects = async () => {
  return await repo.GetAllProjects();
}

export const GetAllOngoingProjects = async () => {
  return await repo.GetAllOngoingProjects();
}

export const GetProjectBudgetOverview = async (id) => {
  return await repo.GetProjectBudgetOverview(id);
}

export const GetOverviewOfAllProjects = async () => {
  return await repo.GetOverviewOfAllProjects();
}

export const GetDashboardOverview = async () => {
  return await repo.GetDashboardOverview();
};