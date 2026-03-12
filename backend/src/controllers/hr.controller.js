import * as service 
  from '../services/hr.services.js'

export const GetAllHumanResources = async (req, res, next) => {
  try {
    const projects = await service.GetAllHumanResources();  
    res.status(200).json({
      success: true,
      message: "human resources retrieved successfully",
      data: projects
    });
  } catch (error) {
    next(error);
  }
}