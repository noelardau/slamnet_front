import { useAuth } from '../contexts/AuthContext';
import { Loader2, Plus, User } from 'lucide-react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useMembreStore } from '../stores/membreStore';
import { useTournoiStore } from '../stores/tournoiStore';
import { useCollectifStore } from '../stores/collectifStore';

function DashboardContent() {
  const { loading, isAuthenticated } = useAuth();
  const { membres } = useMembreStore();
  const { tournois } = useTournoiStore();
  const { profile } = useCollectifStore();

  if (!isAuthenticated || !profile) {
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
          <span style={{ color: "#ff4d00" }}>{profile.nomCollectif.toUpperCase()}.</span>
        </h1>
        <p className="mt-4 text-muted-foreground" style={{ fontSize: "1rem" }}>
          {profile.ville} • {profile.email}
        </p>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
         {[
           { label: "Membres", value: membres.length.toString(), className: "text-primary", icon: <User size={24} className="text-primary opacity-20" /> },
           { label: "Tournois", value: tournois.length.toString(), className: "text-foreground", icon: <div className="w-6 h-6 rounded-full border-2 border-foreground opacity-20"></div> },
           { label: "Performances", value: "0", className: "text-foreground", icon: <div className="w-6 h-6 rounded-full bg-foreground opacity-20"></div> },
         ].map((stat) => (
           <div key={stat.label} className="border border-border p-6 bg-card relative overflow-hidden">
             <div className="absolute top-2 right-2 opacity-10">
               {stat.icon}
             </div>
             <div
               className={`text-3xl md:text-4xl font-bold mb-2 ${stat.className}`}
               style={{ fontFamily: "Anton, sans-serif" }}
             >
               {stat.value}
             </div>
             <div className="text-muted-foreground text-sm">{stat.label}</div>
           </div>
         ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
         <div className="border border-border p-6 md:p-8 bg-card">
           <h2 
             className="mb-6 text-foreground"
             style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}
           >
             Actions rapides
           </h2>
           <div className="space-y-3">
             <button className="w-full text-left px-6 py-4 border border-border bg-background hover:border-primary/60 transition-all duration-300 flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                 <Plus size={16} className="text-primary" />
               </div>
               <div className="flex-1 min-w-0">
                 <div className="font-medium">Organiser un nouveau tournoi</div>
                 <div className="text-muted-foreground text-sm hidden md:block">Créer et configurer un tournoi</div>
               </div>
             </button>
             <button className="w-full text-left px-6 py-4 border border-border bg-background hover:border-primary/60 transition-all duration-300 flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                 <User size={16} className="text-primary" />
               </div>
               <div className="flex-1 min-w-0">
                 <div className="font-medium">Inviter un membre</div>
                 <div className="text-muted-foreground text-sm hidden md:block">Ajouter un nouveau poète au collectif</div>
               </div>
             </button>
             <button className="w-full text-left px-6 py-4 border border-border bg-background hover:border-primary/60 transition-all duration-300 flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                 <div className="w-2 h-2 rounded-full bg-primary"></div>
               </div>
               <div className="flex-1 min-w-0">
                 <div className="font-medium">Voir les statistiques</div>
                 <div className="text-muted-foreground text-sm hidden md:block">Analytiques détaillées du collectif</div>
               </div>
             </button>
           </div>
         </div>

         <div className="border border-border p-6 md:p-8 bg-card">
           <h2 
             className="mb-6 text-foreground"
             style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}
           >
             Tournois en cours
           </h2>
           <div className="space-y-3">
             <div className="p-4 border border-border bg-background">
               <div className="text-muted-foreground text-center py-8">
                 <span className="hidden md:inline">Aucun tournoi en cours</span>
                 <span className="md:hidden">Aucun tournoi en cours</span>
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