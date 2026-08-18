import api from "../api/axios";

export const getSuperAdminAnalytics = async () => {
  const response = await api.get("/analytics/super-admin");

  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await api.get("/analytics/admin");

  return response.data;
};

export const getRecruiterDashboard = async () => {
  const response = await api.get("/analytics/recruiter");

  return response.data;
};

export const getHiringManagerDashboard = async () => {
  const response = await api.get("/analytics/hiring-manager");

  return response.data;
};
