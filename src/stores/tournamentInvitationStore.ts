import { create } from 'zustand';
import {
  tournamentInvitationService,
  TournamentInvitation,
  CreateTournamentInvitationPayload,
} from '../services/tournamentInvitationService';

interface TournamentInvitationStore {
  invitations: TournamentInvitation[];
  isLoading: boolean;
  error: string | null;
  hydrateInvitations: (idTournoi: number) => Promise<void>;
  createInvitation: (idTournoi: number, payload: CreateTournamentInvitationPayload) => Promise<TournamentInvitation>;
  revokeInvitation: (idTournoi: number, idInvitation: number) => Promise<void>;
}

export const useTournamentInvitationStore = create<TournamentInvitationStore>((set, get) => ({
  invitations: [],
  isLoading: false,
  error: null,

  hydrateInvitations: async (idTournoi: number) => {
    try {
      set({ isLoading: true, error: null });
      const invitations = await tournamentInvitationService.getInvitations(idTournoi);
      set({ invitations, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des invitations';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createInvitation: async (idTournoi: number, payload: CreateTournamentInvitationPayload) => {
    try {
      set({ isLoading: true, error: null });
      const newInvitation = await tournamentInvitationService.createInvitation(idTournoi, payload);
      set((state) => ({
        invitations: [newInvitation, ...state.invitations],
        isLoading: false,
      }));
      return newInvitation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de l\'invitation';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  revokeInvitation: async (idTournoi: number, idInvitation: number) => {
    try {
      set({ isLoading: true, error: null });
      const updated = await tournamentInvitationService.revokeInvitation(idTournoi, idInvitation);
      set((state) => ({
        invitations: state.invitations.map((inv) =>
          inv.idTournamentInvitation === idInvitation ? updated : inv
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la révocation';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
}));
