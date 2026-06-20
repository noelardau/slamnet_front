import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  tournamentInvitationService,
  TournamentInvitationPublicInfo,
} from '../services/tournamentInvitationService';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
  UserPlus,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';

type Status = 'loading' | 'error' | 'form' | 'submitting' | 'success';
type Tab = 'membre' | 'guest';

export default function TournoiInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [info, setInfo] = useState<TournamentInvitationPublicInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [tab, setTab] = useState<Tab>('membre');

  const [codeMembre, setCodeMembre] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Lien d\'invitation invalide');
      return;
    }

    tournamentInvitationService
      .getInvitationByToken(token)
      .then((data) => {
        setInfo(data);
        setStatus('form');
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : 'Invitation invalide ou expirée'
        );
        setStatus('error');
      });
  }, [token]);

  const formatCodeMembre = (value: string): string => {
    const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (raw.length <= 3) return raw;
    return `${raw.slice(0, 3)}-${raw.slice(3, 9)}`;
  };

  const handleCodeMembreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCodeMembre(e.target.value);
    setCodeMembre(formatted);
  };

  const handleSubmitMembre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const normalized = codeMembre.startsWith('SLM-')
      ? codeMembre
      : `SLM-${codeMembre.replace(/^SLM-?/, '')}`;

    setStatus('submitting');
    setErrorMessage('');
    try {
      await tournamentInvitationService.acceptAsMembre(token, normalized);
      setSuccessMessage('Votre inscription au tournoi a bien été enregistrée.');
      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erreur lors de l\'inscription');
      setStatus('form');
    }
  };

  const handleSubmitGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setStatus('submitting');
    setErrorMessage('');
    try {
      await tournamentInvitationService.acceptAsGuest(token, pseudo.trim());
      setSuccessMessage('Votre inscription au tournoi a bien été enregistrée.');
      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Erreur lors de l\'inscription');
      setStatus('form');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">Vérification de l'invitation...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <AlertCircle className="mx-auto mb-4 text-destructive" size={64} />
        <h1
          className="text-foreground mb-3"
          style={{ fontFamily: 'Anton, sans-serif', fontSize: '2rem' }}
        >
          Invitation invalide
        </h1>
        <p className="text-muted-foreground mb-8">{errorMessage}</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 border border-border hover:border-primary/60 transition-colors text-sm"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="text-primary" size={40} />
        </div>
        <h1
          className="text-foreground mb-3"
          style={{ fontFamily: 'Anton, sans-serif', fontSize: '2.5rem' }}
        >
          Inscription confirmée !
        </h1>
        <p className="text-muted-foreground mb-2">
          {successMessage}
        </p>
        {info && (
          <p className="text-muted-foreground text-sm mb-8">
            Vous participez à <span className="text-primary font-medium">{info.nomTournoi}</span>
            {' '}organisé par <span className="text-primary font-medium">{info.nomCollectif}</span>.
          </p>
        )}
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const isSubmitting = status === 'submitting';

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <div className="mb-6 text-center">
        <p
          className="text-primary mb-2"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.2em' }}
        >
          INSCRIPTION TOURNOI
        </p>
        <h1
          className="text-foreground mb-3"
          style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', lineHeight: 1 }}
        >
          <span style={{ color: '#ff4d00' }}>{info?.nomTournoi}</span>
        </h1>
        {info && (
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(info.dateTournoi)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {info.heureTournoi}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {info.LieuTournoi}
            </span>
          </div>
        )}
        <p className="text-muted-foreground mt-2 text-sm">
          Organisé par <span className="text-primary font-medium">{info?.nomCollectif}</span> ({info?.ville})
        </p>
      </div>

      {errorMessage && status === 'form' && (
        <div className="mb-4 p-3 border border-destructive/50 bg-destructive/10 text-destructive text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-2 p-1 bg-muted rounded-lg mb-4">
        <button
          onClick={() => setTab('membre')}
          disabled={isSubmitting}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            tab === 'membre'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User size={16} />
          Je suis membre
        </button>
        <button
          onClick={() => setTab('guest')}
          disabled={isSubmitting}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            tab === 'guest'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <UserPlus size={16} />
          Je suis invité (guest)
        </button>
      </div>

      {tab === 'membre' ? (
        <form onSubmit={handleSubmitMembre} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Votre code membre</label>
            <input
              type="text"
              required
              value={codeMembre}
              onChange={handleCodeMembreChange}
              placeholder="SLM-XXXXXX"
              maxLength={10}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}
              disabled={isSubmitting}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Votre code membre vous a été communiqué lors de votre inscription au collectif.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ letterSpacing: '0.06em' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Inscription...
              </>
            ) : (
              'S\'inscrire au tournoi'
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmitGuest} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Votre pseudo / nom d'artiste</label>
            <input
              type="text"
              required
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Votre nom de scène"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Si ce pseudo n'existe pas encore, il sera créé automatiquement.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ letterSpacing: '0.06em' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Inscription...
              </>
            ) : (
              'S\'inscrire au tournoi'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
