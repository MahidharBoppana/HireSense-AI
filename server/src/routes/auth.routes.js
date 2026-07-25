import { Router } from "express";
import {
  loginUser,
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

// unsecure Routes
router.post("/login", loginUser);

// Secure routes

router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);

router.get("/me", verifyJWT, getCurrentUser);

export default router;
