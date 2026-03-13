import express from "express";
import { Login } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { ChangePassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", Login);


router.get("/verify", verifyToken, (req, res) => {

  res.json({
    success: true,
    message: "Token valid",
    user: req.user
  });

});

router.put("/change-password", verifyToken, ChangePassword);

export default router;