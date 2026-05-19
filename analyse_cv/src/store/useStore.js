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
  analyseHistory: [],
  setAnalyse: (a) => set((s) => ({
    currentAnalyse: a,
    analyseHistory: a
      ? [a, ...s.analyseHistory.filter((x) => x.id !== a.id)]
      : s.analyseHistory,
  })),
  setRecommandations: (r) => set({ recommandations: r }),
}));

// ✅ Nouveau store pour les offres privées — alimente le badge sidebar
export const useOffreStore = create((set) => ({
  privateOffresCount: 0,
  setPrivateOffresCount: (countOrUpdater) => set((s) => ({
    privateOffresCount: typeof countOrUpdater === 'function'
      ? countOrUpdater(s.privateOffresCount)
      : countOrUpdater,
  })),
}));
