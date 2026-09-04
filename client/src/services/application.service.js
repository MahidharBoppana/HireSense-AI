import api from "../api/axios";

export const createApplication = async (data) => {
  const response = await api.post("/applications", data);
  return response.data;
};

export const getApplicationsByJob = async (jobId, params = {}) => {
  const response = await api.get(`/applications/job/${jobId}`, {
    params,
  });
  return response.data;
};

export const getApplicationById = async (applicationId) => {
  const response = await api.get(`/applications/${applicationId}`);
  return response.data;
};

export const updateApplicationStatus = async ({ applicationId, status }) => {
  const response = await api.patch(`/applications/${applicationId}/status`, {
    status,
  });

  return response.data;
};

export const assignHiringManager = async ({
  applicationId,
  hiringManagerId,
}) => {
  const response = await api.patch(`/applications/${applicationId}/assign`, {
    hiringManagerId,
  });

  return response.data;
};

export const addInterviewNotes = async ({
  applicationId,
  interviewNotes,
  interviewRating,
  interviewRecommendation,
}) => {
  const response = await api.patch(
    `/applications/${applicationId}/interview-notes`,
    {
      interviewNotes,
      interviewRating,
      interviewRecommendation,
    },
  );

  return response.data;
};

export const getAssignedApplications = async (params = {}) => {
  const response = await api.get("/applications/assigned", {
    params,
  });

  return response.data;
};

export const getAssignedApplicationById = async (applicationId) => {
  const response = await api.get(`/applications/assigned/${applicationId}`);

  return response.data;
};

export const finalizeApplication = async ({ applicationId, status }) => {
  const response = await api.patch(
    `/applications/${applicationId}/final-decision`,
    { status },
  );

  return response.data;
};
