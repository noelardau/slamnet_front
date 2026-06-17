import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTournoiStore } from '../stores/tournoiStore';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { Loader2, Users, Mic, Trophy, Menu, X, Settings, DoorOpen, ArrowLeft } from 'lucide-react';

export default function TournoiGestionLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { tournois } = useTournoiStore();
  const [isLoading, setIsLoading] = useState(true);
  const [tournoi, setTournoi] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const foundTournoi = tournois.find(t => t.idTournoi === Number(id));
    if (foundTournoi) {
      setTournoi(foundTournoi);
    }
    setIsLoading(false);
  }, [id, tournois]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

 

  const handleBackToTournois = () => {
    navigate('/tournois');
  };

  const tabs = [
    { id: 'participants', label: t('tournoiGestion.participants'), icon: Users, path: `/tournoi-gestion/${id}/participants` },
    { id: 'performances', label: t('tournoiGestion.performances'), icon: Mic, path: `/tournoi-gestion/${id}/performances` },
    { id: 'classement', label: t('tournoiGestion.ranking'), icon: Trophy, path: `/tournoi-gestion/${id}/classement` },
  ] as const;

  const isSettingsActive = location.pathname === `/tournoi-gestion/${id}/parametres`;
  const activeTab = isSettingsActive ? null : (tabs.find(tab => location.pathname === tab.path)?.id || null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t('language') === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">{t('tournoiGestion.loading')}</p>
        </div>
      </div>
    );
  }

  if (!tournoi) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{t('tournoiGestion.notFound')}</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8 mt-12 sm:mt-16">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 sm:w-8 h-px bg-primary flex-shrink-0" />
                <span
                  className="text-primary flex-shrink-0"
                  style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem sm:0.7rem", letterSpacing: "0.2em" }}
                >
                  {t('tournoiGestion.tournament')}
                </span>
              </div>
              <h1
                className="text-foreground truncate"
                style={{
                  fontFamily: "Anton, sans-serif",
                  fontSize: "clamp(1.5rem, 5vw, 3rem)",
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
                className="w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-28 object-cover rounded-lg flex-shrink-0"
              />
            )}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground p-2 ml-2 flex-shrink-0 hover:bg-accent rounded-lg transition-colors"
            aria-label={t('tournoiGestion.menu')}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <aside className="hidden md:block w-full md:w-64 flex-shrink-0 order-2 md:order-1">
            <nav className="sticky top-4 md:top-8 space-y-1 sm:space-y-2">
              <button
                onClick={handleBackToTournois}
                className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base text-muted-foreground hover:bg-card hover:text-foreground mb-2"
              >
                <ArrowLeft size={16} className="sm:size-[18px]" />
                <span>{t('tournoiGestion.backToTournois')}</span>
              </button>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigate(tab.path)}
                    className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-muted-foreground hover:bg-card hover:text-foreground'
                    }`}
                  >
                    <Icon size={16} className="sm:size-[18px]" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              <div className="pt-4 mt-4 border-t border-border">
                <button
                  onClick={() => navigate(`/tournoi-gestion/${id}/parametres`)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                    isSettingsActive
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:bg-card hover:text-foreground'
                  }`}
                >
                  <Settings size={16} className="sm:size-[18px]" />
                  <span>{t('tournoiGestion.settings')}</span>
                </button>
              </div>
            </nav>
          </aside>

          {mobileMenuOpen && (
            <>
              <div 
                className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setMobileMenuOpen(false)}
                onKeyDown={handleKeyDown}
                aria-hidden="true"
              />
               <aside 
                 className="md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-background shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
                 role="dialog"
                 aria-modal="true"
                 aria-label={t('tournoiGestion.menu')}
               >
                 <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
                   <span className="text-foreground font-medium text-lg">{t('tournoiGestion.menu')}</span>
                   <button
                     onClick={() => setMobileMenuOpen(false)}
                     className="text-foreground p-2 hover:bg-accent rounded-lg transition-colors"
                     aria-label={t('tournoiGestion.closeMenu')}
                   >
                     <X size={24} />
                   </button>
                 </div>
                 <nav className="p-4 space-y-1" role="navigation">
                   {tabs.map((tab) => {
                     const Icon = tab.icon;
                     return (
                       <button
                         key={tab.id}
                         onClick={() => navigate(tab.path)}
                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-base ${
                           activeTab === tab.id
                             ? 'bg-primary text-primary-foreground font-medium'
                             : 'text-muted-foreground hover:bg-card hover:text-foreground'
                         }`}
                       >
                         <Icon size={18} />
                         <span>{tab.label}</span>
                       </button>
                     );
                   })}
                   <button
                     onClick={handleBackToTournois}
                     className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-base text-muted-foreground hover:bg-card hover:text-foreground"
                   >
                     <DoorOpen size={18} />
                     <span>{t('tournoiGestion.backToTournois')}</span>
                   </button>
                   <button
                     onClick={() => navigate(`/tournoi-gestion/${id}/parametres`)}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-base ${
                       isSettingsActive
                         ? 'bg-primary text-primary-foreground font-medium'
                         : 'text-muted-foreground hover:bg-card hover:text-foreground'
                     }`}
                   >
                     <Settings size={18} />
                     <span>{t('tournoiGestion.settings')}</span>
                   </button>
                 </nav>
               </aside>
            </>
          )}

          <main className="flex-1 order-1 md:order-2 min-w-0">
            <Outlet context={{ tournoi }} />
          </main>
        </div>
      </div>
    </div>
  );
}