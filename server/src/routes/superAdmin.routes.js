import { Router } from "express";
import { getDashboard } from "../controllers/superAdmin.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorize.middleware.js";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  authorizeRoles("super_admin"),
  getDashboard,
);

export default router;
