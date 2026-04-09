import express from 'express';
import * as controller from '../controllers/pm.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/rbac.middleware.js';

const router = express.Router();

/* Fetches all projects assigned to the specific PM.
 */
router.get('/projects/:managerId',verifyToken, allowRoles("Project Manager"),  controller.GetMyProjects);
router.get(
  "/projects",
  verifyToken,
  allowRoles("Project Manager"),
  controller.GetMyProjects
);
/* Retrieves the history of updates for a project.
 */
router.get('/project/logs/:projectId', verifyToken, allowRoles("Project Manager", "Director"), controller.GetProjectHistory);

/*Add Log 
*/
router.post('/log',verifyToken, allowRoles("Project Manager"), controller.AddProgressUpdate);

/*requesting different services
*/
router.post('/request/:type', verifyToken, allowRoles("Project Manager"), controller.SubmitResourceRequest);

router.get('/categories/:type', verifyToken, allowRoles("Project Manager"), controller.GetCategories);
export default router;
