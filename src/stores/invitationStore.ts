import { create } from 'zustand';
import {
  invitationService,
  Invitation,
  CreateInvitationPayload,
} from '../services/invitationService';

interface InvitationStore {
  invitations: Invitation[];
  isLoading: boolean;
  error: string | null;
  hydrateInvitations: () => Promise<void>;
  createInvitation: (payload: CreateInvitationPayload) => Promise<Invitation>;
  revokeInvitation: (id: number) => Promise<void>;
  refreshInvitations: () => Promise<void>;
}

export const useInvitationStore = create<InvitationStore>((set, get) => ({
  invitations: [],
  isLoading: false,
  error: null,

  hydrateInvitations: async () => {
    try {
      set({ isLoading: true, error: null });
      const invitations = await invitationService.getInvitations();
      set({ invitations, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des invitations';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createInvitation: async (payload: CreateInvitationPayload) => {
    try {
      set({ isLoading: true, error: null });
      const newInvitation = await invitationService.createInvitation(payload);
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

  revokeInvitation: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const updated = await invitationService.revokeInvitation(id);
      set((state) => ({
        invitations: state.invitations.map((inv) =>
          inv.idInvitation === id ? updated : inv
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la révocation';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  refreshInvitations: async () => {
    await get().hydrateInvitations();
  },
}));
