import { useState } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useMembreStore } from '../stores/membreStore';
import { useCollectifStore } from '../stores/collectifStore';
import { CreateMembreDialog } from '../components/CreateMembreDialog';
import { UpdateMembreDialog } from '../components/UpdateMembreDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Plus, Search, Edit2, Trash2, User, Loader2, Calendar, MapPin, AtSign } from 'lucide-react';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';

function MembresContent() {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const { t } = useLanguage();
  const { membres, isLoading, error, createMembre, updateMembre, deleteMembre, refreshMembres } = useMembreStore();
  const { profile, isLoading: isProfileLoading } = useCollectifStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMembreId, setSelectedMembreId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredMembres = membres.filter(
    (membre) =>
      membre.nomMembre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      membre.prenomMembre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      membre.pseudoMembre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      membre.emailMembre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateClick = (membreId: number) => {
    setSelectedMembreId(membreId);
    setShowUpdateDialog(true);
  };

  const handleDeleteClick = (membreId: number) => {
    setSelectedMembreId(membreId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMembreId) return;

    setIsDeleting(true);
    try {
      await deleteMembre(selectedMembreId);
      showSuccess(t('membres.deleteSuccess'));
      setShowDeleteDialog(false);
      setSelectedMembreId(null);
    } catch (error) {
      console.error('Erreur lors de la suppression du membre:', error);
      showError(t('membres.deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t('language') === 'en' ? 'en-US' : 'fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!isAuthenticated || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">{t('membres.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">{t('dashboard.needLogin')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-primary" />
            <span
              className="text-primary"
              style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.2em" }}
            >
              {t('membres.title')}
            </span>
          </div>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            <span className="hidden md:inline">{t('membres.addMember')}</span>
          </button>
        </div>
        <h1
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 0.95,
            color: "#f2ede6",
          }}
        >
          <span style={{ color: "#ff4d00" }}>{t('membres.subtitle')}</span>
        </h1>
        <p className="mt-4 text-muted-foreground" style={{ fontSize: "1rem" }}>
          {t('membres.description')}
        </p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder={t('membres.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : filteredMembres.length === 0 ? (
        <div className="text-center py-12 border border-border border-dashed">
          <User className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground mb-4">
            {searchQuery ? t('membres.noMembersFound') : t('membres.noMembers')}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowCreateDialog(true)}
              className="text-primary hover:underline"
            >
              {t('membres.addFirstMember')}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredMembres.map((membre) => (
             <div key={membre.idMembre} className="border border-border bg-card p-6 hover:border-primary/60 transition-all duration-300">
               <div className="flex items-start justify-between mb-4">
                 <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-full overflow-hidden bg-border flex items-center justify-center">
                     {membre.photoMembre ? (
                       <ImageWithFallback
                         src={membre.photoMembre}
                         alt={`${membre.prenomMembre} ${membre.nomMembre}`}
                         className="w-full h-full object-cover"
                         fallback={<User className="text-muted-foreground" size={32} />}
                       />
                     ) : (
                       <User className="text-muted-foreground" size={32} />
                     )}
                   </div>
                   <div>
                     <h3 
                       className="text-foreground"
                       style={{ fontFamily: "Anton, sans-serif", fontSize: "1.2rem" }}
                     >
                       {membre.prenomMembre} {membre.nomMembre.toUpperCase()}
                     </h3>
                     <p className="text-primary text-sm mt-1">@{membre.pseudoMembre}</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button
                     onClick={() => handleUpdateClick(membre.idMembre)}
                     className="p-2 hover:bg-primary/10 rounded transition-colors"
                     title={t('common.edit')}
                     aria-label={t('common.edit')}
                   >
                     <Edit2 size={16} className="text-muted-foreground hover:text-primary" />
                   </button>
                   <button
                     onClick={() => handleDeleteClick(membre.idMembre)}
                     className="p-2 hover:bg-destructive/10 rounded transition-colors"
                     title={t('common.delete')}
                     aria-label={t('common.delete')}
                   >
                     <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                   </button>
                 </div>
               </div>

               <div className="space-y-3 hidden md:block">
                 <div className="flex items-center gap-2 text-muted-foreground text-sm">
                   <AtSign size={16} />
                   <span>{membre.emailMembre}</span>
                 </div>
                 <div className="flex items-center gap-2 text-muted-foreground text-sm">
                   <Calendar size={16} />
                   <span>{t('membres.bornOn')} {formatDate(membre.dateNaissance)}</span>
                 </div>
                 <div className="flex items-center gap-2 text-muted-foreground text-sm">
                   <MapPin size={16} />
                   <span>{membre.adresse}</span>
                 </div>
               </div>

               <div className="flex flex-col gap-2 md:hidden">
                 <div className="flex items-center gap-2 text-muted-foreground text-xs">
                   <AtSign size={14} />
                   <span className="truncate">{membre.emailMembre}</span>
                 </div>
                 <div className="flex items-center gap-2 text-muted-foreground text-xs">
                   <Calendar size={14} />
                   <span>{new Date(membre.dateNaissance).toLocaleDateString(t('language') === 'en' ? 'en-US' : 'fr-FR', { day: '2-digit', month: 'short' })}</span>
                 </div>
               </div>
             </div>
           ))}
        </div>
      )}

      <CreateMembreDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onMembreCreated={() => setShowCreateDialog(false)}
      />

      <UpdateMembreDialog
        isOpen={showUpdateDialog}
        onClose={() => {
          setShowUpdateDialog(false);
          setSelectedMembreId(null);
        }}
        membreId={selectedMembreId}
        onMembreUpdated={() => setShowUpdateDialog(false)}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('deleteMember.title')}
        message={t('deleteMember.message')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedMembreId(null);
        }}
        loading={isDeleting}
      />
    </div>
  );
}

export default function MembresPage() {
  return (
    <ProtectedRoute>
      <MembresContent />
    </ProtectedRoute>
  );
}