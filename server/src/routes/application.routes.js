import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorize.middleware.js";

import {
  createApplication,
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

// Create Application
router.post("/", authenticate, authorizeRoles("recruiter"), createApplication);

// Get Applications by Job
router.get(
  "/job/:jobId",
  authenticate,
  authorizeRoles("recruiter", "admin", "super_admin", "hiring_manager"),
  getApplicationsByJob,
);

// Get Assigned Applications - Hiring Manager
router.get(
  "/assigned",
  authenticate,
  authorizeRoles("hiring_manager"),
  getAssignedApplications,
);

// Get Assigned Application by ID - Hiring Manager
router.get(
  "/assigned/:id",
  authenticate,
  authorizeRoles("hiring_manager"),
  getAssignedApplicationById,
);

// Get Application by ID
router.get(
  "/:id",
  authenticate,
  authorizeRoles("recruiter", "admin", "super_admin", "hiring_manager"),
  getApplicationById,
);

// Update Application Status
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("recruiter", "hiring_manager"),
  updateApplicationStatus,
);

// Assign Hiring Manager
router.patch(
  "/:id/assign",
  authenticate,
  authorizeRoles("recruiter"),
  assignHiringManager,
);

// Add Interview Notes
router.patch(
  "/:id/interview-notes",
  authenticate,
  authorizeRoles("hiring_manager"),
  addInterviewNotes,
);

// Final Hiring Decision
router.patch(
  "/:id/final-decision",
  authenticate,
  authorizeRoles("hiring_manager"),
  finalizeApplication,
);

export default router;
