import express from "express";
import {
  GetAllProjects, 
  GetDashboardOverview,
  UpdateProjectStatus,
  CreateProject,
} from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/rbac.middleware.js";


const router = express.Router();

router.get("/projects", verifyToken, allowRoles("Director"), GetAllProjects);
router.patch("/projects/:id/status", verifyToken, allowRoles("Director", "Project Manager"), UpdateProjectStatus);
router.post("/projects", verifyToken, allowRoles("Director"), CreateProject);
router.get("/dashboard-overview",verifyToken, allowRoles("Director"), GetDashboardOverview);

export default router;
