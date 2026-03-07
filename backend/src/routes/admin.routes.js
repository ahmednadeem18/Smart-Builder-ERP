import express from "express";
import {
  GetAllProjects, 
  GetDashboardOverview
 } from "../controllers/project.controller.js";

const router = express.Router();

router.get("/projects", GetAllProjects);
router.get("/dashboard-overview", GetDashboardOverview);

export default router;