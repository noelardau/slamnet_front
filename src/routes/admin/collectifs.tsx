import { useEffect, useState, useMemo } from 'react';
import { adminService, AdminCollectif } from '../../services/adminService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Loader2, Search, ShieldOff, ShieldCheck, Check, Trash2 } from 'lucide-react';

type TabKey = 'all' | 'pending' | 'active';

export default function AdminCollectifsPage() {
  const { t } = useLanguage();
  const [collectifs, setCollectifs] = useState<AdminCollectif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [tab, setTab] = useState<TabKey>('pending');
  const [deleteTarget, setDeleteTarget] = useState<AdminCollectif | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminService.listCollectifs();
      setCollectifs(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (c: AdminCollectif) => {
    setPendingId(c.idCollectif);
    try {
      const updated = await adminService.toggleCollectifActive(c.idCollectif, !c.active);
      setCollectifs((prev) => prev.map((x) => (x.idCollectif === updated.idCollectif ? updated : x)));
      if (!c.active) {
        showSuccess(t('admin.collectifs.approved'));
      } else {
        showSuccess(t('admin.collectifs.suspended'));
      }
    } catch (e) {
      showError(e instanceof Error ? e.message : t('admin.collectifs.updateError'));
    } finally {
      setPendingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminService.deleteCollectif(deleteTarget.idCollectif);
      setCollectifs((prev) => prev.filter((x) => x.idCollectif !== deleteTarget.idCollectif));
      showSuccess(t('admin.collectifs.deleted'));
      setDeleteTarget(null);
    } catch (e) {
      showError(e instanceof Error ? e.message : t('admin.collectifs.deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  const counts = useMemo(() => {
    const pending = collectifs.filter((c) => !c.active).length;
    const active = collectifs.filter((c) => c.active).length;
    return { all: collectifs.length, pending, active };
  }, [collectifs]);

  const filtered = collectifs.filter((c) => {
    if (tab === 'pending' && c.active) return false;
    if (tab === 'active' && !c.active) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.nomCollectif.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.ville.toLowerCase().includes(q)
    );
  });

  const tabs: { key: TabKey; label: string; count: number; badge?: boolean }[] = [
    { key: 'pending', label: t('admin.collectifs.tabPending'), count: counts.pending, badge: counts.pending > 0 },
    { key: 'active', label: t('admin.collectifs.tabActive'), count: counts.active },
    { key: 'all', label: t('admin.collectifs.tabAll'), count: counts.all },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span
            className="text-primary"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.2em' }}
          >
            {t('admin.backoffice')}
          </span>
          <h1
            className="mt-2"
            style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 0.95, color: '#f2ede6' }}
          >
            {t('admin.collectifs.title')}
          </h1>
        </div>
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('admin.collectifs.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-6 flex gap-1 border-b border-border">
        {tabs.map((tb) => {
          const isActive = tab === tb.key;
          return (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`relative pb-3 px-4 text-sm transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2">
                {tb.label}
                <span
                  className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs ${
                    tb.badge
                      ? 'bg-primary text-primary-foreground'
                      : isActive
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {tb.count}
                </span>
              </span>
              {isActive && <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary" />}
            </button>
          );
        })}
      </div>

      <div className="border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">{t('admin.collectifs.colHeader')}</th>
              <th className="px-4 py-3 font-medium">{t('admin.collectifs.email')}</th>
              <th className="px-4 py-3 font-medium">{t('admin.collectifs.ville')}</th>
              <th className="px-4 py-3 font-medium text-center">{t('admin.collectifs.membres')}</th>
              <th className="px-4 py-3 font-medium text-center">{t('admin.collectifs.tournois')}</th>
              <th className="px-4 py-3 font-medium text-center">{t('admin.collectifs.statut')}</th>
              <th className="px-4 py-3 font-medium text-center">{t('admin.collectifs.action')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  {tab === 'pending'
                    ? t('admin.collectifs.emptyPending')
                    : tab === 'active'
                      ? t('admin.collectifs.emptyActive')
                      : t('admin.collectifs.empty')}
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.idCollectif} className="border-b border-border last:border-0 hover:bg-background/40">
                  <td className="px-4 py-3 font-medium text-foreground">{c.nomCollectif}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.ville}</td>
                  <td className="px-4 py-3 text-center">{c.nbMembres}</td>
                  <td className="px-4 py-3 text-center">{c.nbTournois}</td>
                  <td className="px-4 py-3 text-center">
                    {c.active ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-green-500/40 text-green-500 bg-green-500/10">
                        {t('admin.collectifs.statusActive')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-amber-500/40 text-amber-500 bg-amber-500/10">
                        {t('admin.collectifs.statusPending')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleToggle(c)}
                        disabled={pendingId === c.idCollectif}
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs border transition-colors disabled:opacity-50 ${
                          c.active
                            ? 'border-red-500/40 text-red-500 hover:bg-red-500/10'
                            : 'border-green-500/40 text-green-500 hover:bg-green-500/10'
                        }`}
                      >
                        {pendingId === c.idCollectif ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : c.active ? (
                          <ShieldOff size={12} />
                        ) : (
                          <Check size={12} />
                        )}
                        {c.active ? t('admin.collectifs.suspend') : t('admin.collectifs.approve')}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
                        title={t('admin.collectifs.delete')}
                        className="inline-flex items-center justify-center w-7 h-7 text-xs border border-red-500/40 text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title={t('admin.collectifs.deleteTitle')}
        message={t('admin.collectifs.deleteMessage')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
        loading={isDeleting}
      />
    </div>
  );
}
