import { create } from 'zustand';
import { statisticsService, ParticipantTournamentStats, AllParticipantsTournamentStatsResponse, MemberGlobalStats } from '../services/statisticsService';

interface StatisticsStore {
  // Stats par tournoi
  allParticipantsStats: AllParticipantsTournamentStatsResponse | null;
  
  // Stats globales membre
  memberGlobalStats: MemberGlobalStats | null;
  
  // Loading states
  isLoadingAllParticipantsStats: boolean;
  isLoadingMemberGlobalStats: boolean;
  
  // Errors
  error: string | null;
  
  // Actions
  hydrateAllParticipantsStats: (tournamentId: number) => Promise<void>;
  hydrateMemberGlobalStats: (memberId: number) => Promise<void>;
  clearStats: () => void;
  clearError: () => void;
}

export const useStatisticsStore = create<StatisticsStore>((set, get) => ({
  allParticipantsStats: null,
  memberGlobalStats: null,
  isLoadingAllParticipantsStats: false,
  isLoadingMemberGlobalStats: false,
  error: null,

  hydrateAllParticipantsStats: async (tournamentId: number) => {
    set({ isLoadingAllParticipantsStats: true, error: null });
    try {
      const stats = await statisticsService.getAllParticipantsTournamentStats(tournamentId);
      set({ allParticipantsStats: stats, isLoadingAllParticipantsStats: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des statistiques';
      set({ error: errorMessage, isLoadingAllParticipantsStats: false });
      throw error;
    }
  },

  hydrateMemberGlobalStats: async (memberId: number) => {
    set({ isLoadingMemberGlobalStats: true, error: null });
    try {
      const stats = await statisticsService.getMemberGlobalStats(memberId);
      set({ memberGlobalStats: stats, isLoadingMemberGlobalStats: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des statistiques';
      set({ error: errorMessage, isLoadingMemberGlobalStats: false });
      throw error;
    }
  },

  clearStats: () => {
    set({
      allParticipantsStats: null,
      memberGlobalStats: null,
      error: null
    });
  },

  clearError: () => {
    set({ error: null });
  }
}));