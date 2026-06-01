import { apiService } from './api';

export interface Membre {
  idMembre: number;
  nomMembre: string;
  prenomMembre: string;
  photoMembre?: string;
  dateNaissance: string;
  adresse: string;
  idCollectif: number;
  createdAt?: string;
}

export interface CreateMembreData {
  nomMembre: string;
  prenomMembre: string;
  photoMembre?: string;
  dateNaissance: string;
  adresse: string;
}

export interface UpdateMembreData {
  nomMembre?: string;
  prenomMembre?: string;
  photoMembre?: string;
  dateNaissance?: string;
  adresse?: string;
}

class MembreService {
  async createMembre(data: CreateMembreData): Promise<Membre> {
    try {
      const membre = await apiService.post<Membre>('/collectif/membres', data);
      return membre;
    } catch (error) {
      console.error('Erreur lors de la création du membre:', error);
      throw error;
    }
  }

  async getMembres(): Promise<Membre[]> {
    try {
      const membres = await apiService.get<Membre[]>('/collectif/membres');
      return membres;
    } catch (error) {
      console.error('Erreur lors de la récupération des membres:', error);
      throw error;
    }
  }

  async getMembre(id: number): Promise<Membre> {
    try {
      const membre = await apiService.get<Membre>(`/collectif/membres/${id}`);
      return membre;
    } catch (error) {
      console.error('Erreur lors de la récupération du membre:', error);
      throw error;
    }
  }

  async updateMembre(id: number, data: UpdateMembreData): Promise<Membre> {
    try {
      const membre = await apiService.put<Membre>(`/collectif/membres/${id}`, data);
      return membre;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du membre:', error);
      throw error;
    }
  }

  async deleteMembre(id: number): Promise<void> {
    try {
      await apiService.delete(`/collectif/membres/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du membre:', error);
      throw error;
    }
  }
}

export const membreService = new MembreService();