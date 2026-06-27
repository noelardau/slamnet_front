import { apiService } from './api';
import type { UserRole } from './authService';

export interface AdminStats {
  nbCollectifs: number;
  nbTournois: number;
  nbMembres: number;
  nbInvites: number;
  nbPerformances: number;
}

export interface AdminCollectif {
  idCollectif: number;
  nomCollectif: string;
  ville: string;
  email: string;
  photoCollectif?: string;
  prefLang: string;
  prefTheme: string;
  role: UserRole;
  active: boolean;
  nbMembres: number;
  nbTournois: number;
}

class AdminService {
  async getStats(): Promise<AdminStats> {
    return apiService.get<AdminStats>('/api/admin/stats');
  }

  async listCollectifs(): Promise<AdminCollectif[]> {
    return apiService.get<AdminCollectif[]>('/api/admin/collectifs');
  }

  async toggleCollectifActive(id: number, active: boolean): Promise<AdminCollectif> {
    return apiService.patch<AdminCollectif>(`/api/admin/collectifs/${id}/active`, { active });
  }

  async deleteCollectif(id: number): Promise<AdminCollectif> {
    return apiService.delete<AdminCollectif>(`/api/admin/collectifs/${id}`);
  }
}

export const adminService = new AdminService();
