import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useTournamentInvitationStore } from '../stores/tournamentInvitationStore';
import { X, Loader2, Copy, Check, Link as LinkIcon } from 'lucide-react';
import { TournamentInvitation } from '../services/tournamentInvitationService';

interface CreateTournamentInvitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: number;
}

export function CreateTournamentInvitationDialog({
  isOpen,
  onClose,
  tournamentId,
}: CreateTournamentInvitationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdInvitation, setCreatedInvitation] = useState<TournamentInvitation | null>(null);
  const [copied, setCopied] = useState(false);
  const [dureeJours, setDureeJours] = useState<number>(7);
  const [maxUsagesEnabled, setMaxUsagesEnabled] = useState(false);
  const [maxUsages, setMaxUsages] = useState<number>(20);
  const { showSuccess, showError } = useToast();
  const { createInvitation } = useTournamentInvitationStore();

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      const invitation = await createInvitation(tournamentId, {
        dureeJours,
        maxUsages: maxUsagesEnabled ? maxUsages : null,
      });
      setCreatedInvitation(invitation);
      showSuccess('Lien d\'inscription créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de l\'invitation:', error);
      showError(error instanceof Error ? error.message : 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const invitationLink = createdInvitation
    ? `${window.location.origin}/tournoi-invitation/${createdInvitation.token}`
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erreur copie:', error);
      showError('Impossible de copier le lien');
    }
  };

  const handleClose = () => {
    setCreatedInvitation(null);
    setCopied(false);
    setDureeJours(7);
    setMaxUsagesEnabled(false);
    setMaxUsages(20);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isSubmitting ? undefined : handleClose}
      />
      <div className="relative bg-card border border-border w-full max-w-md max-h-[90vh] flex flex-col shadow-xl">
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2
              className="text-foreground"
              style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.8rem' }}
            >
              Lien d'inscription public
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {createdInvitation ? (
            <div className="space-y-5">
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <LinkIcon className="text-primary" size={28} />
                </div>
                <p
                  className="text-foreground mb-2"
                  style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.2rem' }}
                >
                  Lien d'inscription prêt !
                </p>
                <p className="text-muted-foreground text-sm">
                  Partagez ce lien aux slameurs qui veulent participer au tournoi.
                </p>
              </div>

              <div className="bg-background border border-border p-4">
                <div className="flex items-center justify-between gap-2">
                  <code
                    className="text-xs text-muted-foreground truncate flex-1"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {invitationLink}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs whitespace-nowrap"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Copié
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copier
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  Expire le :{' '}
                  {new Date(createdInvitation.expireLe).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p>
                  Usages : {createdInvitation.usagesCount}
                  {createdInvitation.maxUsages !== null
                    ? ` / ${createdInvitation.maxUsages}`
                    : ' / ∞'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Durée de validité</label>
                <select
                  value={dureeJours}
                  onChange={(e) => setDureeJours(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                >
                  <option value={1}>1 jour</option>
                  <option value={7}>7 jours (défaut)</option>
                  <option value={30}>30 jours</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maxUsagesEnabled}
                    onChange={(e) => setMaxUsagesEnabled(e.target.checked)}
                    className="w-4 h-4"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm font-medium">
                    Limiter le nombre de participants
                  </span>
                </label>
                {maxUsagesEnabled && (
                  <div className="mt-3">
                    <input
                      type="number"
                      min={1}
                      value={maxUsages}
                      onChange={(e) => setMaxUsages(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isSubmitting}
                      placeholder="Nombre maximum d'inscriptions"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Le lien sera désactivé après {maxUsages} inscription
                      {maxUsages > 1 ? 's' : ''}.
                    </p>
                  </div>
                )}
                {!maxUsagesEnabled && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Sans limite, le lien permettra un nombre illimité d'inscriptions.
                  </p>
                )}
              </div>

              <div className="bg-primary/5 border border-primary/20 p-4 text-xs text-muted-foreground">
                <p>
                  Le lien permettra à un slameur de s'inscrire au tournoi soit avec son code
                  membre (s'il appartient à votre collectif), soit en tant que guest avec un pseudo.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border flex-shrink-0">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-border hover:border-primary/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createdInvitation ? 'Fermer' : 'Annuler'}
            </button>
            {!createdInvitation && (
              <button
                onClick={handleCreate}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ letterSpacing: '0.06em' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Création...
                  </>
                ) : (
                  'Générer le lien'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
