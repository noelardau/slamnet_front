import { apiService } from './api';

export interface Tournoi {
  idTournoi: number;
  nomTournoi: string;
  LieuTournoi: string;
  dateTournoi: string;
  heureTournoi: string;
  nbJury: number;
  afficheTournoi?: string;
  dureePerfo?: string;
  tirageAuSort: boolean;
  idCollectif: number;
  createdAt?: string;
}

export interface CreateTournoiData {
  nomTournoi: string;
  LieuTournoi: string;
  dateTournoi: string;
  heureTournoi: string;
  nbJury: number;
  afficheTournoi?: string;
  dureePerfo?: string;
  tirageAuSort?: boolean;
}

export interface UpdateTournoiData {
  nomTournoi?: string;
  LieuTournoi?: string;
  dateTournoi?: string;
  heureTournoi?: string;
  nbJury?: number;
  afficheTournoi?: string;
  dureePerfo?: string;
  tirageAuSort?: boolean;
}

class TournoiService {
  async createTournoi(data: CreateTournoiData): Promise<Tournoi> {
    try {
      const tournoi = await apiService.post<Tournoi>('/collectif/tournois', data);
      return tournoi;
    } catch (error) {
      console.error('Erreur lors de la création du tournoi:', error);
      throw error;
    }
  }

  async getTournois(): Promise<Tournoi[]> {
    try {
      const tournois = await apiService.get<Tournoi[]>('/collectif/tournois');
      return tournois;
    } catch (error) {
      console.error('Erreur lors de la récupération des tournois:', error);
      throw error;
    }
  }

  async getTournoi(id: number): Promise<Tournoi> {
    try {
      const tournoi = await apiService.get<Tournoi>(`/collectif/tournois/${id}`);
      return tournoi;
    } catch (error) {
      console.error('Erreur lors de la récupération du tournoi:', error);
      throw error;
    }
  }

  async updateTournoi(id: number, data: UpdateTournoiData): Promise<Tournoi> {
    try {
      const tournoi = await apiService.put<Tournoi>(`/collectif/tournois/${id}`, data);
      return tournoi;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du tournoi:', error);
      throw error;
    }
  }

  async deleteTournoi(id: number): Promise<void> {
    try {
      await apiService.delete(`/collectif/tournois/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du tournoi:', error);
      throw error;
    }
  }
}

export const tournoiService = new TournoiService();