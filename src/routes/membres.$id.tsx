import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useStatisticsStore } from '../stores/statisticsStore';
import { useMembreStore } from '../stores/membreStore';
import { GlobalStatsChart } from '../app/components/charts/GlobalStatsChart';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, BarChart3, TrendingUp, Award, Target, 
  ArrowLeft, Calendar, User, Mail, Loader2
} from 'lucide-react';
import { Button } from '../app/components/ui/button';

export default function MembreDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const memberId = Number(id);
  const { isAuthenticated } = useAuth();
  
  const { membre, hydrateMembre, isLoading: membreLoading } = useMembreStore();
  const { 
    memberGlobalStats, 
    isLoading: statsLoading,
    hydrateMemberGlobalStats 
  } = useStatisticsStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/membres');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (memberId && isAuthenticated) {
      hydrateMembre(memberId);
      hydrateMemberGlobalStats(memberId);
    }
  }, [memberId, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  if (membreLoading || !membre) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
        <p className="text-muted-foreground ml-3">{t('statistics.memberProfile.loading')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Navigation */}
      <Link 
        to="/membres"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        {t('statistics.memberProfile.backToMembers')}
      </Link>

      {/* Header Membre */}
      <div className="flex items-start gap-6 mb-8">
        {membre.photoMembre ? (
          <img
            src={membre.photoMembre}
            alt={membre.pseudoMembre}
            className="w-24 h-24 rounded-full object-cover border-4 border-border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-border flex items-center justify-center border-4 border-border">
            <User size={48} className="text-muted-foreground" />
          </div>
        )}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {membre.prenomMembre} {membre.nomMembre}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-2">
              <User size={16} />
              @{membre.pseudoMembre}
            </span>
            {membre.emailMembre && (
              <span className="flex items-center gap-2">
                <Mail size={16} />
                {membre.emailMembre}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section Statistiques Globales */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <BarChart3 size={28} />
          {t('statistics.title')}
        </h2>
        
        {statsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : memberGlobalStats && memberGlobalStats.tournoisPerformances.length > 0 ? (
          <>
            {/* Stats générales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-6 bg-card border border-border rounded-lg">
                <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Trophy size={16} />
                  {t('statistics.globalStats.tournaments')}
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {memberGlobalStats.nombreTournois}
                </div>
              </div>
              <div className="p-6 bg-card border border-border rounded-lg">
                <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <BarChart3 size={16} />
                  {t('statistics.globalStats.performances')}
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {memberGlobalStats.nombrePerformancesTotal}
                </div>
              </div>
              <div className="p-6 bg-card border border-border rounded-lg">
                <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <TrendingUp size={16} />
                  {t('statistics.globalStats.totalPoints')}
                </div>
                <div className="text-3xl font-bold text-primary">
                  {memberGlobalStats.totalPointsAccumules}
                </div>
              </div>
              <div className="p-6 bg-card border border-border rounded-lg">
                <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Award size={16} />
                  {t('statistics.globalStats.globalAverage')}
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {memberGlobalStats.moyennePointsGlobal}
                </div>
              </div>
            </div>

            {/* Stats additionnelles */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  {t('statistics.globalStats.bestPerformance')}
                </div>
                <div className="text-2xl font-bold text-green-500">
                  {memberGlobalStats.meilleurePerformanceGlobale || '-'}
                </div>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  {t('statistics.globalStats.worstPerformance')}
                </div>
                <div className="text-2xl font-bold text-red-500">
                  {memberGlobalStats.pirePerformanceGlobale || '-'}
                </div>
              </div>
            </div>

            {/* Graphiques */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target size={20} />
                {t('statistics.globalStats.analysis')}
              </h3>
              <GlobalStatsChart stats={memberGlobalStats} />
            </div>

            {/* Historique par tournoi */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {t('statistics.globalStats.performanceHistory')}
              </h3>
              <div className="space-y-3">
                {memberGlobalStats.tournoisPerformances.map(tournoi => (
                  <div 
                    key={tournoi.idTournoi}
                    className="p-4 bg-card border border-border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {tournoi.nomTournoi}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar size={14} />
                          {new Date(tournoi.dateTournoi).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-primary">
                          {tournoi.moyennePoints}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t('statistics.globalStats.average')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <BarChart3 size={14} />
                        {tournoi.nombrePerformances} {t('statistics.globalStats.performances')}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp size={14} />
                        {t('statistics.globalStats.total')}: {tournoi.totalPoints}
                      </span>
                      {tournoi.meilleurePerformance && (
                        <span className="text-green-500 flex items-center gap-1">
                          <Award size={14} />
                          {t('statistics.globalStats.best')}: {tournoi.meilleurePerformance}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-lg">
            <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
            <p>{t('statistics.globalStats.noTournaments')}</p>
          </div>
        )}
      </div>
    </div>
  );
}