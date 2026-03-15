import { UpdateProjectStatus } from "../controllers/project.controller.js";
import { VerifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/rbac.middleware.js";


router.patch("/projects/:id/status", VerifyToken, UpdateProjectStatus);