import api from "../api/axios";

export const login = async (data) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const updatePassword = async (data) => {
  const response = await api.patch("/auth/update-password", data);

  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post(`/auth/reset-password/${data.token}`, {
    newPassword: data.newPassword,
  });

  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh-token");

  return response.data;
};
