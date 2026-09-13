import Notification from "../models/Notification.model.js";

export const createNotification = async ({
  recipient,
  type,
  title,
  message,
  relatedApplication = null,
  relatedJob = null,
  relatedCandidate = null,
}) => {
  if (!recipient) return null;

  return Notification.create({
    recipient,
    type,
    title,
    message,
    relatedApplication,
    relatedJob,
    relatedCandidate,
  });
};

export const createNotifications = async (notifications) => {
  if (!notifications?.length) return [];

  return Notification.insertMany(notifications);
};
