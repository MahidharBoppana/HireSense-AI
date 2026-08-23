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
