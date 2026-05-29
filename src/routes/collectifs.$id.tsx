import { useParams } from 'react-router-dom';

export default function CollectifDetailPage() {
  const { id } = useParams();
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-primary" />
          <span
            className="text-primary"
            style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.2em" }}
          >
            COLLECTIF
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
          COLLECTIF {id}
          <br />
          <span style={{ color: "#ff4d00" }}>DE SLAM.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border border-border p-8 bg-card mb-8">
            <h2 
              className="mb-4 text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
            >
              À propos
            </h2>
            <p className="text-muted-foreground" style={{ lineHeight: 1.7 }}>
              Collectif de slam poésie passionné par la parole libre et l'expression artistique. 
              Nous organisons des événements réguliers pour promouvoir la poésie orale.
            </p>
          </div>

          <div className="border border-border p-8 bg-card">
            <h2 
              className="mb-6 text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
            >
              Membres
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-border bg-background">
                  <div
                    className="w-12 h-12 flex items-center justify-center border border-primary/30"
                    style={{
                      fontFamily: "Anton, sans-serif",
                      fontSize: "1rem",
                      color: "#ff4d00",
                    }}
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <div className="text-foreground font-medium">Poète {i}</div>
                    <div className="text-muted-foreground text-sm">15 performances</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="border border-border p-8 bg-card mb-8">
            <h2 
              className="mb-4 text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}
            >
              Statistiques
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-foreground">12</div>
                <div className="text-muted-foreground text-sm">Membres actifs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">23</div>
                <div className="text-muted-foreground text-sm">Tournois organisés</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">156</div>
                <div className="text-muted-foreground text-sm">Performances enregistrées</div>
              </div>
            </div>
          </div>

          <div className="border border-border p-8 bg-card">
            <h2 
              className="mb-4 text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}
            >
              Tournois récents
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <a
                  key={i}
                  href={`/tournois/${i}`}
                  className="block p-4 border border-border bg-background hover:border-primary/60 transition-all duration-300"
                >
                  <div className="font-medium text-foreground">Tournoi {i}</div>
                  <div className="text-muted-foreground text-sm">12 janvier 2026</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}