import * as service from '../services/pm.services.js';

/*Fetches all projects assigned to the logged-in PM.
 */
export const GetMyProjects = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const projects = await service.GetMyProjects(managerId);
    //console.log("Projects retrieved for managerId:", managerId, projects);
    res.status(200).json({
      success: true,
      message: "Assigned projects retrieved successfully",
      data: projects
    });
  } catch (error) { next(error); }
};


/* Retrieves the log history for a specific project.
 */
export const GetProjectHistory = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const history = await service.GetProjectHistory(projectId);
    res.status(200).json({
      success: true,
      message: "Project logs retrieved successfully",
      data: history
    });
  } catch (error) { next(error); }
};

/* Adds a new progress log to a project.
 */
export const AddProgressUpdate = async (req, res, next) => {
  try {
    const { projectId, logText } = req.body;
    const result = await service.AddProgressUpdate(projectId, logText);
    res.status(201).json({
      success: true,
      message: "Progress log added successfully",
      data: result
    });
  } catch (error) { next(error); }
};

/*Submits a request for Materials, HR, Equipment, or Subcontractors.
 Body: { projectId, categoryId, userId, quantity }
 */
export const SubmitResourceRequest = async (req, res, next) => {
  try {
    const { type } = req.params; 
    const result = await service.SubmitResourceRequest(type, req.body);
    
    res.status(201).json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} request submitted successfully`,
      data: result
    });
  } catch (error) { next(error); }
};
