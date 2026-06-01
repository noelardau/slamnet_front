import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, CollectifProfile, LoginData, RegisterData, UpdateProfileData } from '../services/authService';
import { useMembreStore } from '../stores/membreStore';
import { useTournoiStore } from '../stores/tournoiStore';

interface AuthContextType {
  user: CollectifProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CollectifProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          try {
            const profile = await authService.getProfile();
            setUser(profile);
            
            const membreStore = useMembreStore.getState();
            const tournoiStore = useTournoiStore.getState();
            
            await Promise.all([
              membreStore.hydrateMembres(),
              tournoiStore.hydrateTournois(),
            ]);
          } catch (profileError) {
            console.error('Erreur lors de la récupération du profil depuis l\'API:', profileError);
          }
        } else {
          try {
            const profile = await authService.getProfile();
            setUser(profile);
            
            const membreStore = useMembreStore.getState();
            const tournoiStore = useTournoiStore.getState();
            
            await Promise.all([
              membreStore.hydrateMembres(),
              tournoiStore.hydrateTournois(),
            ]);
          } catch (error) {
            console.error('Erreur lors du chargement de l\'utilisateur:', error);
            authService.logout();
          }
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.collectif);
      
      const membreStore = useMembreStore.getState();
      const tournoiStore = useTournoiStore.getState();
      
      await Promise.all([
        membreStore.hydrateMembres(),
        tournoiStore.hydrateTournois(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    
    useMembreStore.getState().membres = [];
    useTournoiStore.getState().tournois = [];
  };

  const refreshProfile = async () => {
    const profile = await authService.getProfile();
    setUser(profile);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    const profile = await authService.updateProfile(data);
    setUser(profile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
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