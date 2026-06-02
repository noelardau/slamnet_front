import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Loader2, UserPlus, Search, User, UserCheck, CheckCircle2 } from 'lucide-react';

interface AddParticipantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onParticipantAdded: () => void;
  tournamentId: number;
}

interface ParticipantRecord {
  idParticipant: number;
  idMembre: number | null;
  idGuest: number | null;
}

export function AddParticipantDialog({ isOpen, onClose, onParticipantAdded, tournamentId }: AddParticipantDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMembres, setIsLoadingMembres] = useState(false);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const { showSuccess, showError } = useToast();
  const [mode, setMode] = useState<'select' | 'guest'>('select');
  const [searchTerm, setSearchTerm] = useState('');
  const [membres, setMembres] = useState<any[]>([]);
  const [selectedMembreId, setSelectedMembreId] = useState<number | null>(null);
  const [inscribedMemberIds, setInscribedMemberIds] = useState<Set<number>>(new Set());
  const [guestFormData, setGuestFormData] = useState({
    pseudo: '',
  });

  useEffect(() => {
    if (isOpen && mode === 'select') {
      loadMembres();
      loadParticipants();
    }
  }, [isOpen, mode, tournamentId]);

  const loadMembres = async () => {
    setIsLoadingMembres(true);
    try {
      const { membreService } = await import('../services/membreService');
      const membresData = await membreService.getMembres();
      setMembres(membresData);
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
      showError('Erreur lors du chargement des membres');
    } finally {
      setIsLoadingMembres(false);
    }
  };

  const loadParticipants = async () => {
    setIsLoadingParticipants(true);
    try {
      const { participantService } = await import('../services/participantService');
      const participants = await participantService.getTournamentParticipants(tournamentId);
      const memberIds = new Set(
        participants
          .filter(p => p.idMembre !== null)
          .map(p => p.idMembre as number)
      );
      setInscribedMemberIds(memberIds);
    } catch (error) {
      console.error('Erreur lors du chargement des participants:', error);
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  const handleSubmitMember = async () => {
    if (!selectedMembreId) {
      showError('Veuillez sélectionner un membre');
      return;
    }

    if (inscribedMemberIds.has(selectedMembreId)) {
      showError('Ce membre est déjà inscrit au tournoi');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { participantService } = await import('../services/participantService');
      await participantService.addParticipantToTournament(tournamentId, selectedMembreId);
      
      // Marquer le membre comme inscrit
      setInscribedMemberIds(prev => new Set([...prev, selectedMembreId]));
      
      showSuccess('Membre inscrit au tournoi avec succès');
      setSelectedMembreId(null);
      onParticipantAdded();
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      showError('Erreur lors de l\'inscription au tournoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestFormData.pseudo.trim()) {
      showError('Le pseudo est requis');
      return;
    }

    setIsSubmitting(true);
    try {
      const { participantService } = await import('../services/participantService');
      await participantService.addGuestToTournament(tournamentId, { pseudo: guestFormData.pseudo.trim() });
      showSuccess('Invité inscrit au tournoi avec succès');
      resetForm();
      onParticipantAdded();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'inscription de l\'invité:', error);
      showError('Erreur lors de l\'inscription de l\'invité');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSearchTerm('');
    setSelectedMembreId(null);
    setGuestFormData({
      pseudo: '',
    });
    setMode('select');
    setInscribedMemberIds(new Set());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const filteredMembres = membres.filter(membre => 
    membre.nomMembre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membre.prenomMembre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membre.pseudoMembre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inscribedCount = inscribedMemberIds.size;
  const totalCount = membres.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={isSubmitting ? undefined : handleClose} />
      <div className="relative bg-card border border-border w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        <div className="p-4 sm:p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h2 
                className="text-foreground truncate"
                style={{ fontFamily: "Anton, sans-serif", fontSize: "1.5rem sm:1.8rem" }}
              >
                Ajouter des participants
              </h2>
              {mode === 'select' && inscribedCount > 0 && (
                <p className="text-sm text-primary mt-1">
                  {inscribedCount} membre{inscribedCount > 1 ? 's' : ''} inscrit{inscribedCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed p-1 ml-4 flex-shrink-0"
            >
              ×
            </button>
          </div>

          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setMode('select')}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                mode === 'select'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User size={16} />
              <span className="hidden sm:inline">Membre du collectif</span>
              <span className="sm:hidden">Membres</span>
            </button>
            <button
              onClick={() => setMode('guest')}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                mode === 'guest'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <UserPlus size={16} />
              Invité
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {mode === 'select' ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher un membre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoadingMembres || isSubmitting}
                />
              </div>

              {isLoadingMembres || isLoadingParticipants ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-muted-foreground" size={32} />
                </div>
              ) : filteredMembres.length === 0 ? (
                <div className="text-center py-12 border border-border border-dashed rounded-lg">
                  <User className="mx-auto mb-4 text-muted-foreground" size={48} />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Aucun membre trouvé' : 'Aucun membre disponible'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>{filteredMembres.length} membre{filteredMembres.length > 1 ? 's' : ''}</span>
                    {inscribedCount > 0 && (
                      <span className="text-primary">
                        {inscribedCount} inscrit{inscribedCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredMembres.map((membre) => {
                      const isInscribed = inscribedMemberIds.has(membre.idMembre);
                      const isSelected = selectedMembreId === membre.idMembre;
                      
                      return (
                        <button
                          key={membre.idMembre}
                          onClick={() => !isInscribed && setSelectedMembreId(membre.idMembre)}
                          disabled={isSubmitting || isInscribed}
                          className={`w-full p-3 border rounded-lg transition-all flex items-center gap-3 ${
                            isInscribed
                              ? 'border-primary/30 bg-primary/5 opacity-75 cursor-not-allowed'
                              : isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50 hover:bg-accent'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {membre.photoMembre ? (
                              <img
                                src={membre.photoMembre}
                                alt={membre.pseudoMembre}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <User size={20} className="text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {membre.nomMembre} {membre.prenomMembre}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              @{membre.pseudoMembre}
                            </div>
                          </div>
                          {isInscribed ? (
                            <div className="flex items-center gap-1 text-primary flex-shrink-0">
                              <CheckCircle2 size={16} />
                              <span className="text-xs font-medium">Inscrit</span>
                            </div>
                          ) : isSelected ? (
                            <UserCheck className="text-primary flex-shrink-0" size={20} />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmitGuest} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Pseudo *</label>
                <input
                  type="text"
                  required
                  value={guestFormData.pseudo}
                  onChange={(e) => setGuestFormData({ ...guestFormData, pseudo: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                  placeholder="Entrez le pseudo de l'invité"
                />
              </div>
            </form>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t border-border flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-border hover:border-primary/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'select' && inscribedCount > 0 ? 'Terminer' : 'Annuler'}
            </button>
            {mode === 'select' ? (
              <button
                onClick={handleSubmitMember}
                disabled={isSubmitting || !selectedMembreId}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ letterSpacing: "0.06em" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Inscription...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Inscrire
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSubmitGuest}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ letterSpacing: "0.06em" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Inscription...
                  </>
                ) : (
                  'Inscrire'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}