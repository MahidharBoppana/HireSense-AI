import api from "../api/axios";

export const getJobs = async (params = {}) => {
  const response = await api.get("/jobs", {
    params,
  });

  return response.data;
};

export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);

  return response.data;
};

export const createJob = async (data) => {
  const response = await api.post("/jobs", data);

  return response.data;
};

export const updateJob = async ({ jobId, data }) => {
  const response = await api.patch(`/jobs/${jobId}`, data);

  return response.data;
};

export const updateJobStatus = async ({ jobId, status }) => {
  const response = await api.patch(`/jobs/${jobId}/status`, {
    status,
  });

  return response.data;
};

export const deleteJob = async (jobId) => {
  const response = await api.delete(`/jobs/${jobId}`);

  return response.data;
};
