import { useEffect, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useTournamentInvitationStore } from '../stores/tournamentInvitationStore';
import { ConfirmDialog } from './ConfirmDialog';
import {
  Loader2,
  Copy,
  Check,
  Ban,
  Link as LinkIcon,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { TournamentInvitation } from '../services/tournamentInvitationService';

interface TournamentInvitationsSectionProps {
  tournamentId: number;
}

export function TournamentInvitationsSection({ tournamentId }: TournamentInvitationsSectionProps) {
  const { invitations, isLoading, hydrateInvitations, revokeInvitation } =
    useTournamentInvitationStore();
  const { showSuccess, showError } = useToast();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<TournamentInvitation | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  useEffect(() => {
    hydrateInvitations(tournamentId).catch(() => {
      // erreurs déjà gérées dans le store
    });
  }, [hydrateInvitations, tournamentId]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const handleCopy = async (invitation: TournamentInvitation) => {
    const link = `${window.location.origin}/tournoi-invitation/${invitation.token}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedToken(invitation.token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      console.error('Erreur copie:', error);
      showError('Impossible de copier le lien');
    }
  };

  const handleRevokeConfirm = async () => {
    if (!revokeTarget) return;
    setIsRevoking(true);
    try {
      await revokeInvitation(tournamentId, revokeTarget.idTournamentInvitation);
      showSuccess('Invitation révoquée');
      setRevokeTarget(null);
    } catch (error) {
      console.error('Erreur révocation:', error);
      showError('Erreur lors de la révocation');
    } finally {
      setIsRevoking(false);
    }
  };

  const isExpired = (inv: TournamentInvitation) => {
    return (
      inv.statut === 'EXPIRE' ||
      inv.statut === 'REVOQUE' ||
      new Date(inv.expireLe) < new Date()
    );
  };

  if (isLoading && invitations.length === 0) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="animate-spin text-primary" size={20} />
      </div>
    );
  }

  if (invitations.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <LinkIcon size={16} className="text-primary" />
        <h3
          className="text-foreground"
          style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.1rem' }}
        >
          Liens d'inscription publics
        </h3>
      </div>

      <div className="border border-border">
        {invitations.map((invitation, index) => {
          const expired = isExpired(invitation);
          const truncatedToken = `${invitation.token.slice(0, 6)}…${invitation.token.slice(-4)}`;
          return (
            <div
              key={invitation.idTournamentInvitation}
              className={`flex items-center justify-between p-3 ${
                index !== invitations.length - 1 ? 'border-b border-border' : ''
              } ${expired ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <code
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {truncatedToken}
                    </code>
                    {invitation.statut === 'REVOQUE' && (
                      <span className="text-xs px-2 py-0.5 bg-destructive/20 text-destructive">
                        Révoquée
                      </span>
                    )}
                    {invitation.statut === 'EXPIRE' && (
                      <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground">
                        Expirée
                      </span>
                    )}
                    {invitation.statut === 'ACTIF' && !expired && (
                      <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary">Active</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Expire le {formatDate(invitation.expireLe)}</span>
                    <span className="flex items-center gap-1">
                      {invitation.maxUsages === null ? (
                        <>
                          <InfinityIcon size={12} />
                          {invitation.usagesCount} / ∞
                        </>
                      ) : (
                        <>
                          {invitation.usagesCount} / {invitation.maxUsages}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {!expired && (
                  <>
                    <button
                      onClick={() => handleCopy(invitation)}
                      className="p-2 hover:bg-primary/10 rounded transition-colors"
                      title="Copier le lien"
                      aria-label="Copier le lien"
                    >
                      {copiedToken === invitation.token ? (
                        <Check size={16} className="text-primary" />
                      ) : (
                        <Copy size={16} className="text-muted-foreground hover:text-primary" />
                      )}
                    </button>
                    <button
                      onClick={() => setRevokeTarget(invitation)}
                      className="p-2 hover:bg-destructive/10 rounded transition-colors"
                      title="Révoquer"
                      aria-label="Révoquer"
                    >
                      <Ban size={16} className="text-muted-foreground hover:text-destructive" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={!!revokeTarget}
        title="Révoquer le lien d'inscription"
        message="Ce lien deviendra inutilisable. Action irréversible."
        confirmText="Révoquer"
        cancelText="Annuler"
        onConfirm={handleRevokeConfirm}
        onCancel={() => setRevokeTarget(null)}
        loading={isRevoking}
      />
    </div>
  );
}
