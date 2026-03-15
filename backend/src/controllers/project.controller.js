import * as service 
  from '../services/project.services.js'

export const GetAllProjects = async (req, res, next) => {
  try {
    const projects = await service.GetAllProjects();  
    res.status(200).json({
      success: true,
      message: "projects retrieved successfully",
      data: projects
    });
  } catch (error) {
    next(error);
  }
}

export const GetAllOngoingProjects = async (req, res, next) => {
  try {
    const projects = await service.GetAllOngoingProjects();  
    res.status(200).json({
      success: true,
      message: "ongoing projects retrieved successfully",
      data: projects
    });
  } catch (error) {
    next(error);
  }
}

export const GetProjectBudgetOverview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projects = await service.GetProjectBudgetOverview(id);  
    res.status(200).json({
      success: true,
      message: "project budget overview retrieved successfully",
      data: projects
    });
  } catch (error) {
    next(error);
  }
}

export const GetOverviewOfAllProjects = async (req, res, next) => {
  try {
    const projects = await service.GetOverviewOfAllProjects();  
    res.status(200).json({
      success: true,
      message: "overview of all projects retrieved successfully",
      data: projects
    });
  } catch (error) {
    next(error);
  }
}


export const GetDashboardOverview = async (req, res, next) => {
  try {
    const overview = await service.GetDashboardOverview();
    res.status(200).json({
      success: true,
      message: "dashboard overview retrieved successfully",
      data: overview
    });
  } catch (error) {
    next(error);
  }
};


export const CreateProject = async (req, res, next) => {

  try {

    const {
      project_name,
      director_id,
      manager_id,
      client_id,
      start_date,
      labour_cost,
      material_cost,
      equipment_rent,
      subcontractor_cost
    } = req.body;

    const result = await service.CreateProjectWithBudget(
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

    res.json({
      success: true,
      message: "Project created successfully",
      budget_id: result.budget_id
    });

  } catch (error) {
    next(error);
  }

};

export const UpdateProjectStatus = async (req, res, next) => {

  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await service.UpdateProjectStatus(id, status);

    res.json({
      success: true,
      data: result,
      message: "Project status updated successfully!"
    });

  } catch (error) {
    next(error);
  }

};