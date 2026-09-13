import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getNotifications);

router.patch("/read-all", markAllNotificationsAsRead);

router.patch("/:id/read", markNotificationAsRead);

router.delete("/:id", deleteNotification);

export default router;
