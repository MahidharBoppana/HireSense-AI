import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorize.middleware.js";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

/* Recruiters */

// Create
router.post(
  "/recruiters",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.role = "recruiter";
    next();
  },
  createUser,
);

// Get All
router.get(
  "/recruiters",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.role = "recruiter";
    next();
  },
  getUsers,
);

// Get By Id
router.get(
  "/recruiters/:id",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.role = "recruiter";
    next();
  },
  getUserById,
);

// Update
router.patch(
  "/recruiters/:id",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.role = "recruiter";
    next();
  },
  updateUser,
);

// Update Status
router.patch(
  "/recruiters/:id/status",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.role = "recruiter";
    next();
  },
  updateUserStatus,
);

// Delete
router.delete(
  "/recruiters/:id",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.role = "recruiter";
    next();
  },
  deleteUser,
);

export default router;
