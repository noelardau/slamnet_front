import { useEffect, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useInvitationStore } from '../stores/invitationStore';
import { ConfirmDialog } from './ConfirmDialog';
import { Loader2, Copy, Check, Ban, Link as LinkIcon, Infinity as InfinityIcon } from 'lucide-react';
import { Invitation } from '../services/invitationService';

export function InvitationsSection() {
  const { invitations, isLoading, hydrateInvitations, revokeInvitation } = useInvitationStore();
  const { showSuccess, showError } = useToast();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<Invitation | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  useEffect(() => {
    hydrateInvitations().catch(() => {
      // erreurs déjà gérées dans le store
    });
  }, [hydrateInvitations]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleCopy = async (invitation: Invitation) => {
    const link = `${window.location.origin}/invitation/${invitation.token}`;
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
      await revokeInvitation(revokeTarget.idInvitation);
      showSuccess('Invitation révoquée');
      setRevokeTarget(null);
    } catch (error) {
      console.error('Erreur révocation:', error);
      showError('Erreur lors de la révocation');
    } finally {
      setIsRevoking(false);
    }
  };

  const isExpired = (inv: Invitation) => {
    return inv.statut === 'EXPIRE' || inv.statut === 'REVOQUE' || new Date(inv.expireLe) < new Date();
  };

  if (isLoading && invitations.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  if (invitations.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-px bg-primary" />
        <span
          className="text-primary"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.2em' }}
        >
          LIENS D'INVITATION
        </span>
      </div>

      <h2
        className="text-foreground mb-6"
        style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.6rem' }}
      >
        Invitations actives
      </h2>

      <div className="border border-border">
        {invitations.map((invitation, index) => {
          const expired = isExpired(invitation);
          const truncatedToken = `${invitation.token.slice(0, 6)}…${invitation.token.slice(-4)}`;
          return (
            <div
              key={invitation.idInvitation}
              className={`flex items-center justify-between p-4 ${index !== invitations.length - 1 ? 'border-b border-border' : ''} ${expired ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <LinkIcon size={18} className="text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <code
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {truncatedToken}
                    </code>
                    {invitation.statut === 'REVOQUE' && (
                      <span className="text-xs px-2 py-0.5 bg-destructive/20 text-destructive">Révoquée</span>
                    )}
                    {invitation.statut === 'EXPIRE' && (
                      <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground">Expirée</span>
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
                        <>{invitation.usagesCount} / {invitation.maxUsages}</>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
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
        title="Révoquer l'invitation"
        message="Cette action rendra le lien inutilisable. Elle est irréversible."
        confirmText="Révoquer"
        cancelText="Annuler"
        onConfirm={handleRevokeConfirm}
        onCancel={() => setRevokeTarget(null)}
        loading={isRevoking}
      />
    </div>
  );
}
