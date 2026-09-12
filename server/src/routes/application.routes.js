import express from "express";

import {
  createApplication,
  getApplicationsByJob,
  getApplicationById,
  updateApplicationStatus,
  assignHiringManager,
  getAssignedApplications,
  getAssignedApplicationById,
  addInterviewNotes,
  finalizeApplication,
} from "../controllers/application.controller.js";

import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("recruiter"), createApplication);

router.get(
  "/job/:jobId",
  authenticate,
  authorizeRoles("recruiter", "admin", "super_admin", "hiring_manager"),
  getApplicationsByJob,
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

router.patch(
  "/:id/final-decision",
  authenticate,
  authorizeRoles("hiring_manager"),
  finalizeApplication,
);

export default router;
