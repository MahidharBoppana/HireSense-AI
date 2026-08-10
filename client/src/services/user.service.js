import api from "../api/axios";

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
