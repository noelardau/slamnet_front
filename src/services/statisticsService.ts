import { apiService } from './api';

export interface NoteObjet {
  valeur: number;
  retenu: boolean;
}

export interface PerformanceDetailed {
  idPerfo: number;
  noteFinale: number | null;
  duree: string;
  etat: string;
  notes: NoteObjet[];
  penalites: number[];
  nombreNotesTotal: number;
  nombreNotesRetenues: number;
  nombrePenalites: number;
}

export interface ParticipantTournamentStats {
  participantId: number;
  participantName: string;
  participantPhoto?: string;
  participantType: 'membre' | 'guest';
  participantPseudo?: string;
  nombrePerformances: number;
  totalPoints: number;
  moyennePoints: number;
  meilleurePerformance?: number;
  pirePerformance?: number;
  performances: PerformanceDetailed[];
  totalNotesDonnees: number;
  moyenneNotesMoyenne: number;
  totalPenalites: number;
  nombrePerformancesAvecPenalites: number;
}

export interface AllParticipantsTournamentStatsResponse {
  tournoiId: number;
  tournoiNom: string;
  participantsStats: ParticipantTournamentStats[];
  dateCalcul: string;
}

export interface TournamentPerformanceSummary {
  idTournoi: number;
  nomTournoi: string;
  dateTournoi: string;
  nombrePerformances: number;
  totalPoints: number;
  moyennePoints: number;
  meilleurePerformance?: number;
  pirePerformance?: number;
}

export interface MemberGlobalStats {
  memberId: number;
  memberName: string;
  memberPseudo: string;
  memberPhoto?: string;
  nombreTournois: number;
  nombrePerformancesTotal: number;
  totalPointsAccumules: number;
  moyennePointsGlobal: number;
  meilleurePerformanceGlobale?: number;
  pirePerformanceGlobale?: number;
  tournoisPerformances: TournamentPerformanceSummary[];
  progressionMoyennes: number[];
  ecartTypePoints: number;
  tauxConsistance: number;
}

class StatisticsService {
  async getAllParticipantsTournamentStats(tournamentId: number): Promise<AllParticipantsTournamentStatsResponse> {
    try {
      const stats = await apiService.get<AllParticipantsTournamentStatsResponse>(
        `/api/tournois/${tournamentId}/statistiques/participants`
      );
      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  async getMemberGlobalStats(memberId: number): Promise<MemberGlobalStats> {
    try {
      const stats = await apiService.get<MemberGlobalStats>(
        `/api/membres/${memberId}/statistiques`
      );
      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques globales:', error);
      throw error;
    }
  }
}

export const statisticsService = new StatisticsService();