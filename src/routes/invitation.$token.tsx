import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { invitationService, InvitationPublicInfo } from '../services/invitationService';
import { Loader2, AlertCircle, CheckCircle2, Upload, X } from 'lucide-react';

type Status = 'loading' | 'error' | 'form' | 'submitting' | 'success';

export default function InvitationPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [info, setInfo] = useState<InvitationPublicInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdName, setCreatedName] = useState('');

  const [formData, setFormData] = useState({
    prenomMembre: '',
    nomMembre: '',
    pseudoMembre: '',
    emailMembre: '',
    dateNaissance: '',
    adresse: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Lien d\'invitation invalide');
      return;
    }

    invitationService
      .getInvitationByToken(token)
      .then((data) => {
        setInfo(data);
        setStatus('form');
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : 'Invitation invalide ou expirée');
        setStatus('error');
      });
  }, [token]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setStatus('submitting');
    try {
      await invitationService.acceptInvitation(token, {
        ...formData,
        photo,
      });
      setCreatedName(`${formData.prenomMembre} ${formData.nomMembre}`);
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
          Bienvenue{createdName ? `, ${createdName.split(' ')[0]}` : ''} !
        </h1>
        <p className="text-muted-foreground mb-2">
          Votre inscription au collectif <span className="text-primary font-medium">{info?.nomCollectif}</span> a bien été enregistrée.
        </p>
        <p className="text-muted-foreground text-sm mb-8">
          Vous faites désormais partie de l'aventure slam.
        </p>
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

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10 text-center">
        <p
          className="text-primary mb-3"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.2em' }}
        >
          INVITATION
        </p>
        <h1
          className="text-foreground mb-4"
          style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1 }}
        >
          Rejoindre <span style={{ color: '#ff4d00' }}>{info?.nomCollectif}</span>
        </h1>
        <p className="text-muted-foreground">
          Vous avez été invité à rejoindre le collectif {info?.nomCollectif} ({info?.ville}).
          Remplissez le formulaire ci-dessous pour devenir membre.
        </p>
      </div>

      {errorMessage && status === 'form' && (
        <div className="mb-6 p-4 border border-destructive/50 bg-destructive/10 text-destructive text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prénom</label>
            <input
              type="text"
              required
              value={formData.prenomMembre}
              onChange={(e) => setFormData({ ...formData, prenomMembre: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nom</label>
            <input
              type="text"
              required
              value={formData.nomMembre}
              onChange={(e) => setFormData({ ...formData, nomMembre: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Pseudo / Nom d'artiste</label>
          <input
            type="text"
            required
            value={formData.pseudoMembre}
            onChange={(e) => setFormData({ ...formData, pseudoMembre: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
            placeholder="Votre nom de scène"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            required
            value={formData.emailMembre}
            onChange={(e) => setFormData({ ...formData, emailMembre: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date de naissance</label>
          <input
            type="date"
            required
            value={formData.dateNaissance}
            onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Adresse</label>
          <input
            type="text"
            required
            value={formData.adresse}
            onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Photo de profil (optionnel)</label>
          {photoPreview ? (
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-border">
                <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={isSubmitting}
                className="flex items-center gap-1 text-sm text-destructive hover:underline"
              >
                <X size={14} />
                Retirer
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 w-full px-4 py-6 border border-dashed border-border rounded-lg bg-background hover:border-primary/60 transition-colors cursor-pointer">
              <Upload size={18} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Cliquez pour téléverser une image (max 5 MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ letterSpacing: '0.06em' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Inscription...
              </>
            ) : (
              'Rejoindre le collectif'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
