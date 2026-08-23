import api from "../api/axios";

// Admin API's

export const getAdmins = async () => {
  const response = await api.get("/users/admins");

  return response.data;
};

export const createAdmin = async (data) => {
  const response = await api.post("/users/admins", data);

  return response.data;
};

export const updateAdmin = async ({ adminId, data }) => {
  const response = await api.patch(`/users/admins/${adminId}`, data);

  return response.data;
};

export const updateAdminStatus = async ({ adminId, isActive }) => {
  const response = await api.patch(`/users/admins/${adminId}/status`, {
    isActive,
  });

  return response.data;
};

export const deleteAdmin = async (adminId) => {
  const response = await api.delete(`/users/admins/${adminId}`);

  return response.data;
};

// Recruiter API's

export const getRecruiters = async () => {
  const response = await api.get("/admin/recruiters");

  return response.data;
};

export const createRecruiter = async (data) => {
  const response = await api.post("/admin/recruiters", data);

  return response.data;
};

export const updateRecruiter = async ({ recruiterId, data }) => {
  const response = await api.patch(`/admin/recruiters/${recruiterId}`, data);

  return response.data;
};

export const updateRecruiterStatus = async ({ recruiterId, isActive }) => {
  const response = await api.patch(`/admin/recruiters/${recruiterId}/status`, {
    isActive,
  });

  return response.data;
};

export const deleteRecruiter = async (recruiterId) => {
  const response = await api.delete(`/admin/recruiters/${recruiterId}`);

  return response.data;
};

// Hiring Manager API's

export const getHiringManagers = async () => {
  const response = await api.get("/admin/hiring-managers");

  return response.data;
};

export const createHiringManager = async (data) => {
  const response = await api.post("/admin/hiring-managers", data);

  return response.data;
};

export const updateHiringManager = async ({ hiringManagerId, data }) => {
  const response = await api.patch(
    `/admin/hiring-managers/${hiringManagerId}`,
    data,
  );

  return response.data;
};

export const updateHiringManagerStatus = async ({
  hiringManagerId,
  isActive,
}) => {
  const response = await api.patch(
    `/admin/hiring-managers/${hiringManagerId}/status`,
    {
      isActive,
    },
  );

  return response.data;
};

export const deleteHiringManager = async (hiringManagerId) => {
  const response = await api.delete(
    `/admin/hiring-managers/${hiringManagerId}`,
  );

  return response.data;
};
