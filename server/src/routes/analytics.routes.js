import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorize.middleware.js";

import {
  getSuperAdminDashboard,
  getAdminDashboard,
  getRecruiterDashboard,
  getHiringManagerDashboard,
} from "../controllers/analytics.controller.js";

const router = Router();

router.get(
  "/super-admin",
  authenticate,
  authorizeRoles("super_admin"),
  getSuperAdminDashboard,
);

router.get("/admin", authenticate, authorizeRoles("admin"), getAdminDashboard);

router.get(
  "/recruiter",
  authenticate,
  authorizeRoles("recruiter"),
  getRecruiterDashboard,
);

router.get(
  "/hiring-manager",
  authenticate,
  authorizeRoles("hiring_manager"),
  getHiringManagerDashboard,
);

export default router;
