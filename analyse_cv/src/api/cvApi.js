import axiosInstance from './axiosConfig';

export const cvApi = {
  uploadCV: async (formData) => {
    // ✅ Ne pas écraser les headers, axios gère automatiquement multipart/form-data
    const response = await axiosInstance.post('/cv/upload', formData);
    return response.data;
  },
  getCVsByEtudiant: async (etudiantId) => {
    const response = await axiosInstance.get(`/cv/etudiant/${etudiantId}`);
    return response.data;
  },
  getCVById: async (id) => {
    const response = await axiosInstance.get(`/cv/${id}`);
    return response.data;
  },
  deleteCV: async (id) => {
    const response = await axiosInstance.delete(`/cv/${id}`);
    return response.data;
  },
  getAllCVs: async () => {
    const response = await axiosInstance.get('/cv/all');
    return response.data;
  },
  analyseCV: async (cvId) => {
    const response = await axiosInstance.post(`/cv/${cvId}/analyse`);
    return response.data;
  },
  exportCV: async (cvId, format = 'pdf') => {
    const response = await axiosInstance.get(`/cv/${id}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response; // Blob → ne pas faire .data
  },
};