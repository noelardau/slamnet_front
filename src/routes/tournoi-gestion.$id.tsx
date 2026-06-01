import { useNavigate, useParams } from 'react-router-dom';
import { useTournoiStore } from '../stores/tournoiStore';
import { useEffect,useState } from 'react';
import { Loader2, Users, Mic, Trophy, ArrowLeft, Plus, User, Trash2, Medal, Award, Menu, X } from 'lucide-react';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function TournoiGestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tournois } = useTournoiStore();
  const [activeTab, setActiveTab] = useState<'participants' | 'performances' | 'classement'>('participants');
  const [isLoading, setIsLoading] = useState(true);
  const [tournoi, setTournoi] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [participants, setParticipants] = useState<any[]>([
    { id: 1, nom: 'Koumba Diop', pseudo: 'K. D.', collectif: 'Parole Libre', statut: 'inscrit', photo: 'https://images.unsplash.com/photo-1535713875002-b1e0f1b4a991?w=150&h=150&fit=crop' },
    { id: 2, nom: 'Lucas Martin', pseudo: 'L. M.', collectif: 'Le Verbe Urbain', statut: 'inscrit', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2?w=150&h=150&fit=crop' },
    { id: 3, nom: 'Amélie Rousseau', pseudo: 'A. R.', collectif: 'Invité', statut: 'invité', photo: 'https://images.unsplash.com/photo-1494790108377-e9e69c862f4?w=150&h=150&fit=crop' },
  ]);
  const [performances, setPerformances] = useState<any[]>([
    { id: 1, participant: 'Koumba Diop', round: 1, ordre: 1, statut: 'terminé', photo: 'https://images.unsplash.com/photo-1535713875002-b1e0f1b4a991?w=150&h=150&fit=crop' },
    { id: 2, participant: 'Lucas Martin', round: 1, ordre: 2, statut: 'en_cours', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2?w=150&h=150&fit=crop' },
    { id: 3, participant: 'Amélie Rousseau', round: 1, ordre: 3, statut: 'à_venir', photo: 'https://images.unsplash.com/photo-1494790108377-e9e69c862f4?w=150&h=150&fit=crop' },
  ]);
  const [classement, setClassement] = useState<any[]>([
    { id: 1, nom: 'Koumba Diop', pseudo: 'K. D.', total: 27.6, round1: 9.2, round2: 9.4, round3: 9.0, photo: 'https://images.unsplash.com/photo-1535713875002-b1e0f1b4a991?w=150&h=150&fit=crop' },
    { id: 2, nom: 'Lucas Martin', pseudo: 'L. M.', total: 25.8, round1: 8.8, round2: 8.5, round3: 8.5, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2?w=150&h=150&fit=crop' },
    { id: 3, nom: 'Amélie Rousseau', pseudo: 'A. R.', total: 24.3, round1: 8.1, round2: 8.2, round3: 8.0, photo: 'https://images.unsplash.com/photo-1494790108377-e9e69c862f4?w=150&h=150&fit=crop' },
  ]);

  useEffect(() => {
    const foundTournoi = tournois.find(t => t.idTournoi === Number(id));
    if (foundTournoi) {
      setTournoi(foundTournoi);
    }
    setIsLoading(false);
  }, [id, tournois]);

  const tabs = [
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'performances', label: 'Performances', icon: Mic },
    { id: 'classement', label: 'Classement', icon: Trophy },
  ] as const;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleDeleteClick = (participant: any) => {
    setParticipantToDelete(participant);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    setParticipants(participants.filter(p => p.id !== participantToDelete.id));
    setShowDeleteDialog(false);
    setParticipantToDelete(null);
  };

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy size={24} className="text-yellow-500" />;
      case 2: return <Medal size={24} className="text-gray-400" />;
      case 3: return <Award size={24} className="text-amber-600" />;
      default: return <span className="text-muted-foreground font-bold text-xl">{position}</span>;
    }
  };

  const getScoreColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-foreground';
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'terminé': return 'bg-green-500/20 text-green-500';
      case 'en_cours': return 'bg-primary/20 text-primary';
      case 'à_venir': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'terminé': return 'Terminé';
      case 'en_cours': return 'En cours';
      case 'à_venir': return 'À venir';
      default: return statut;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">Chargement du tournoi...</p>
        </div>
      </div>
    );
  }

  if (!tournoi) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Tournoi non trouvé</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-6 pt-4 pb-8">
       

        <div className="flex items-center justify-between mb-8 mt-16 ">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-px bg-primary" />
                <span
                  className="text-primary"
                  style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.2em" }}
                >
                  TOURNOI
                </span>
              </div>
              <h1
                className="text-foreground"
                style={{
                  fontFamily: "Anton, sans-serif",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  lineHeight: 0.95,
                }}
              >
                {tournoi.nomTournoi}
              </h1>
            </div>
            {tournoi.afficheTournoi && (
              <img
                src={tournoi.afficheTournoi}
                alt={tournoi.nomTournoi}
                className="w-20 h-28 object-cover rounded-lg"
              />
            )}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-foreground p-2"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="flex gap-6">
          <aside className="hidden md:block w-64 flex-shrink-0 mt-8">
            <nav className="sticky top-8 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-card hover:text-foreground'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <aside className="md:hidden fixed inset-0 z-50 bg-background lg:hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="text-foreground font-medium">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground p-2"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-card hover:text-foreground'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

           <aside className="md:hidden fixed inset-0 z-50 bg-background lg:hidden">
             <div className="p-4 border-b border-border flex items-center justify-between">
               <span className="text-foreground font-medium">Menu</span>
               <button
                 onClick={() => setMobileMenuOpen(false)}
                 className="text-foreground p-2"
               >
                 <X size={24} />
               </button>
             </div>
             <nav className="p-4 space-y-2">
               {tabs.map((tab) => {
                 const Icon = tab.icon;
                 return (
                   <button
                     key={tab.id}
                     onClick={() => {
                       setActiveTab(tab.id);
                       setMobileMenuOpen(false);
                     }}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                       activeTab === tab.id
                         ? 'bg-primary text-primary-foreground'
                         : 'text-muted-foreground hover:bg-card hover:text-foreground'
                     }`}
                   >
                     <Icon size={18} />
                     <span className="font-medium">{tab.label}</span>
                   </button>
                 );
               })}
             </nav>
           </aside>

           <main className="flex-1 mt-[-80px]">
            {activeTab === 'participants' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 
                    className="text-foreground"
                    style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
                  >
                    Participants
                  </h2>
                  <button
                    onClick={() => setShowAddDialog(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 text-sm flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Ajouter un participant
                  </button>
                </div>

                 <div className="space-y-3">
                  {participants.length === 0 ? (
                    <div className="text-center py-12 border border-border border-dashed">
                      <User className="mx-auto mb-4 text-muted-foreground" size={48} />
                      <p className="text-muted-foreground">Aucun participant pour le moment</p>
                    </div>
                  ) : (
                    participants.map((participant) => (
                      <div key={participant.id} className="border border-border bg-card p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-border flex items-center justify-center flex-shrink-0">
                            {participant.photo ? (
                              <img
                                src={participant.photo}
                                alt={participant.pseudo}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="text-muted-foreground" size={20} />
                            )}
                          </div>
                          <div>
                            <h3 className="text-foreground font-medium">@{participant.pseudo}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{participant.collectif}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                participant.statut === 'inscrit' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'
                              }`}>
                                {participant.statut}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(participant)}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-8 p-6 bg-card border border-border">
                  <h3 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem" }}>
                    Informations du tournoi
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-muted-foreground text-sm mb-1">Date</div>
                      <div className="text-foreground font-medium">{formatDate(tournoi.dateTournoi)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm mb-1">Heure</div>
                      <div className="text-foreground font-medium">{tournoi.heureTournoi}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm mb-1">Lieu</div>
                      <div className="text-foreground font-medium">{tournoi.LieuTournoi}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm mb-1">Jurés</div>
                      <div className="text-foreground font-medium">{tournoi.nbJury} juré{tournoi.nbJury > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'performances' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 
                    className="text-foreground"
                    style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
                  >
                    Performances
                  </h2>
                  <button
                    onClick={() => setShowAddDialog(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 text-sm flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Ajouter une performance
                  </button>
                </div>

                <div className="space-y-4">
                  {performances.length === 0 ? (
                    <div className="text-center py-12 border border-border border-dashed">
                      <Mic className="mx-auto mb-4 text-muted-foreground" size={48} />
                      <p className="text-muted-foreground">Aucune performance pour le moment</p>
                    </div>
                   ) : (
                    performances.map((performance) => (
                      <div key={performance.id} className="border border-border bg-card p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-border flex items-center justify-center flex-shrink-0">
                            {performance.photo ? (
                              <img
                                src={performance.photo}
                                alt={performance.participant}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Mic className="text-muted-foreground" size={20} />
                            )}
                          </div>
                          <div>
                            <h3 className="text-foreground font-medium">@{performance.participant}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>Round {performance.round}</span>
                              <span>·</span>
                              <span>Ordre {performance.ordre}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(performance.statut)}`}>
                          {getStatusLabel(performance.statut)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-8 p-6 bg-card border border-border">
                  <h3 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem" }}>
                    Actions rapides
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="border border-border p-4 hover:border-primary/60 transition-colors text-left">
                      <div className="text-foreground font-medium mb-1">Tirage au sort</div>
                      <div className="text-muted-foreground text-sm">Générer l'ordre de passage</div>
                    </button>
                    <button className="border border-border p-4 hover:border-primary/60 transition-colors text-left">
                      <div className="text-foreground font-medium mb-1">Exporter liste</div>
                      <div className="text-muted-foreground text-sm">Télécharger en PDF</div>
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'classement' && (
              <>
                <h2 
                  className="text-foreground mb-6"
                  style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
                >
                  Classement
                </h2>

                <div className="space-y-3">
                  {classement.length === 0 ? (
                    <div className="text-center py-12 border border-border border-dashed">
                      <Trophy className="mx-auto mb-4 text-muted-foreground" size={48} />
                      <p className="text-muted-foreground">Aucun classement pour le moment</p>
                    </div>
                   ) : (
                    classement.map((participant) => (
                      <div key={participant.id} className={`border border-border bg-card p-6 flex items-center justify-between ${participant.id <= 3 ? 'border-primary/30' : ''}`}>
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-border flex items-center justify-center flex-shrink-0">
                            {participant.photo ? (
                              <img
                                src={participant.photo}
                                alt={participant.pseudo}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="text-muted-foreground" size={20} />
                            )}
                          </div>
                          <div>
                            <h3 className="text-foreground font-medium text-lg">@{participant.pseudo}</h3>
                            <div className="text-muted-foreground text-sm">{participant.collectif}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getScoreColor(participant.id)}`} style={{ fontFamily: "Anton, sans-serif" }}>
                            {participant.total}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            R1: {participant.round1} · R2: {participant.round2} · R3: {participant.round3}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-8 p-6 bg-card border border-border">
                  <h3 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem" }}>
                    Résumé
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-muted-foreground text-sm mb-1">Participants</div>
                      <div className="text-2xl font-bold text-foreground">{classement.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm mb-1">Moyenne</div>
                      <div className="text-2xl font-bold text-foreground">
                        {(classement.reduce((sum, p) => sum + p.total, 0) / classement.length).toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm mb-1">Rounds</div>
                      <div className="text-2xl font-bold text-foreground">3</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Retirer le participant"
        message="Êtes-vous sûr de vouloir retirer ce participant du tournoi ?"
        confirmText="Retirer"
        cancelText="Annuler"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setParticipantToDelete(null);
        }}
      />
    </div>
  );
}