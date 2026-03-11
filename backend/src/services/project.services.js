import * as repo
  from '../repositories/project.repository.js'

export const GetAllProjects = async () => {
  const projects = await repo.GetAllProjects();

  if (!projects || projects.length === 0) {
    throw new Error("No projects found");
  }
  return projects;
}

export const GetAllOngoingProjects = async () => {
  const projects = await repo.GetAllOngoingProjects();

  if (!projects || projects.length === 0) {
    throw new Error("No ongoing projects found");
  }
  return projects;
}

export const GetProjectBudgetOverview = async (id) => {
  if (!id) {
    throw new Error("Project ID is required");
  }

  if (isNaN(id)) {
    throw new Error("Invalid project ID");
  }

  const overview = await repo.GetProjectBudgetOverview(id);

  if (!overview || overview.length === 0) {
    throw new Error("Project budget data not found");
  }
  return overview;
}

export const GetOverviewOfAllProjects = async () => {
  const overview = await repo.GetOverviewOfAllProjects();

  if (!overview) {
    throw new Error("Unable to retrieve project overview");
  }
  return overview;
}

export const GetDashboardOverview = async () => {
  const data = await repo.GetDashboardOverview();

  if (!data) {
    throw new Error("Dashboard data not available");
  }
  return data;
};

import * as repo from "../repositories/project.repository.js";

export const CreateProject = async (body) => {

  const {
    project_name,
    director_id,
    manager_id,
    budget_id,
    client_id,
    start_date
  } = body;

  if (!project_name) {
    throw new Error("Project name is required");
  }

  const client = await repo.CheckClientExists(client_id);
  if (client.length === 0) {
    throw new Error("Client does not exist");
  }

  const manager = await repo.CheckManagerExists(manager_id);
  if (manager.length === 0) {
    throw new Error("Project manager not found");
  }

  const budget = await repo.CheckBudgetExists(budget_id);
  if (budget.length === 0) {
    throw new Error("Budget does not exist");
  }

  return await repo.CreateProject(
    project_name,
    director_id,
    manager_id,
    budget_id,
    client_id,
    start_date
  );
};