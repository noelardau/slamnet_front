import { useEffect, useState } from 'react';
import { adminService, AdminCollectif } from '../../services/adminService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { Loader2, Search, ShieldOff, ShieldCheck } from 'lucide-react';

export default function AdminCollectifsPage() {
  const { t } = useLanguage();
  const [collectifs, setCollectifs] = useState<AdminCollectif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [pendingId, setPendingId] = useState<number | null>(null);
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
      showSuccess(updated.active ? t('admin.collectifs.reactivated') : t('admin.collectifs.suspended'));
    } catch (e) {
      showError(e instanceof Error ? e.message : t('admin.collectifs.updateError'));
    } finally {
      setPendingId(null);
    }
  };

  const filtered = collectifs.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.nomCollectif.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.ville.toLowerCase().includes(q)
    );
  });

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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
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
                  {t('admin.collectifs.empty')}
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
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-red-500/40 text-red-500 bg-red-500/10">
                        {t('admin.collectifs.statusSuspended')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
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
                        <ShieldCheck size={12} />
                      )}
                      {c.active ? t('admin.collectifs.suspend') : t('admin.collectifs.reactivate')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
