import api from "../api/axios";


export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await api.post("/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const parseResume = async (file) => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await api.post("/resumes/parse", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
