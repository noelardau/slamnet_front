import { create } from 'zustand';
import { penaliteService, Penalite } from '../services/penaliteService';

interface PenaliteStore {
  penalites: Penalite[];
  isLoading: boolean;
  error: string | null;
  hydratePenalites: (performanceId: number) => Promise<void>;
  createBulkPenalites: (performanceId: number, penalites: { valeur: number }[]) => Promise<Penalite[]>;
  clearPenalites: () => void;
}

export const usePenaliteStore = create<PenaliteStore>((set, get) => ({
  penalites: [],
  isLoading: false,
  error: null,

  hydratePenalites: async (performanceId: number) => {
    try {
      set({ isLoading: true, error: null });
      const penalites = await penaliteService.getPerformancePenalites(performanceId);
      set({ penalites, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des pénalités';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createBulkPenalites: async (performanceId: number, penalites: { valeur: number }[]) => {
    try {
      set({ isLoading: true, error: null });
      const newPenalites = await penaliteService.createBulk(performanceId, penalites);
      set((state) => ({
        penalites: newPenalites,
        isLoading: false,
      }));
      return newPenalites;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création des pénalités';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearPenalites: () => {
    set({ penalites: [] });
  },
}));