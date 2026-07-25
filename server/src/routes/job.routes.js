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

router.post("/", authenticate, authorizeRoles("recruiter"), createJob);

router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "recruiter", "hiring_manager"),
  getJobs,
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "recruiter", "hiring_manager"),
  getJobById,
);

router.patch("/:id", authenticate, authorizeRoles("recruiter"), updateJob);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("recruiter"),
  updateJobStatus,
);

router.delete("/:id", authenticate, authorizeRoles("recruiter"), deleteJob);

export default router;
