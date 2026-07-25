import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorize.middleware.js";
import {
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidate.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "recruiter", "hiring_manager"),
  getCandidates,
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "recruiter", "hiring_manager"),
  getCandidateById,
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "recruiter"),
  updateCandidate,
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "recruiter"),
  deleteCandidate,
);

export default router;
