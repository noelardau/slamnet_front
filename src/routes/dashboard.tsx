import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useEffect } from 'react';
import { membreService } from '../services/membreService';
import { useState } from 'react';

function DashboardContent() {
  const { user, loading, isAuthenticated, logout, refreshProfile } = useAuth();
  const [membresCount, setMembresCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && !user) {
      refreshProfile();
    }
    if (isAuthenticated) {
      loadMembresCount();
    }
  }, [isAuthenticated, user, refreshProfile]);

  const loadMembresCount = async () => {
    try {
      const membres = await membreService.getMembres();
      setMembresCount(membres.length);
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Vous devez être connecté pour accéder à cette page</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-primary" />
          <span
            className="text-primary"
            style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.2em" }}
          >
            DASHBOARD
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
          <span style={{ color: "#ff4d00" }}>{user.nomCollectif.toUpperCase()}.</span>
        </h1>
        <p className="mt-4 text-muted-foreground" style={{ fontSize: "1rem" }}>
          {user.ville} • {user.email}
        </p>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Membres", value: membresCount.toString(), color: "#ff4d00" },
          { label: "Tournois", value: "0", color: "#f2ede6" },
          { label: "Performances", value: "0", color: "#f2ede6" },
          { label: "Prochains événements", value: "0", color: "#f2ede6" },
        ].map((stat) => (
          <div key={stat.label} className="border border-border p-6 bg-card">
            <div
              className="text-3xl font-bold mb-2"
              style={{ 
                fontFamily: "Anton, sans-serif",
                color: stat.color 
              }}
            >
              {stat.value}
            </div>
            <div className="text-muted-foreground text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-border p-8 bg-card">
          <h2 
            className="mb-6 text-foreground"
            style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}
          >
            Actions rapides
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left px-6 py-4 border border-border bg-background hover:border-primary/60 transition-all duration-300">
              <div className="font-medium">Organiser un nouveau tournoi</div>
              <div className="text-muted-foreground text-sm">Créer et configurer un tournoi</div>
            </button>
            <button className="w-full text-left px-6 py-4 border border-border bg-background hover:border-primary/60 transition-all duration-300">
              <div className="font-medium">Inviter un membre</div>
              <div className="text-muted-foreground text-sm">Ajouter un nouveau poète au collectif</div>
            </button>
            <button className="w-full text-left px-6 py-4 border border-border bg-background hover:border-primary/60 transition-all duration-300">
              <div className="font-medium">Voir les statistiques</div>
              <div className="text-muted-foreground text-sm">Analytiques détaillées du collectif</div>
            </button>
          </div>
        </div>

        <div className="border border-border p-8 bg-card">
          <h2 
            className="mb-6 text-foreground"
            style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}
          >
            Tournois en cours
          </h2>
          <div className="space-y-3">
            <div className="p-4 border border-border bg-background">
              <div className="text-muted-foreground text-center py-8">
                Aucun tournoi en cours
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}