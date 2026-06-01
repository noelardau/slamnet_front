import { create } from 'zustand';
import { tournoiService, Tournoi, CreateTournoiData, UpdateTournoiData } from '../services/tournoiService';

interface TournoiStore {
  tournois: Tournoi[];
  isLoading: boolean;
  error: string | null;
  hydrateTournois: () => Promise<void>;
  createTournoi: (data: CreateTournoiData) => Promise<Tournoi>;
  updateTournoi: (id: number, data: UpdateTournoiData) => Promise<Tournoi>;
  deleteTournoi: (id: number) => Promise<void>;
  refreshTournois: () => Promise<void>;
}

export const useTournoiStore = create<TournoiStore>((set, get) => ({
  tournois: [],
  isLoading: false,
  error: null,

  hydrateTournois: async () => {
    try {
      set({ isLoading: true, error: null });
      const tournois = await tournoiService.getTournois();
      set({ tournois, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des tournois';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createTournoi: async (data: CreateTournoiData) => {
    try {
      set({ isLoading: true, error: null });
      const newTournoi = await tournoiService.createTournoi(data);
      set((state) => ({
        tournois: [...state.tournois, newTournoi],
        isLoading: false,
      }));
      return newTournoi;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création du tournoi';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateTournoi: async (id: number, data: UpdateTournoiData) => {
    try {
      set({ isLoading: true, error: null });
      const updatedTournoi = await tournoiService.updateTournoi(id, data);
      set((state) => ({
        tournois: state.tournois.map((t) => (t.idTournoi === id ? updatedTournoi : t)),
        isLoading: false,
      }));
      return updatedTournoi;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du tournoi';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteTournoi: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await tournoiService.deleteTournoi(id);
      set((state) => ({
        tournois: state.tournois.filter((t) => t.idTournoi !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression du tournoi';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  refreshTournois: async () => {
    await get().hydrateTournois();
  },
}));