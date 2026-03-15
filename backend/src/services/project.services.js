import * as repo
  from '../repositories/project.repository.js'

export const GetAllProjects = async () => {
  const projects = await repo.GetAllProjects();

  if (!projects || projects.length === 0) {
    
    const error = new Error("No projects found");
    error.status = 404; // project not found error
    throw error;
  }
  return projects;
}

export const GetAllOngoingProjects = async () => {
  const projects = await repo.GetAllOngoingProjects();

  if (!projects || projects.length === 0) {
    const error = new Error("No ongoing projects found");
    error.status = 404;
    throw error;
  }
  return projects;
}

export const GetProjectBudgetOverview = async (id) => {
  if (!id) {
    const error = new Error("Project ID is required");
    error.status = 400;
    throw error;
  }

  if (isNaN(id)) {
    const error = new Error("Invalid project ID");
    error.status = 400;
    throw error;
  }

  const overview = await repo.GetProjectBudgetOverview(id);

  if (!overview || overview.length === 0) {
    const error = new Error("Project budget data not found");
    error.status = 404;
    throw error;
  }
  return overview;
}

export const GetOverviewOfAllProjects = async () => {
  const overview = await repo.GetOverviewOfAllProjects();

  if (!overview) {
    const error = new Error("Unable to retrieve project overview");
    error.status = 500;
    throw error;
  }
  return overview;
}

export const GetDashboardOverview = async () => {
  const data = await repo.GetDashboardOverview();

  if (!data) {
    const error = new Error("Dashboard data not available");
    error.status = 500;
    throw error;
  }
  return data;
};

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
    const error = new Error("Project name is required!");
    error.status = 400;
    throw error;
  }

  const client = await repo.CheckClientExists(client_id);
  if (client.length === 0) {
    const error = new Error("Client does not exist!");
    error.status = 404;
    throw error;
  }

  const manager = await repo.CheckManagerExists(manager_id);
  if (manager.length === 0) {
    const error = new Error("Project manager not found!");
    error.status = 404;
    throw error;
  }

  const budget = await repo.CheckBudgetExists(budget_id);
  if (budget.length === 0) {
    const error = new Error("Budget does not exist!");
    error.status = 404;
    throw error;
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


const allowedStatus = ["Cancelled", "Ongoing", "Completed"];

export const UpdateProjectStatus = async (projectId, status) => {

  if (!allowedStatus.includes(status)) {
    const error = new Error("Invalid project status!");
    error.status = 400;
    throw error;
  }

  const result = await repo.UpdateProjectStatus(projectId, status);

  if (result.affectedRows === 0) {
    const error = new Error("Project not found!");
    error.status = 404;
    throw error;
  }
  return { message: "Project status updated successfully!" };
};

export const CreateProjectWithBudget = async (
  project_name,
  director_id,
  manager_id,
  client_id,
  start_date,
  labour_cost,
  material_cost,
  equipment_rent,
  subcontractor_cost
) => {
  if (!project_name) {
    const error = new Error("Project name is required!");
    error.status = 400;
    throw error;
  }

  const client = await repo.CheckClientExists(client_id);
  if (client.length === 0) {
    const error = new Error("Client does not exist!");
    error.status = 404;
    throw error;
  }

  const manager = await repo.CheckManagerExists(manager_id);
  if (manager.length === 0) {
    const error = new Error("Project manager not found!");
    error.status = 404;
    throw error;
  }

  
  return await repo.CreateProjectWithBudget(
    project_name,
    director_id,
    manager_id,
    client_id,
    start_date,
    labour_cost,
    material_cost,
    equipment_rent,
    subcontractor_cost
  );
};
