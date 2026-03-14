import express from 'express';
import * as controller from '../controllers/pm.controller.js';

const router = express.Router();

/* Fetches all projects assigned to the specific PM.
 */
router.get('/projects/:managerId', controller.GetMyProjects);

/* Retrieves the history of updates for a project.
 */
router.get('/project/logs/:projectId', controller.GetProjectHistory);

/*Add Log 
*/
router.post('/log', controller.AddProgressUpdate);

/*requesting different services
*/
router.post('/request/:type', controller.SubmitResourceRequest);

export default router;
