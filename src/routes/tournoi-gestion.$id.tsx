import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTournoiStore } from '../stores/tournoiStore';
import { useEffect, useState } from 'react';
import { Loader2, Users, Mic, Trophy, Menu, X } from 'lucide-react';

export default function TournoiGestionLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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

  const tabs = [
    { id: 'participants', label: 'Participants', icon: Users, path: `/tournoi-gestion/${id}/participants` },
    { id: 'performances', label: 'Performances', icon: Mic, path: `/tournoi-gestion/${id}/performances` },
    { id: 'classement', label: 'Classement', icon: Trophy, path: `/tournoi-gestion/${id}/classement` },
  ] as const;

  const activeTab = tabs.find(tab => location.pathname === tab.path)?.id || 'participants';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
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
        <div className="flex items-center justify-between mb-8 mt-16">
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
                    onClick={() => navigate(tab.path)}
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

          {mobileMenuOpen && (
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
                      onClick={() => navigate(tab.path)}
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
          )}

          <main className="flex-1 mt-[-150px]">
            <div className="mb-6 p-6 bg-card border border-border">
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

            <Outlet context={{ tournoi }} />
          </main>
        </div>
      </div>
    </div>
  );
}