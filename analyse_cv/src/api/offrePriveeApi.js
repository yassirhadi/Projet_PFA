import axiosInstance from './axiosConfig';

/** Offres privées : visible uniquement par l'étudiant destinataire (et l'admin côté API). */
export const offrePriveeApi = {
  getMine: async () => {
    const { data } = await axiosInstance.get('/offres-privees/me');
    return Array.isArray(data) ? data : [];
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/offres-privees/${id}`);
    return data;
  },

  markAsRead: async (id) => {
    await axiosInstance.patch(`/offres-privees/${id}/mark-read`);
  },
};
