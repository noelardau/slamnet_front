import { apiService } from './api';

export interface Performance {
  idPerfo: number;
  duree: number | null;
  noteFinale: number | null;
  etat: string | null;
  idTournoi: number;
  idMembre: number | null;
  idGuest: number | null;
  tournoi?: {
    idTournoi: number;
    nomTournoi: string;
    LieuTournoi: string;
    dateTournoi: string;
    heureTournoi: string;
  };
  membre?: {
    idMembre: number;
    nomMembre: string;
    prenomMembre: string;
    pseudoMembre: string;
    photoMembre: string | null;
  };
  guest?: {
    idGuest: number;
    pseudo: string;
  };
}

export interface CreatePerformanceData {
  idTournoi: number;
  idMembre?: number;
  idGuest?: number;
  duree?: number;
  noteFinale?: number;
  etat?: string;
}

export interface UpdatePerformanceData {
  duree?: number;
  noteFinale?: number;
  etat?: string;
}

class PerformanceService {
  async createPerformance(data: CreatePerformanceData): Promise<Performance> {
    try {
      const performance = await apiService.post<Performance>(`/api/tournois/${data.idTournoi}/performances`, data);
      return performance;
    } catch (error) {
      console.error('Erreur lors de la création de la performance:', error);
      throw error;
    }
  }

  async getPerformance(id: number): Promise<Performance> {
    try {
      const performance = await apiService.get<Performance>(`/api/performances/${id}`);
      return performance;
    } catch (error) {
      console.error('Erreur lors de la récupération de la performance:', error);
      throw error;
    }
  }

  async getTournamentPerformances(tournamentId: number): Promise<Performance[]> {
    try {
      const performances = await apiService.get<Performance[]>(`/api/tournois/${tournamentId}/performances`);
      return performances;
    } catch (error) {
      console.error('Erreur lors de la récupération des performances du tournoi:', error);
      throw error;
    }
  }

  async getMemberPerformances(memberId: number): Promise<Performance[]> {
    try {
      const performances = await apiService.get<Performance[]>(`/api/membres/${memberId}/performances`);
      return performances;
    } catch (error) {
      console.error('Erreur lors de la récupération des performances du membre:', error);
      throw error;
    }
  }

  async getGuestPerformances(guestId: number): Promise<Performance[]> {
    try {
      const performances = await apiService.get<Performance[]>(`/api/guests/${guestId}/performances`);
      return performances;
    } catch (error) {
      console.error('Erreur lors de la récupération des performances de l\'invité:', error);
      throw error;
    }
  }

  async updatePerformance(id: number, data: UpdatePerformanceData): Promise<Performance> {
    try {
      const performance = await apiService.put<Performance>(`/api/performances/${id}`, data);
      return performance;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la performance:', error);
      throw error;
    }
  }

  async deletePerformance(id: number): Promise<void> {
    try {
      await apiService.delete(`/api/performances/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la performance:', error);
      throw error;
    }
  }
}

export const performanceService = new PerformanceService();