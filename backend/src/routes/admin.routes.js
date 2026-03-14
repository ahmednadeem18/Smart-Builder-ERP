import express from "express";
import {
  GetAllProjects, 
  GetDashboardOverview,
  UpdateProjectStatus,
  CreateProject
} from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/projects", verifyToken, GetAllProjects);
router.patch("/projects/:id/status", verifyToken, UpdateProjectStatus);
router.post("/projects", verifyToken, CreateProject);
router.get("/dashboard-overview",verifyToken, GetDashboardOverview);

export default router;
