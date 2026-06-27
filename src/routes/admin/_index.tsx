import { useEffect, useState } from 'react';
import { adminService, AdminStats } from '../../services/adminService';
import { useLanguage } from '../../contexts/LanguageContext';
import { Loader2, Users, Trophy, UserCircle, UserPlus, Mic } from 'lucide-react';

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const s = await adminService.getStats();
        if (!cancelled) {
          setStats(s);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Erreur');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const cards = [
    { label: t('admin.stats.collectifs'), value: stats?.nbCollectifs ?? 0, icon: <Users size={24} /> },
    { label: t('admin.stats.tournois'), value: stats?.nbTournois ?? 0, icon: <Trophy size={24} /> },
    { label: t('admin.stats.membres'), value: stats?.nbMembres ?? 0, icon: <UserCircle size={24} /> },
    { label: t('admin.stats.invites'), value: stats?.nbInvites ?? 0, icon: <UserPlus size={24} /> },
    { label: t('admin.stats.performances'), value: stats?.nbPerformances ?? 0, icon: <Mic size={24} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
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
          {t('admin.dashboard.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cards.map((c) => (
          <div key={c.label} className="border border-border p-6 bg-card relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-10">{c.icon}</div>
            <div
              className="text-3xl md:text-4xl font-bold mb-2 text-primary"
              style={{ fontFamily: 'Anton, sans-serif' }}
            >
              {c.value}
            </div>
            <div className="text-muted-foreground text-sm">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
