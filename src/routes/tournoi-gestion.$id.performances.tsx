import { useOutletContext } from 'react-router-dom';
import { Plus, Mic, Trash2, Loader2, Play, Pause, CheckCircle, Clock, AlertCircle, X, Send } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { usePerformanceStore } from '../stores/performanceStore';
import { useParticipantStore } from '../stores/participantStore';
import { useNoteStore } from '../stores/noteStore';
import { usePenaliteStore } from '../stores/penaliteStore';

type PerformanceState = 'prêt' | 'en_cours' | 'en_pause' | 'terminée';

type TabType = 'liste' | 'en_cours' | 'note';

export default function TournoiPerformances() {
  const { tournoi } = useOutletContext<any>();
  const { showSuccess, showError } = useToast();
  const { t } = useLanguage();
  const { participants, hydrateParticipants } = useParticipantStore();
  const { performances, isLoading, hydratePerformances, deletePerformance, createPerformance, updatePerformanceLocal, updatePerformance } = usePerformanceStore();
  const { notes, hydrateNotes, createBulkNotes, updateNote, clearNotes, isLoading: notesLoading } = useNoteStore();
  const { penalites, hydratePenalites, createBulkPenalites, clearPenalites } = usePenaliteStore();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [performanceToDelete, setPerformanceToDelete] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('liste');
  const [currentPerformance, setCurrentPerformance] = useState<any>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTerminating, setIsTerminating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [modalActiveTab, setModalActiveTab] = useState<'participant' | 'tirage'>('participant');
  const [noteInput, setNoteInput] = useState('');
  const [localNotes, setLocalNotes] = useState<{ id: string; valeur: number; retenu: boolean }[]>([]);
  const [localPenalites, setLocalPenalites] = useState<{ id: string; valeur: number }[]>([]);
  const [inputType, setInputType] = useState<'note' | 'penalite'>('note');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (tournoi?.idTournoi) {
      loadPerformances();
      loadParticipants();
    }
  }, [tournoi?.idTournoi]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const loadPerformances = async () => {
    try {
      await hydratePerformances(tournoi.idTournoi);
    } catch (error) {
      showError(t('tournoiPerformances.loadingPerformances'));
    }
  };

  const loadParticipants = async () => {
    try {
      await hydrateParticipants(tournoi.idTournoi);
    } catch (error) {
      showError(t('tournoiPerformances.loadingParticipants'));
    }
  };

  const handleCreatePerformance = async () => {
    if (!selectedParticipantId) {
      showError(t('tournoiPerformances.selectParticipant'));
      return;
    }

    const participant = participants.find(p => p.idParticipant === selectedParticipantId);
    if (!participant) {
      showError(t('tournoiPerformances.participantNotFound'));
      return;
    }

    setIsCreating(true);
    try {
      const createData: any = {
        idTournoi: tournoi.idTournoi,
        idParticipant: participant.idParticipant,
        etat: 'prêt',
        duree: '00:00',
      };

      if (participant.idMembre) {
        createData.idMembre = participant.idMembre;
      } else if (participant.idGuest) {
        createData.idGuest = participant.idGuest;
      }

      await createPerformance(createData);
      showSuccess(t('tournoiPerformances.createSuccess'));
      setShowAddDialog(false);
      setSelectedParticipantId(null);
      await loadPerformances();
    } catch (error) {
      showError(t('tournoiPerformances.createError'));
    } finally {
      setIsCreating(false);
    }
  };

  const parseDuration = (duration: string | null): number => {
    if (!duration) return 0;
    const [mins, secs] = duration.split(':').map(Number);
    return (mins || 0) * 60 + (secs || 0);
  };

  const formatDurationSeconds = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPerformance = (performance: any) => {
    setCurrentPerformance(performance);
    setActiveTab('en_cours');
    setTimerSeconds(parseDuration(performance.duree));
  };

  const handlePlay = () => {
    setTimerRunning(true);
    updatePerformanceLocal(currentPerformance.idPerfo, { etat: 'en_cours' });
    setCurrentPerformance({ ...currentPerformance, etat: 'en_cours' });
    
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        const newSeconds = prev + 1;
        const formattedDuration = formatDurationSeconds(newSeconds);
        updatePerformanceLocal(currentPerformance.idPerfo, { duree: formattedDuration });
        setCurrentPerformance(prev => ({ ...prev, duree: formattedDuration }));
        return newSeconds;
      });
    }, 1000);
  };

  const handlePause = () => {
    setTimerRunning(false);
    updatePerformanceLocal(currentPerformance.idPerfo, { etat: 'en_pause' });
    setCurrentPerformance({ ...currentPerformance, etat: 'en_pause' });
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const handleTerminate = async () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsTerminating(true);
    try {
      const updatedPerformance = await updatePerformance(currentPerformance.idPerfo, {
        etat: 'terminée',
        duree: formatDurationSeconds(timerSeconds),
      });
      showSuccess(t('tournoiPerformances.terminatedSuccess'));
      setActiveTab('note');
      setCurrentPerformance(updatedPerformance);
      setTimerRunning(false);
      await loadPerformances();
    } catch (error) {
      showError(t('tournoiPerformances.terminateError'));
    } finally {
      setIsTerminating(false);
    }
  };

  const handleAddNote = () => {
    const value = parseFloat(noteInput.replace(',', '.'));
    if (isNaN(value) || value < 0 || value > 10) {
      showError(t('tournoiPerformances.invalidNote'));
      return;
    }

    if (inputType === 'note') {
      const newNote = { 
        id: Date.now().toString(),
        valeur: value, 
        retenu: true 
      };
      setLocalNotes([...localNotes, newNote]);
    } else {
      const newPenalite = {
        id: Date.now().toString(),
        valeur: value,
      };
      setLocalPenalites([...localPenalites, newPenalite]);
    }
    setNoteInput('');
  };

  const handleToggleRetenu = (noteId: string) => {
    setLocalNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, retenu: !note.retenu } : note
    ));
  };

  const handleSaveNotes = async () => {
    if (!currentPerformance?.idPerfo) {
      showError(t('tournoiPerformances.noPerformanceSelected'));
      return;
    }

    const nbJury = tournoi?.nbJury || 3;
    
    if (localNotes.length !== nbJury) {
      showError(t('tournoiPerformances.notesRequired').replace('{nb}', nbJury.toString()));
      return;
    }

    setIsSavingNotes(true);
    try {
      const notesToSave = localNotes.map(({ id, ...note }) => note);
      const penalitesToSave = localPenalites.map(({ id, ...penalite }) => penalite);
      
      await createBulkNotes(currentPerformance.idPerfo, notesToSave);
      if (penalitesToSave.length > 0) {
        await createBulkPenalites(currentPerformance.idPerfo, penalitesToSave);
      }
      
      showSuccess(t('tournoiPerformances.notesSaved'));
      
      await updatePerformance(currentPerformance.idPerfo, {});
      
      setLocalNotes([]);
      setLocalPenalites([]);
      setCurrentPerformance(null);
      clearNotes();
      clearPenalites();
      
      await loadPerformances();
    } catch (error) {
      showError(t('tournoiPerformances.saveError'));
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleToggleNoteRetenu = async (noteId: number) => {
    const note = notes.find(n => n.idNote === noteId);
    if (!note) return;

    try {
      await updateNote(noteId, { retenu: !note.retenu });
      showSuccess(t('tournoiPerformances.noteUpdated'));
      await hydrateNotes(currentPerformance.idPerfo);
    } catch (error) {
      showError(t('tournoiPerformances.updateNoteError'));
    }
  };

  const handleDeleteClick = (performance: any) => {
    setPerformanceToDelete(performance);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!performanceToDelete) return;
    
    try {
      await deletePerformance(performanceToDelete.idPerfo);
      showSuccess(t('tournoiPerformances.deleteSuccess'));
      setShowDeleteDialog(false);
      setPerformanceToDelete(null);
      await loadPerformances();
    } catch (error) {
      showError(t('tournoiPerformances.deleteError'));
    }
  };

  const getParticipantName = (item: any) => {
    if (item.membre) {
      return item.membre.pseudoMembre;
    } else if (item.guest) {
      return item.guest.pseudo;
    }
    return t('tournoiPerformances.unknown');
  };

  const getParticipantPhoto = (item: any) => {
    if (item.membre?.photoMembre) {
      return item.membre.photoMembre;
    }
    return null;
  };

  const isGuest = (item: any) => !!item.guest;

  const getParticipantType = (item: any) => {
    return isGuest(item) ? t('tournoiParticipants.guest') : t('tournoiParticipants.member');
  };

  const formatDuration = (duration: string | null): string => {
    if (!duration) return '00:00';
    return duration;
  };

  const getEtatColor = (etat: string | null) => {
    switch (etat) {
      case 'prêt': return 'bg-blue-500/20 text-blue-500';
      case 'en_cours': return 'bg-yellow-500/20 text-yellow-500';
      case 'en_pause': return 'bg-orange-500/20 text-orange-500';
      case 'terminée': return 'bg-green-500/20 text-green-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEtatLabel = (etat: string | null) => {
    switch (etat) {
      case 'prêt': return t('tournoiPerformances.ready');
      case 'en_cours': return t('tournoiPerformances.inProgress');
      case 'en_pause': return t('tournoiPerformances.paused');
      case 'terminée': return t('tournoiPerformances.completed');
      default: return etat || t('tournoiPerformances.notDefined');
    }
  };

  const getEtatIcon = (etat: string | null) => {
    switch (etat) {
      case 'prêt': return <Clock size={14} />;
      case 'en_cours': return <Play size={14} />;
      case 'en_pause': return <Pause size={14} />;
      case 'terminée': return <CheckCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const getEtatClass = (etat: string | null) => {
    switch (etat) {
      case 'prêt': return 'border-blue-500/30 bg-blue-500/5';
      case 'en_cours': return 'border-yellow-500/30 bg-yellow-500/5';
      case 'en_pause': return 'border-orange-500/30 bg-orange-500/5';
      case 'terminée': return 'border-green-500/30 bg-green-500/5';
      default: return '';
    }
  };

  const tabs = [
    { id: 'liste' as TabType, label: t('tournoiPerformances.listTab') },
    { id: 'en_cours' as TabType, label: t('tournoiPerformances.inProgressTab') },
    { id: 'note' as TabType, label: t('tournoiPerformances.notesTab') },
  ];

  const renderListeTab = () => (
    <>
      {isLoading && performances.length === 0 ? (
        <div className="text-center py-12">
          <Loader2 className="mx-auto mb-4 text-muted-foreground animate-spin" size={48} />
          <p className="text-muted-foreground">{t('tournoiPerformances.loading')}</p>
        </div>
      ) : performances.length === 0 ? (
        <div className="text-center py-12 border border-border border-dashed">
          <Mic className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">{t('tournoiPerformances.noPerformances')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {performances.map((performance, index) => (
            <div 
              key={performance.idPerfo} 
              className={`border bg-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 group ${getEtatClass(performance.etat)}`}
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-border flex items-center justify-center flex-shrink-0">
                  {getParticipantPhoto(performance) ? (
                    <img
                      src={getParticipantPhoto(performance)}
                      alt={getParticipantName(performance)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Mic className="text-muted-foreground" size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-medium text-base md:text-lg truncate">{getParticipantName(performance)}</h3>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      isGuest(performance) ? 'bg-secondary text-secondary-foreground' : 'bg-primary/20 text-primary'
                    }`}>
                      {getParticipantType(performance)}
                    </span>
                    <span className="hidden md:inline">·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="md:hidden" />
                      <span>{t('tournoiPerformances.duration')}: {formatDuration(performance.duree)}</span>
                    </span>
                    {performance.noteFinale && (
                      <>
                        <span className="hidden md:inline">·</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle size={12} className="md:hidden" />
                          <span>{t('tournoiPerformances.score')}: {performance.noteFinale}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between w-full md:w-auto gap-3 md:gap-3 mt-2 md:mt-0">
                <div className="flex items-center gap-3">
                  {performance.etat && (
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getEtatColor(performance.etat)}`}>
                      {getEtatIcon(performance.etat)}
                      <span className="hidden md:inline">{getEtatLabel(performance.etat)}</span>
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground font-medium">#{index + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  {performance.etat === 'prêt' && (
                    <button
                      onClick={() => handleStartPerformance(performance)}
                      className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-all text-sm flex items-center gap-2"
                    >
                      <Play size={14} />
                      <span className="hidden md:inline">{t('tournoiPerformances.start')}</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(performance)}
                    className="opacity-0 md:opacity-0 md:group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-lg transition-all bg-destructive/5 md:bg-transparent"
                    aria-label={t('tournoiParticipants.delete')}
                  >
                    <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderEnCoursTab = () => {
    if (!currentPerformance) {
      return (
        <div className="text-center py-12 border border-border border-dashed">
          <Clock className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">{t('tournoiPerformances.noCurrentPerformance')}</p>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border rounded-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-border flex items-center justify-center flex-shrink-0">
                {getParticipantPhoto(currentPerformance) ? (
                  <img
                    src={getParticipantPhoto(currentPerformance)}
                    alt={getParticipantName(currentPerformance)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Mic className="text-muted-foreground" size={28} />
                )}
              </div>
              <div>
                <h3 className="text-foreground font-medium text-xl">{getParticipantName(currentPerformance)}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  isGuest(currentPerformance) ? 'bg-secondary text-secondary-foreground' : 'bg-primary/20 text-primary'
                }`}>
                  {getParticipantType(currentPerformance)}
                </span>
              </div>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getEtatColor(currentPerformance.etat)}`}>
              {getEtatIcon(currentPerformance.etat)}
              {getEtatLabel(currentPerformance.etat)}
            </div>
          </div>

          <div className="text-center mb-8">
                <div className="text-6xl font-mono font-bold text-foreground mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {formatDurationSeconds(timerSeconds)}
              </div>
            <p className="text-muted-foreground">{t('tournoiPerformances.timer')}</p>
          </div>

          <div className="flex gap-4">
            {!timerRunning ? (
              <button
                onClick={handlePlay}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-all text-lg flex items-center gap-2"
              >
                <Play size={20} />
                {t('tournoiPerformances.play')}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg hover:bg-secondary/90 transition-all text-lg flex items-center gap-2"
              >
                <Pause size={20} />
                {t('tournoiPerformances.pause')}
              </button>
            )}
            <button
              onClick={handleTerminate}
              disabled={isTerminating}
              className="bg-destructive text-destructive-foreground px-8 py-3 rounded-lg hover:bg-destructive/90 transition-all text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTerminating ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <CheckCircle size={20} />
              )}
              {isTerminating ? t('tournoiPerformances.recording') : t('tournoiPerformances.finish')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNoteTab = () => {
    const allLocalNotes = [...localNotes].sort((a, b) => a.valeur - b.valeur);
    const allLocalPenalites = [...localPenalites].sort((a, b) => a.valeur - b.valeur);
    const existingNotes = [...notes].sort((a, b) => a.valeur - b.valeur);
    const existingPenalites = [...penalites].sort((a, b) => a.valeur - b.valeur);
    const nbJury = tournoi?.nbJury || 3;
    const canAddNote = allLocalNotes.length < nbJury;

    if (!currentPerformance || currentPerformance.etat !== 'terminée') {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12 border border-border border-dashed">
            <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">
              {!currentPerformance 
                ? t('tournoiPerformances.noPerformanceSelected')
                : t('tournoiPerformances.mustBeTerminated')}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-foreground font-medium text-lg mb-4">{t('tournoiPerformances.addNotes')}</h3>
          
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setInputType('note')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                inputType === 'note'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {t('tournoiPerformances.notes')}
            </button>
            <button
              onClick={() => setInputType('penalite')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                inputType === 'penalite'
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {t('tournoiPerformances.penalties')}
            </button>
          </div>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder={inputType === 'note' ? t('tournoiPerformances.notePlaceholder') : t('tournoiPerformances.penaltyPlaceholder')}
              onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
              disabled={inputType === 'note' && !canAddNote}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleAddNote}
              disabled={inputType === 'note' && !canAddNote}
              className={`px-4 py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                inputType === 'penalite'
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {t('tournoiPerformances.add')}
            </button>
          </div>

          {allLocalNotes.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">{t('tournoiPerformances.notesToRecord')}</h4>
              <div className="flex flex-wrap gap-3">
                {allLocalNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`flex items-center gap-2 px-4 py-2 bg-background border rounded-lg ${
                      !note.retenu ? 'border-red-500/30 bg-red-500/5' : 'border-border'
                    }`}
                  >
                    <span className={`text-foreground font-medium ${!note.retenu ? 'line-through text-destructive' : ''}`}>
                      {note.valeur}
                    </span>
                    <button
                      onClick={() => handleToggleRetenu(note.id)}
                      className="text-sm text-destructive hover:underline"
                    >
                      {note.retenu ? t('tournoiPerformances.remove') : t('tournoiPerformances.restore')}
                    </button>
                  </div>
                ))}
              </div>
              {!canAddNote && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('tournoiPerformances.maxNotesReached').replace('{nb}', nbJury.toString())}
                </p>
              )}
            </div>
          )}

          {allLocalPenalites.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">{t('tournoiPerformances.penaltiesToRecord')}</h4>
              <div className="flex flex-wrap gap-3">
                {allLocalPenalites.map((penalite) => (
                  <div
                    key={penalite.id}
                    className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/30 rounded-lg"
                  >
                    <span className="text-destructive font-medium">
                      -{penalite.valeur}
                    </span>
                    <button
                      onClick={() => {
                        setLocalPenalites(prev => prev.filter(p => p.id !== penalite.id));
                      }}
                      className="text-sm text-destructive hover:underline"
                    >
                      {t('tournoiPerformances.remove')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSaveNotes}
            disabled={isSavingNotes || localNotes.length !== nbJury}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSavingNotes ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                {t('tournoiParametres.saving')}
              </>
            ) : (
              <>
                <Send size={16} />
                {t('tournoiPerformances.save')} ({localNotes.length}/{nbJury})
              </>
            )}
          </button>

          {(existingNotes.length > 0 || existingPenalites.length > 0) && (
            <div className="bg-card border rounded-xl p-6 mt-6">
              <h3 className="text-foreground font-medium text-lg mb-4">{t('tournoiPerformances.existingNotes')}</h3>
              <div className="flex flex-wrap gap-3">
                {existingNotes.map((note) => (
                  <div
                    key={note.idNote}
                    className={`flex items-center gap-2 px-4 py-2 bg-background border rounded-lg ${
                      !note.retenu ? 'border-red-500/30 bg-red-500/5' : 'border-border'
                    }`}
                  >
                    <span className={`text-foreground font-medium ${!note.retenu ? 'line-through text-destructive' : ''}`}>
                      {note.valeur}
                    </span>
                    <button
                      onClick={() => handleToggleNoteRetenu(note.idNote)}
                      className="text-sm text-destructive hover:underline"
                    >
                      {note.retenu ? t('tournoiPerformances.remove') : t('tournoiPerformances.restore')}
                    </button>
                  </div>
                ))}
                {existingPenalites.map((penalite) => (
                  <div
                    key={penalite.idPenalite}
                    className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/30 rounded-lg"
                  >
                    <span className="text-destructive font-medium">
                      -{penalite.valeur}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const isGuestParticipant = (participant: any) => !!participant.guest;

  const renderParticipantList = () => (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {participants.map((participant) => (
        <button
          key={participant.idParticipant}
          onClick={() => setSelectedParticipantId(participant.idParticipant)}
          className={`w-full p-3 rounded-lg border transition-all flex items-center gap-3 ${
            selectedParticipantId === participant.idParticipant
              ? 'bg-primary/10 border-primary'
              : 'bg-card border-border hover:border-primary/50'
          }`}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-border flex items-center justify-center flex-shrink-0">
            {getParticipantPhoto(participant) ? (
              <img
                src={getParticipantPhoto(participant)}
                alt={getParticipantName(participant)}
                className="w-full h-full object-cover"
              />
            ) : (
              <Mic className="text-muted-foreground" size={18} />
            )}
          </div>
          <div className="text-left flex-1">
            <p className="font-medium text-foreground">{getParticipantName(participant)}</p>
            <span className={`text-xs px-2 py-0.5 rounded ${
              isGuestParticipant(participant) ? 'bg-secondary text-secondary-foreground' : 'bg-primary/20 text-primary'
            }`}>
              {isGuestParticipant(participant) ? t('tournoiParticipants.guest') : t('tournoiParticipants.member')}
            </span>
          </div>
          {selectedParticipantId === participant.idParticipant && (
            <CheckCircle className="text-primary" size={20} />
          )}
        </button>
      ))}
    </div>
  );

  const renderTirageTab = () => (
    <div className="text-center py-8">
      <p className="text-muted-foreground">{t('tournoiPerformances.draw')} - {t('tournoiPerformances.notDefined')}</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-foreground"
          style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
        >
          {t('tournoiPerformances.title')}
        </h2>
        {activeTab === 'liste' && (
          <button
            onClick={() => setShowAddDialog(true)}
            className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            <span className="hidden md:inline">{t('tournoiPerformances.addPerformance')}</span>
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'liste' && renderListeTab()}
      {activeTab === 'en_cours' && renderEnCoursTab()}
      {activeTab === 'note' && renderNoteTab()}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('tournoiPerformances.deleteTitle')}
        message={t('tournoiPerformances.deleteMessage')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={handleDeleteConfirm}
        loading={isLoading}
        onCancel={() => {
          setShowDeleteDialog(false);
          setPerformanceToDelete(null);
        }}
      />

      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">{t('tournoiPerformances.createPerformance')}</h3>
              <button
                onClick={() => {
                  setShowAddDialog(false);
                  setSelectedParticipantId(null);
                  setModalActiveTab('participant');
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {tournoi?.tirageAuSort && (
              <div className="flex gap-2 mb-6 border-b border-border">
                <button
                  onClick={() => setModalActiveTab('participant')}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    modalActiveTab === 'participant'
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('tournoiPerformances.participant')}
                  {modalActiveTab === 'participant' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setModalActiveTab('tirage')}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    modalActiveTab === 'tirage'
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('tournoiPerformances.draw')}
                  {modalActiveTab === 'tirage' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              </div>
            )}

            <div className="space-y-4">
              {modalActiveTab === 'participant' ? (
                <>
                  {renderParticipantList()}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowAddDialog(false);
                        setSelectedParticipantId(null);
                        setModalActiveTab('participant');
                      }}
                      disabled={isCreating}
                      className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('tournoiPerformances.cancel')}
                    </button>
                    <button
                      onClick={handleCreatePerformance}
                      disabled={!selectedParticipantId || isCreating}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          {t('common.creating')}
                        </>
                      ) : (
                        t('tournoiPerformances.create')
                      )}
                    </button>
                  </div>
                </>
              ) : (
                renderTirageTab()
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}