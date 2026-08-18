import api from "../api/axios";

export const getDashboard = async () => {
  const response = await api.get("/super-admin/dashboard");

  return response.data;
};
