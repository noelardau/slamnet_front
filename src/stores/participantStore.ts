import { create } from 'zustand';
import { participantService, Participant, CreateGuestData } from '../services/participantService';

interface ParticipantStore {
  participants: Participant[];
  isLoading: boolean;
  error: string | null;
  hydrateParticipants: (tournamentId: number) => Promise<void>;
  addParticipant: (tournamentId: number, membreId: number) => Promise<Participant>;
  addGuest: (tournamentId: number, guestData: CreateGuestData) => Promise<Participant>;
  removeParticipant: (tournamentId: number) => Promise<void>;
  removeGuest: (tournamentId: number, guestId: number) => Promise<void>;
  refreshParticipants: (tournamentId: number) => Promise<void>;
  refreshParticipantsSilent: (tournamentId: number) => Promise<void>;
}

export const useParticipantStore = create<ParticipantStore>((set, get) => ({
  participants: [],
  isLoading: false,
  error: null,

  hydrateParticipants: async (tournamentId: number) => {
    try {
      set({ isLoading: true, error: null });
      const participants = await participantService.getTournamentParticipants(tournamentId);
      set({ participants, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des participants';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  refreshParticipantsSilent: async (tournamentId: number) => {
    try {
      const participants = await participantService.getTournamentParticipants(tournamentId);
      set({ participants });
    } catch (error) {
      // Silencieux : ne pas impacter l'UI en cas d'échec du polling
      console.error('[participantStore] refreshParticipantsSilent error:', error);
    }
  },

  addParticipant: async (tournamentId: number, membreId: number) => {
    try {
      set({ isLoading: true, error: null });
      const newParticipant = await participantService.addParticipantToTournament(tournamentId, membreId);
      set((state) => ({
        participants: [...state.participants, newParticipant],
        isLoading: false,
      }));
      return newParticipant;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'inscription du participant';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  addGuest: async (tournamentId: number, guestData: CreateGuestData) => {
    try {
      set({ isLoading: true, error: null });
      const newParticipant = await participantService.addGuestToTournament(tournamentId, guestData);
      set((state) => ({
        participants: [...state.participants, newParticipant],
        isLoading: false,
      }));
      return newParticipant;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'inscription de l\'invité';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  removeParticipant: async (tournamentId: number) => {
    try {
      set({ isLoading: true, error: null });
      await participantService.removeParticipantFromTournament(tournamentId);
      set((state) => ({
        participants: state.participants.filter((p) => p.idMembre !== null),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du retrait du participant';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  removeGuest: async (tournamentId: number, guestId: number) => {
    try {
      set({ isLoading: true, error: null });
      await participantService.removeGuestFromTournament(tournamentId, guestId);
      set((state) => ({
        participants: state.participants.filter((p) => p.idGuest !== guestId),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du retrait de l\'invité';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  refreshParticipants: async (tournamentId: number) => {
    await get().hydrateParticipants(tournamentId);
  },
}));