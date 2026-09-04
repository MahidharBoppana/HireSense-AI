import api from "../api/axios";

// Get all candidates
export const getCandidates = async (params = {}) => {
  const response = await api.get("/candidates", {
    params,
  });

  return response.data;
};

// Get candidate by ID
export const getCandidateById = async (candidateId) => {
  const response = await api.get(`/candidates/${candidateId}`);

  return response.data;
};

// Create candidate
export const createCandidate = async (data) => {
  const response = await api.post("/candidates", data);

  return response.data;
};

// Update candidate
export const updateCandidate = async ({ candidateId, data }) => {
  const response = await api.patch(
    `/candidates/${candidateId}`,
    data,
  );

  return response.data;
};

// Delete candidate
export const deleteCandidate = async (candidateId) => {
  const response = await api.delete(`/candidates/${candidateId}`);

  return response.data;
};

export const parseResume = async (formData) => {
  const response = await api.post("/resumes/parse", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
