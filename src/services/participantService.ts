import { apiService } from './api';

export interface Participant {
  idParticipant: number;
  idMembre: number | null;
  idTournoi: number;
  idGuest: number | null;
  totalNote: number;
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

export interface CreateGuestData {
  pseudo: string;
}

class ParticipantService {
  async addParticipantToTournament(tournamentId: number, membreId: number): Promise<Participant> {
    try {
      const participant = await apiService.post<Participant>(`/api/tournois/${tournamentId}/participants`, { idMembre: membreId });
      return participant;
    } catch (error) {
      console.error('Erreur lors de l\'inscription du participant au tournoi:', error);
      throw error;
    }
  }

  async addGuestToTournament(tournamentId: number, guestData: CreateGuestData): Promise<Participant> {
    try {
      const participant = await apiService.post<Participant>(`/api/tournois/${tournamentId}/guests`, guestData);
      return participant;
    } catch (error) {
      console.error('Erreur lors de l\'inscription de l\'invité au tournoi:', error);
      throw error;
    }
  }

  async getTournamentParticipants(tournamentId: number): Promise<Participant[]> {
    try {
      const participants = await apiService.get<Participant[]>(`/api/tournois/${tournamentId}/participants`);
      console.log('Participants récupérés:', participants);
      return participants;
    } catch (error) {
      console.error('Erreur lors de la récupération des participants du tournoi:', error);
      throw error;
    }
  }

  async removeParticipantFromTournament(tournamentId: number): Promise<void> {
    try {
      await apiService.delete(`/api/tournois/${tournamentId}/participants`);
    } catch (error) {
      console.error('Erreur lors du retrait du participant du tournoi:', error);
      throw error;
    }
  }

  async removeGuestFromTournament(tournamentId: number, guestId: number): Promise<void> {
    try {
      await apiService.delete(`/api/tournois/${tournamentId}/guests/${guestId}`);
    } catch (error) {
      console.error('Erreur lors du retrait de l\'invité du tournoi:', error);
      throw error;
    }
  }
}

export const participantService = new ParticipantService();