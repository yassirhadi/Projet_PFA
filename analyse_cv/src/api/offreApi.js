import axiosInstance from './axiosConfig';

const BASE = '/jobs';

export const offreApi = {
  getOffres: async () => {
    const response = await axiosInstance.get(`${BASE}/active`);
    return response.data;
  },
  getOffreById: async (id) => {
    const response = await axiosInstance.get(`${BASE}/${id}`);
    return response.data;
  },
  createOffre: async (offreData) => {
    const response = await axiosInstance.post(BASE, offreData);
    return response.data;
  },
  updateOffre: async (id, offreData) => {
    const response = await axiosInstance.put(`${BASE}/${id}`, offreData);
    return response.data;
  },
  deleteOffre: async (id) => {
    // 204 No Content → pas de body
    await axiosInstance.delete(`${BASE}/${id}`);
  },
  getAllOffres: async () => {
    const response = await axiosInstance.get(`${BASE}/active`);
    return response.data;
  },
};