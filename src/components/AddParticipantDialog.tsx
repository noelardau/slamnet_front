import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Loader2, UserPlus, Search, User, UserCheck } from 'lucide-react';

interface AddParticipantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onParticipantAdded: () => void;
  tournamentId: number;
}

export function AddParticipantDialog({ isOpen, onClose, onParticipantAdded, tournamentId }: AddParticipantDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMembres, setIsLoadingMembres] = useState(false);
  const { showSuccess, showError } = useToast();
  const [mode, setMode] = useState<'select' | 'guest'>('select');
  const [searchTerm, setSearchTerm] = useState('');
  const [membres, setMembres] = useState<any[]>([]);
  const [selectedMembreId, setSelectedMembreId] = useState<number | null>(null);
  const [guestFormData, setGuestFormData] = useState({
    nomGuest: '',
    prenomGuest: '',
    emailGuest: '',
    telephone: '',
  });

  useEffect(() => {
    if (isOpen && mode === 'select') {
      loadMembres();
    }
  }, [isOpen, mode]);

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

  const handleSubmitMember = async () => {
    if (!selectedMembreId) {
      showError('Veuillez sélectionner un membre');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { participantService } = await import('../services/participantService');
      await participantService.addParticipantToTournament(tournamentId);
      showSuccess('Membre inscrit au tournoi avec succès');
      onParticipantAdded();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      showError('Erreur lors de l\'inscription au tournoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { participantService } = await import('../services/participantService');
      await participantService.addGuestToTournament(tournamentId, guestFormData);
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
      nomGuest: '',
      prenomGuest: '',
      emailGuest: '',
      telephone: '',
    });
    setMode('select');
  };

  const filteredMembres = membres.filter(membre => 
    membre.nomMembre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membre.prenomMembre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membre.pseudoMembre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={isSubmitting ? undefined : onClose} />
      <div className="relative bg-card border border-border w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        <div className="p-4 sm:p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.5rem sm:1.8rem" }}
            >
              Ajouter un participant
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed p-1"
            >
              ×
            </button>
          </div>

          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setMode('select')}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                mode === 'select'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User size={16} />
              Membre du collectif
            </button>
            <button
              onClick={() => setMode('guest')}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
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

              {isLoadingMembres ? (
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
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredMembres.map((membre) => (
                    <button
                      key={membre.idMembre}
                      onClick={() => setSelectedMembreId(membre.idMembre)}
                      disabled={isSubmitting}
                      className={`w-full p-3 border rounded-lg transition-all flex items-center gap-3 ${
                        selectedMembreId === membre.idMembre
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-accent'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center flex-shrink-0">
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
                      {selectedMembreId === membre.idMembre && (
                        <UserCheck className="text-primary flex-shrink-0" size={20} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmitGuest} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom *</label>
                  <input
                    type="text"
                    required
                    value={guestFormData.nomGuest}
                    onChange={(e) => setGuestFormData({ ...guestFormData, nomGuest: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={guestFormData.prenomGuest}
                    onChange={(e) => setGuestFormData({ ...guestFormData, prenomGuest: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={guestFormData.emailGuest}
                  onChange={(e) => setGuestFormData({ ...guestFormData, emailGuest: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={guestFormData.telephone}
                  onChange={(e) => setGuestFormData({ ...guestFormData, telephone: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                  placeholder="Optionnel"
                />
              </div>
            </form>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t border-border flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-border hover:border-primary/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              onClick={mode === 'select' ? handleSubmitMember : handleSubmitGuest}
              disabled={isSubmitting || (mode === 'select' && !selectedMembreId)}
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
          </div>
        </div>
      </div>
    </div>
  );
}