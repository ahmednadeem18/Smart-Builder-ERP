import express from "express";
import {
  GetAllProjects, 
  GetDashboardOverview,
  UpdateProjectStatus,
  GetProjectBudgetOverview,
  GetUsersByRole,
  CreateProject,
  GetProjectFullReport
} from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/rbac.middleware.js";


const router = express.Router();

router.get("/projects", verifyToken, allowRoles("Director"), GetAllProjects);
router.get("/projects/:id/budget", verifyToken, allowRoles("Director"), GetProjectBudgetOverview);
router.patch("/projects/:id/status", verifyToken, allowRoles("Director", "Project Manager"), UpdateProjectStatus);
router.get("/projects/:id/report", verifyToken, allowRoles("Director"), GetProjectFullReport);
router.get("/users", verifyToken, allowRoles("Director"), GetUsersByRole);
router.post("/projects", verifyToken, allowRoles("Director"), CreateProject);
router.get("/dashboard-overview",verifyToken, allowRoles("Director"), GetDashboardOverview);

export default router;
