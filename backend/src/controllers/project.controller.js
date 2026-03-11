import * as service 
  from '../services/project.services.js'

export const GetAllProjects = async (req, res, next) => {
  try {
    const projects = await service.GetAllProjects();  
    res.status(200).json({
      success: true,
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
      data: projects
    });
  } catch (error) {
    next(error);
  }
}


export const GetDashboardOverview = async (req, res, next) => {
  try {
    const overview = await service.GetDashboardOverview();
    res.status(200).json({ success: true, data: overview });
  } catch (error) {
    next(error);
  }
};


export const CreateProject = async (req, res, next) => {
  try {
    const result = await service.CreateProject(req.body);
    res.status(201).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};