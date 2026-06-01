import { create } from 'zustand';
import { membreService, Membre, CreateMembreData, UpdateMembreData } from '../services/membreService';

interface MembreStore {
  membres: Membre[];
  isLoading: boolean;
  error: string | null;
  hydrateMembres: () => Promise<void>;
  createMembre: (data: CreateMembreData) => Promise<Membre>;
  updateMembre: (id: number, data: UpdateMembreData) => Promise<Membre>;
  deleteMembre: (id: number) => Promise<void>;
  refreshMembres: () => Promise<void>;
}

export const useMembreStore = create<MembreStore>((set, get) => ({
  membres: [],
  isLoading: false,
  error: null,

  hydrateMembres: async () => {
    try {
      set({ isLoading: true, error: null });
      const membres = await membreService.getMembres();
      set({ membres, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des membres';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createMembre: async (data: CreateMembreData) => {
    try {
      set({ isLoading: true, error: null });
      const newMembre = await membreService.createMembre(data);
      set((state) => ({
        membres: [...state.membres, newMembre],
        isLoading: false,
      }));
      return newMembre;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création du membre';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateMembre: async (id: number, data: UpdateMembreData) => {
    try {
      set({ isLoading: true, error: null });
      const updatedMembre = await membreService.updateMembre(id, data);
      set((state) => ({
        membres: state.membres.map((m) => (m.idMembre === id ? updatedMembre : m)),
        isLoading: false,
      }));
      return updatedMembre;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du membre';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteMembre: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await membreService.deleteMembre(id);
      set((state) => ({
        membres: state.membres.filter((m) => m.idMembre !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression du membre';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  refreshMembres: async () => {
    await get().hydrateMembres();
  },
}));