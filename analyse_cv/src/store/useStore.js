import { create } from 'zustand';

export const useCVStore = create((set) => ({
  cvList: [],
  selectedCV: null,
  setCVList: (list) => set({ cvList: list }),
  setSelectedCV: (cv) => set({ selectedCV: cv }),
  addCV: (cv) => set((s) => ({ cvList: [...s.cvList, cv] })),
  removeCV: (id) =>
    set((s) => ({ cvList: s.cvList.filter((c) => c.id !== id) })),
}));

export const useAnalyseStore = create((set) => ({
  currentAnalyse: null,
  recommandations: [],
  setAnalyse: (a) => set({ currentAnalyse: a }),
  setRecommandations: (r) => set({ recommandations: r }),
}));