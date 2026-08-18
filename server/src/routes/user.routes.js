import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorize.middleware.js";

import {
  createUser,
  getUsers,
  getActiveHiringManagers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Admin Management
| Super Admin only
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Recruiter Management
| Admin only
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Hiring Manager Management
| Admin only
|--------------------------------------------------------------------------
*/

router.post(
  "/hiring-managers",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.role = "hiring_manager";
    next();
  },
  createUser,
);

router.get(
  "/hiring-managers",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.role = "hiring_manager";
    next();
  },
  getUsers,
);

router.get(
  "/hiring-managers/active",
  authenticate,
  authorizeRoles("recruiter"),
  getActiveHiringManagers,
);

router.get(
  "/hiring-managers/:id",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.role = "hiring_manager";
    next();
  },
  getUserById,
);

router.patch(
  "/hiring-managers/:id",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.role = "hiring_manager";
    next();
  },
  updateUser,
);

router.patch(
  "/hiring-managers/:id/status",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.role = "hiring_manager";
    next();
  },
  updateUserStatus,
);

router.delete(
  "/hiring-managers/:id",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.role = "hiring_manager";
    next();
  },
  deleteUser,
);

export default router;
