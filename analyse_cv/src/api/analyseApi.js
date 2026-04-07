
import axiosInstance from './axiosConfig';

export const analyseApi = {
  getAnalysesByCV: async (cvId) => {
    const response = await axiosInstance.get(`/analyses/cv/${cvId}`);
    return response.data;
  },
  getAnalyseById: async (id) => {
    const response = await axiosInstance.get(`/analyses/${id}`);
    return response.data;
  },
  adapterCV: async (cvId, offreId) => {
    const response = await axiosInstance.post('/analyses/adapter', { cvId, offreId });
    return response.data;
  },
  getRecommandations: async (analyseId) => {
    const response = await axiosInstance.get(`/analyses/${analyseId}/recommandations`);
    return response.data;
  },
};