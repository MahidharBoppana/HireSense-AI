import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorize.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { uploadResume } from "../controllers/resume.controller.js";

const router = Router();

router.post(
  "/jobs/:jobId/resumes",
  authenticate,
  authorizeRoles("recruiter"),
  upload.single("resume"),
  uploadResume
);
export default router;