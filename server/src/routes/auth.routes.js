import { Router } from "express";
import {
  loginUser,
  getCurrentUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  logoutUser,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

// unsecure Routes
router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

// Secure routes
router.patch("/update-password", verifyJWT, updatePassword);

router.post("/logout", verifyJWT, logoutUser);

router.post("/refresh-token", refreshAccessToken);

router.get("/me", verifyJWT, getCurrentUser);

export default router;
