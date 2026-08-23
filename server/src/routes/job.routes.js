import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorize.middleware.js";

import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  updateJobStatus,
  deleteJob,
} from "../controllers/job.controller.js";

const router = Router();

// Create Job
router.post("/", authenticate, authorizeRoles("recruiter"), createJob);

// Get Jobs
router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "recruiter", "hiring_manager"),
  getJobs,
);

// Get Job By ID
router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "recruiter", "hiring_manager"),
  getJobById,
);

// Update Job
router.patch("/:id", authenticate, authorizeRoles("recruiter"), updateJob);

// Update Job Status
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("recruiter"),
  updateJobStatus,
);

// Delete Job
router.delete("/:id", authenticate, authorizeRoles("recruiter"), deleteJob);

export default router;
