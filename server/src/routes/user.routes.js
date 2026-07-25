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

// Admin Management
router.post(
  "/admins",
  authenticate,
  authorizeRoles("super_admin"),
  (req, res, next) => {
    req.role = "admin";
    next();
  },
  createUser,
);

router.get(
  "/admins",
  authenticate,
  authorizeRoles("super_admin"),
  (req, res, next) => {
    req.role = "admin";
    next();
  },
  getUsers,
);

router.get(
  "/admins/:id",
  authenticate,
  authorizeRoles("super_admin"),
  (req, res, next) => {
    req.role = "admin";
    next();
  },
  getUserById,
);

router.patch(
  "/admins/:id",
  authenticate,
  authorizeRoles("super_admin"),
  (req, res, next) => {
    req.role = "admin";
    next();
  },
  updateUser,
);

router.patch(
  "/admins/:id/status",
  authenticate,
  authorizeRoles("super_admin"),
  (req, res, next) => {
    req.role = "admin";
    next();
  },
  updateUserStatus,
);

router.delete(
  "/admins/:id",
  authenticate,
  authorizeRoles("super_admin"),
  (req, res, next) => {
    req.role = "admin";
    next();
  },
  deleteUser,
);

export default router;
