import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorize.middleware.js";
import {
  updateApplicationStatus,
  getApplicationsByJob,
  getApplicationById,
  assignHiringManager,
  addInterviewNotes,
  getAssignedApplications,
  getAssignedApplicationById,
  finalizeApplication,
} from "../controllers/application.controller.js";

const router = Router();

router.get(
  "/job/:jobId",
  authenticate,
  authorizeRoles("recruiter", "admin", "super_admin", "hiring_manager"),
  getApplicationsByJob,
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles("recruiter", "admin", "super_admin", "hiring_manager"),
  getApplicationById,
);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("recruiter", "hiring_manager"),
  updateApplicationStatus,
);

router.patch(
  "/:id/assign",
  authenticate,
  authorizeRoles("recruiter"),
  assignHiringManager,
);

router.patch(
  "/:id/interview-notes",
  authenticate,
  authorizeRoles("hiring_manager"),
  addInterviewNotes,
);

router.get(
  "/assigned",
  authenticate,
  authorizeRoles("hiring_manager"),
  getAssignedApplications,
);

router.get(
  "/assigned/:id",
  authenticate,
  authorizeRoles("hiring_manager"),
  getAssignedApplicationById,
);

router.patch(
  "/:id/final-decision",
  authenticate,
  authorizeRoles("hiring_manager"),
  finalizeApplication,
);

export default router;
