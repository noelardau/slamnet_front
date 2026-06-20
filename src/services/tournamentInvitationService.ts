import { apiService } from './api';

export interface TournamentInvitation {
  idTournamentInvitation: number;
  token: string;
  idTournoi: number;
  statut: string;
  maxUsages: number | null;
  usagesCount: number;
  expireLe: string;
  createdAt: string;
}

export interface CreateTournamentInvitationPayload {
  dureeJours?: number;
  maxUsages?: number | null;
}

export interface TournamentInvitationPublicInfo {
  nomTournoi: string;
  LieuTournoi: string;
  dateTournoi: string;
  heureTournoi: string;
  nomCollectif: string;
  ville: string;
  expireLe: string;
  usagesCount: number;
  maxUsages: number | null;
}

class TournamentInvitationService {
  async createInvitation(
    idTournoi: number,
    payload: CreateTournamentInvitationPayload
  ): Promise<TournamentInvitation> {
    return apiService.post<TournamentInvitation>(
      `/collectif/tournois/${idTournoi}/invitations`,
      payload
    );
  }

  async getInvitations(idTournoi: number): Promise<TournamentInvitation[]> {
    return apiService.get<TournamentInvitation[]>(
      `/collectif/tournois/${idTournoi}/invitations`
    );
  }

  async revokeInvitation(idTournoi: number, idInvitation: number): Promise<TournamentInvitation> {
    return apiService.delete<TournamentInvitation>(
      `/collectif/tournois/${idTournoi}/invitations/${idInvitation}`
    );
  }

  async getInvitationByToken(token: string): Promise<TournamentInvitationPublicInfo> {
    return apiService.get<TournamentInvitationPublicInfo>(`/api/tournament-invitations/${token}`);
  }

  async acceptAsMembre(token: string, codeMembre: string): Promise<any> {
    return apiService.post<any>(`/api/tournament-invitations/${token}/accept/membre`, {
      codeMembre,
    });
  }

  async acceptAsGuest(token: string, pseudo: string): Promise<any> {
    return apiService.post<any>(`/api/tournament-invitations/${token}/accept/guest`, {
      pseudo,
    });
  }
}

export const tournamentInvitationService = new TournamentInvitationService();
