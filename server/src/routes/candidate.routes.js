import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorize.middleware.js";

import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidate.controller.js";

const router = Router();

// Create Candidate
router.post("/", authenticate, authorizeRoles("recruiter"), createCandidate);

// Get All Candidates
router.get("/", authenticate, authorizeRoles("recruiter"), getCandidates);

// Get Candidate By ID
router.get("/:id", authenticate, authorizeRoles("recruiter"), getCandidateById);

// Update Candidate
router.patch(
  "/:id",
  authenticate,
  authorizeRoles("recruiter"),
  updateCandidate,
);

// Delete Candidate
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("recruiter"),
  deleteCandidate,
);

export default router;
