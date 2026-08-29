import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorize.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

import {
  uploadResume,
  parseResumeFile,
} from "../controllers/resume.controller.js";

const router = Router();

router.post(
  "/upload",
  authenticate,
  authorizeRoles("recruiter"),
  upload.single("resume"),
  uploadResume,
);

router.post(
  "/parse",
  authenticate,
  authorizeRoles("recruiter"),
  upload.single("resume"),
  parseResumeFile,
);

export default router;
