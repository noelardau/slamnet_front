import { apiService } from './api';

export type PrefLang = 'en' | 'fr';
export type PrefTheme = 'dark' | 'light';
export type UserRole = 'COLLECTIF' | 'ADMIN';

export interface RegisterData {
  nomCollectif: string;
  ville: string;
  email: string;
  password: string;
  photoCollectif?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  collectif: CollectifProfile;
}

export interface RegisterResponse {
  collectif: CollectifProfile;
}

export interface CollectifProfile {
  id: number;
  nomCollectif: string;
  ville: string;
  email: string;
  photoCollectif?: string;
  prefLang: PrefLang;
  prefTheme: PrefTheme;
  role: UserRole;
  active: boolean;
  createdAt?: string;
}

export interface UpdateProfileData {
  nomCollectif?: string;
  ville?: string;
  email?: string;
  photoCollectif?: string;
  prefLang?: PrefLang;
  prefTheme?: PrefTheme;
}

export interface UpdatePreferencesData {
  prefLang?: PrefLang;
  prefTheme?: PrefTheme;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await apiService.post<RegisterResponse>('/collectif/register', data);
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/collectif/login', {
        email,
        password,
      });
      apiService.setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.collectif));
      return response;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/collectif/logout', {});
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      apiService.clearToken();
      localStorage.removeItem('user');
    }
  }

  async getProfile(): Promise<CollectifProfile> {
    try {
      const profile = await apiService.get<CollectifProfile>('/collectif/profile');
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }

  async updateProfile(data: UpdateProfileData): Promise<CollectifProfile> {
    try {
      const profile = await apiService.put<CollectifProfile>('/collectif/profile', data);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  }

  async updatePreferences(data: UpdatePreferencesData): Promise<CollectifProfile> {
    try {
      const profile = await apiService.put<CollectifProfile>('/collectif/preferences', data);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      throw error;
    }
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiService.put('/collectif/password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    const token = apiService.getToken();
    const user = localStorage.getItem('user');
    return !!token && !!user;
  }

  getCurrentUser(): CollectifProfile | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export const authService = new AuthService();