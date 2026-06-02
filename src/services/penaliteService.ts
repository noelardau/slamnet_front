import { apiService } from './api';

export interface Penalite {
  idPenalite: number;
  idPerfo: number;
  valeur: number;
  performance?: {
    idPerfo: number;
    duree: string | null;
    noteFinale: number | null;
    etat: string | null;
  };
}

export interface CreatePenaliteData {
  idPerfo: number;
  valeur: number;
}

export interface UpdatePenaliteData {
  valeur?: number;
}

class PenaliteService {
  async createBulk(idPerfo: number, penalites: { valeur: number }[]): Promise<Penalite[]> {
    try {
      const result = await apiService.post<Penalite[]>(`/api/performances/${idPerfo}/penalites/bulk`, { penalites });
      return result;
    } catch (error) {
      console.error('Erreur lors de la création des pénalités en masse:', error);
      throw error;
    }
  }

  async getPerformancePenalites(idPerfo: number): Promise<Penalite[]> {
    try {
      const penalites = await apiService.get<Penalite[]>(`/api/performances/${idPerfo}/penalites`);
      return penalites;
    } catch (error) {
      console.error('Erreur lors de la récupération des pénalités de la performance:', error);
      throw error;
    }
  }

  async getPenalite(id: number): Promise<Penalite> {
    try {
      const penalite = await apiService.get<Penalite>(`/api/penalites/${id}`);
      return penalite;
    } catch (error) {
      console.error('Erreur lors de la récupération de la pénalité:', error);
      throw error;
    }
  }
}

export const penaliteService = new PenaliteService();