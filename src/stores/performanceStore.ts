import { create } from 'zustand';
import { performanceService, Performance, CreatePerformanceData, UpdatePerformanceData } from '../services/performanceService';

interface PerformanceStore {
  performances: Performance[];
  isLoading: boolean;
  error: string | null;
  hydratePerformances: (tournamentId: number) => Promise<void>;
  createPerformance: (data: CreatePerformanceData) => Promise<Performance>;
  updatePerformance: (id: number, data: UpdatePerformanceData) => Promise<Performance>;
  updatePerformanceLocal: (id: number, data: UpdatePerformanceData) => void;
  deletePerformance: (id: number) => Promise<void>;
  refreshPerformances: (tournamentId: number) => Promise<void>;
}

export const usePerformanceStore = create<PerformanceStore>((set, get) => ({
  performances: [],
  isLoading: false,
  error: null,

  hydratePerformances: async (tournamentId: number) => {
    try {
      set({ isLoading: true, error: null });
      const performances = await performanceService.getTournamentPerformances(tournamentId);
      set({ performances, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des performances';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createPerformance: async (data: CreatePerformanceData) => {
    try {
      set({ isLoading: true, error: null });
      const newPerformance = await performanceService.createPerformance(data);
      set((state) => ({
        performances: [...state.performances, newPerformance],
        isLoading: false,
      }));
      return newPerformance;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la performance';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updatePerformanceLocal: (id: number, data: UpdatePerformanceData) => {
    set((state) => ({
      performances: state.performances.map((p) =>
        p.idPerfo === id ? { ...p, ...data } : p
      ),
    }));
  },

  updatePerformance: async (id: number, data: UpdatePerformanceData) => {
    try {
      set({ isLoading: true, error: null });
      const updatedPerformance = await performanceService.updatePerformance(id, data);
      set((state) => ({
        performances: state.performances.map((p) => (p.idPerfo === id ? updatedPerformance : p)),
        isLoading: false,
      }));
      return updatedPerformance;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la performance';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deletePerformance: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await performanceService.deletePerformance(id);
      set((state) => ({
        performances: state.performances.filter((p) => p.idPerfo !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de la performance';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  refreshPerformances: async (tournamentId: number) => {
    await get().hydratePerformances(tournamentId);
  },
}));