import { apiService } from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface Invitation {
  idInvitation: number;
  token: string;
  idCollectif: number;
  statut: string;
  maxUsages: number | null;
  usagesCount: number;
  expireLe: string;
  createdAt: string;
}

export interface CreateInvitationPayload {
  dureeJours?: number;
  maxUsages?: number | null;
}

export interface InvitationPublicInfo {
  nomCollectif: string;
  ville: string;
  photoCollectif?: string | null;
  expireLe: string;
  usagesCount: number;
  maxUsages: number | null;
}

export interface AcceptInvitationData {
  nomMembre: string;
  prenomMembre: string;
  pseudoMembre: string;
  emailMembre: string;
  dateNaissance: string;
  adresse: string;
  photo?: File | null;
}

class InvitationService {
  async createInvitation(payload: CreateInvitationPayload): Promise<Invitation> {
    return apiService.post<Invitation>('/collectif/invitations', payload);
  }

  async getInvitations(): Promise<Invitation[]> {
    return apiService.get<Invitation[]>('/collectif/invitations');
  }

  async revokeInvitation(id: number): Promise<Invitation> {
    return apiService.delete<Invitation>(`/collectif/invitations/${id}`);
  }

  async getInvitationByToken(token: string): Promise<InvitationPublicInfo> {
    return apiService.get<InvitationPublicInfo>(`/api/invitations/${token}`);
  }

  async acceptInvitation(token: string, data: AcceptInvitationData): Promise<any> {
    const formData = new FormData();
    formData.append('nomMembre', data.nomMembre);
    formData.append('prenomMembre', data.prenomMembre);
    formData.append('pseudoMembre', data.pseudoMembre);
    formData.append('emailMembre', data.emailMembre);
    formData.append('dateNaissance', data.dateNaissance);
    formData.append('adresse', data.adresse);
    if (data.photo) {
      formData.append('photo', data.photo);
    }

    const response = await fetch(`${API_BASE_URL}/api/invitations/${token}/accept`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'inscription');
    }

    return response.json();
  }
}

export const invitationService = new InvitationService();
