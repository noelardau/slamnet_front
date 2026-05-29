export default function DashboardPage() {
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
          MON
          <br />
          <span style={{ color: "#ff4d00" }}>COLLECTIF.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Membres", value: "12", color: "#ff4d00" },
          { label: "Tournois", value: "23", color: "#f2ede6" },
          { label: "Performances", value: "156", color: "#f2ede6" },
          { label: "Prochains événements", value: "3", color: "#f2ede6" },
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
            {[1, 2, 3].map((i) => (
              <a
                key={i}
                href={`/tournois/${i}`}
                className="block p-4 border border-border bg-background hover:border-primary/60 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Tournoi {i}</div>
                    <div className="text-muted-foreground text-sm">Round 2 • 8 participants</div>
                  </div>
                  <div
                    className="px-3 py-1 text-xs font-bold"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      background: "#ff4d00",
                      color: "#0c0a09",
                    }}
                  >
                    EN COURS
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}