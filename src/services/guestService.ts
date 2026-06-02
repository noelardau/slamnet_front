import { apiService } from './api';

export interface Guest {
  idGuest: number;
  pseudo: string;
}

export interface CreateGuestData {
  pseudo: string;
}

export interface UpdateGuestData {
  pseudo?: string;
}

class GuestService {
  async createGuest(data: CreateGuestData): Promise<Guest> {
    try {
      const guest = await apiService.post<Guest>('/api/guests', data);
      return guest;
    } catch (error) {
      console.error('Erreur lors de la création de l\'invité:', error);
      throw error;
    }
  }

  async getGuests(): Promise<Guest[]> {
    try {
      const guests = await apiService.get<Guest[]>('/api/guests');
      return guests;
    } catch (error) {
      console.error('Erreur lors de la récupération des invités:', error);
      throw error;
    }
  }

  async getGuest(id: number): Promise<Guest> {
    try {
      const guest = await apiService.get<Guest>(`/api/guests/${id}`);
      return guest;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'invité:', error);
      throw error;
    }
  }

  async updateGuest(id: number, data: UpdateGuestData): Promise<Guest> {
    try {
      const guest = await apiService.put<Guest>(`/api/guests/${id}`, data);
      return guest;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'invité:', error);
      throw error;
    }
  }

  async deleteGuest(id: number): Promise<void> {
    try {
      await apiService.delete(`/api/guests/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'invité:', error);
      throw error;
    }
  }
}

export const guestService = new GuestService();