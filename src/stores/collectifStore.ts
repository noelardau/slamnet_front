import { create } from 'zustand';
import { authService, CollectifProfile, UpdateProfileData } from '../services/authService';

interface CollectifStore {
  profile: CollectifProfile | null;
  isLoading: boolean;
  error: string | null;
  hydrateProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<CollectifProfile>;
  clearProfile: () => void;
}

export const useCollectifStore = create<CollectifStore>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  hydrateProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const profile = await authService.getProfile();
      set({ profile, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement du profil';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateProfile: async (data: UpdateProfileData) => {
    try {
      set({ isLoading: true, error: null });
      const updatedProfile = await authService.updateProfile(data);
      set({ profile: updatedProfile, isLoading: false });
      return updatedProfile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearProfile: () => {
    set({ profile: null });
  },
}));