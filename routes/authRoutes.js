import express from "express";
import {
  registerController,
  loginController,
  getProfileController,
} from "../controllers/authController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/profile", requireSignIn, getProfileController);

export default router;