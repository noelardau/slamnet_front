import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, CollectifProfile, LoginData, RegisterData, UpdateProfileData } from '../services/authService';
import { useMembreStore } from '../stores/membreStore';
import { useTournoiStore } from '../stores/tournoiStore';
import { useCollectifStore } from '../stores/collectifStore';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';

interface AuthContextType {
  user: CollectifProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<CollectifProfile>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CollectifProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const { setTheme } = useTheme();
  const { setLanguage } = useLanguage();

  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = user?.role === 'ADMIN';

  // Applique les préférences (thème + langue) depuis le profil collectif
  const applyPreferences = (profile: CollectifProfile | null) => {
    if (profile?.prefTheme) {
      setTheme(profile.prefTheme);
    } else {
      setTheme('dark');
    }
    if (profile?.prefLang) {
      setLanguage(profile.prefLang);
    } else {
      setLanguage('en');
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Appliquer immédiatement les prefs depuis le cache local (anti-flash)
          applyPreferences(currentUser);
          try {
            const profile = await authService.getProfile();
            setUser(profile);
            applyPreferences(profile);

            const membreStore = useMembreStore.getState();
            const tournoiStore = useTournoiStore.getState();
            const collectifStore = useCollectifStore.getState();

            await Promise.all([
              membreStore.hydrateMembres(),
              tournoiStore.hydrateTournois(),
              collectifStore.hydrateProfile(),
            ]);
          } catch (profileError) {
            console.error('Erreur lors de la récupération du profil depuis l\'API:', profileError);
          }
        } else {
          try {
            const profile = await authService.getProfile();
            setUser(profile);
            applyPreferences(profile);

            const membreStore = useMembreStore.getState();
            const tournoiStore = useTournoiStore.getState();
            const collectifStore = useCollectifStore.getState();

            await Promise.all([
              membreStore.hydrateMembres(),
              tournoiStore.hydrateTournois(),
              collectifStore.hydrateProfile(),
            ]);
          } catch (error) {
            console.error('Erreur lors du chargement de l\'utilisateur:', error);
            authService.logout();
          }
        }
      } else {
        setUser(null);
        applyPreferences(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      setUser(null);
      applyPreferences(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<CollectifProfile> => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.collectif);
      applyPreferences(response.collectif);

      const membreStore = useMembreStore.getState();
      const tournoiStore = useTournoiStore.getState();
      const collectifStore = useCollectifStore.getState();

      await Promise.all([
        membreStore.hydrateMembres(),
        tournoiStore.hydrateTournois(),
        collectifStore.hydrateProfile(),
      ]);

      return response.collectif;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);

    useMembreStore.getState().membres = [];
    useTournoiStore.getState().tournois = [];
    useCollectifStore.getState().clearProfile();

    // Reset aux valeurs par défaut (visiteur non connecté)
    applyPreferences(null);
  };

  const refreshProfile = async () => {
    const profile = await authService.getProfile();
    setUser(profile);
    applyPreferences(profile);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    const profile = await authService.updateProfile(data);
    setUser(profile);
    applyPreferences(profile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}
