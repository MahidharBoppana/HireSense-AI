import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorize.middleware.js";

import { getActiveHiringManagers } from "../controllers/user.controller.js";

const router = Router();

router.get(
  "/hiring-managers/active",
  authenticate,
  authorizeRoles("recruiter"),
  getActiveHiringManagers,
);

export default router;
