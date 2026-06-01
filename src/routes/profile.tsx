import { useState, useRef } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { PageLoader } from '../components/PageLoader';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useCollectifStore } from '../stores/collectifStore';
import { Edit2, Loader2, Mail, MapPin, Camera } from 'lucide-react';

function ProfileContent() {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const { profile, isLoading, isProfileLoading, updateProfile, hydrateProfile } = useCollectifStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    nomCollectif: '',
    ville: '',
    email: '',
    photoCollectif: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    if (profile) {
      setFormData({
        nomCollectif: profile.nomCollectif,
        ville: profile.ville,
        email: profile.email,
        photoCollectif: profile.photoCollectif || '',
      });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nomCollectif: '',
      ville: '',
      email: '',
      photoCollectif: '',
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('http://localhost:3001/collectif/photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      
      // Recharger le profil depuis le store pour avoir les données à jour
      await hydrateProfile();
      
      showSuccess('Photo mise à jour avec succès');
    } catch (error) {
      console.error('Erreur upload:', error);
      showError('Erreur lors de l\'upload de la photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile(formData);
      showSuccess('Profil mis à jour avec succès');
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      showError('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Vous devez être connecté pour accéder à cette page</p>
      </div>
    );
  }

  if (isLoading || isProfileLoading) {
    return <PageLoader />;
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Erreur de chargement du profil</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-primary" />
          <span
            className="text-primary"
            style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.2em" }}
          >
            PROFIL
          </span>
        </div>
        <h1
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 0.95,
            color: "#f2ede6",
          }}
        >
          MON
          <span style={{ color: "#ff4d00" }}> PROFIL.</span>
        </h1>
        <p className="mt-4 text-muted-foreground" style={{ fontSize: "1rem" }}>
          Gérez les informations de votre collectif
        </p>
      </div>

      <div className="space-y-8">
        <div className="border border-border p-8 bg-card">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
               <div className="relative w-32 h-32 rounded-full overflow-hidden bg-border flex items-center justify-center">
                 {isEditing ? (
                   <>
                     {profile.photoCollectif ? (
                       <img
                         src={profile.photoCollectif}
                         alt={profile.nomCollectif}
                         className="w-full h-full object-cover"
                       />
                     ) : (
                       <span className="text-4xl font-bold text-muted-foreground">
                         {profile.nomCollectif.charAt(0).toUpperCase()}
                       </span>
                     )}
                     <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors">
                       {isUploading ? (
                         <Loader2 className="animate-spin text-white" size={24} />
                       ) : (
                         <Camera className="text-white" size={24} />
                       )}
                       <input
                         type="file"
                         accept="image/*"
                         onChange={handleFileUpload}
                         className="hidden"
                       />
                     </label>
                   </>
                 ) : (
                   <>
                     {profile.photoCollectif ? (
                       <img
                         src={profile.photoCollectif}
                         alt={profile.nomCollectif}
                         className="w-full h-full object-cover"
                       />
                     ) : (
                       <span className="text-4xl font-bold text-muted-foreground">
                         {profile.nomCollectif.charAt(0).toUpperCase()}
                       </span>
                     )}
                   </>
                 )}
               </div>
              <div>
                <h2 
                  className="text-foreground mb-2"
                  style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
                >
                  {isEditing ? formData.nomCollectif : profile.nomCollectif}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} />
                  <span>{isEditing ? formData.ville : profile.ville}</span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-4 py-2 border border-border hover:border-primary/60 transition-all duration-300"
              >
                <Edit2 size={16} />
                Modifier
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {isUploading && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin text-primary" size={16} />
                    <span className="text-sm font-medium">Upload en cours...</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom du collectif</label>
                  <input
                    type="text"
                    value={formData.nomCollectif}
                    onChange={(e) => setFormData({ ...formData, nomCollectif: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ville</label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                </div>
               </div>
 
               <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border border-border hover:border-primary/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ letterSpacing: "0.06em" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Enregistrement...
                    </>
                  ) : (
                    'Enregistrer'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Nom du collectif</label>
                <div className="text-foreground font-medium">{profile.nomCollectif}</div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Ville</label>
                <div className="text-foreground font-medium">{profile.ville}</div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Email</label>
                <div className="flex items-center gap-2 text-foreground">
                  <Mail size={16} className="text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
              </div>

                {profile.createdAt && (
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Membre depuis</label>
                    <div className="text-foreground font-medium">
                      {new Date(profile.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border border-border p-8 bg-card">
            <h3 
              className="text-foreground mb-4"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}
            >
              Statistiques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: "Anton, sans-serif" }}>
                  0
                </div>
                <div className="text-muted-foreground text-sm">Tournois créés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: "Anton, sans-serif" }}>
                  0
                </div>
                <div className="text-muted-foreground text-sm">Membres actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: "Anton, sans-serif" }}>
                  0
                </div>
                <div className="text-muted-foreground text-sm">Événements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
}


export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}