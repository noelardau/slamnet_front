import { create } from 'zustand';
import { performanceService, Performance, CreatePerformanceData, UpdatePerformanceData } from '../services/performanceService';
import { Participant } from '../services/participantService';

interface PerformanceStore {
  performances: Performance[];
  isLoading: boolean;
  error: string | null;
  participants: Participant[];
  participantDistribution: Map<number, number>;
  maxPerfoByParticipant: number;
  availableForDraw: Participant[];
  isLastParticipantAvailable: boolean;
  hydratePerformances: (tournamentId: number) => Promise<void>;
  setParticipants: (participants: Participant[]) => void;
  createPerformance: (data: CreatePerformanceData) => Promise<Performance>;
  updatePerformance: (id: number, data: UpdatePerformanceData) => Promise<Performance>;
  updatePerformanceLocal: (id: number, data: UpdatePerformanceData) => void;
  deletePerformance: (id: number) => Promise<void>;
  refreshPerformances: (tournamentId: number) => Promise<void>;
  computeTirageDistribution: () => {
    available: Participant[];
    maxPerfo: number;
    allEqual: boolean;
    effectiveMax: number;
    isLast: boolean;
  };
}

export const usePerformanceStore = create<PerformanceStore>((set, get) => ({
  performances: [],
  participants: [],
  participantDistribution: new Map(),
  maxPerfoByParticipant: 0,
  availableForDraw: [],
  isLastParticipantAvailable: false,
  isLoading: false,
  error: null,

  hydratePerformances: async (tournamentId: number) => {
    try {
      set({ isLoading: true, error: null });
      const performances = await performanceService.getTournamentPerformances(tournamentId);
      set({ performances, isLoading: false });
      get().computeTirageDistribution();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des performances';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setParticipants: (participants: Participant[]) => {
    set({ participants });
    get().computeTirageDistribution();
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
      get().computeTirageDistribution();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de la performance';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  computeTirageDistribution: () => {
    const state = get();
    const { participants, performances } = state;
    
    const distribution = new Map<number, number>();
    participants.forEach(p => distribution.set(p.idParticipant, 0));
    
    performances.forEach(perf => {
      const currentCount = distribution.get(perf.idParticipant) || 0;
      distribution.set(perf.idParticipant, currentCount + 1);
    });
    
    const counts = Array.from(distribution.values());
    const maxPerfo = counts.length > 0 ? Math.max(...counts) : 0;
    const allEqual = counts.length > 0 && counts.every(v => v === counts[0]);
    const effectiveMax = allEqual ? maxPerfo + 1 : maxPerfo;
    
    const available = participants.filter(p => {
      const count = distribution.get(p.idParticipant) || 0;
      return count < effectiveMax;
    });
    
    set({
      participantDistribution: distribution,
      maxPerfoByParticipant: maxPerfo,
      availableForDraw: available,
      isLastParticipantAvailable: available.length === 1,
    });
    
    return {
      available,
      maxPerfo,
      allEqual,
      effectiveMax,
      isLast: available.length === 1,
    };
  },

  refreshPerformances: async (tournamentId: number) => {
    await get().hydratePerformances(tournamentId);
  },
}));