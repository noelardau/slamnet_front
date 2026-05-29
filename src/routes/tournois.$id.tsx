import { useParams } from 'react-router-dom';

export default function TournoiDetailPage() {
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
            TOURNOI
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h1
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 0.95,
              color: "#f2ede6",
            }}
          >
            TOURNOI {id}
            <br />
            <span style={{ color: "#ff4d00" }}>EN COURS.</span>
          </h1>
          <div
            className="px-6 py-3 text-sm font-bold"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              background: "#ff4d00",
              color: "#0c0a09",
            }}
          >
            ROUND 2
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border border-border p-8 bg-card mb-8">
            <h2 
              className="mb-6 text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
            >
              Classement
            </h2>
            <div className="space-y-3">
              {[
                { rank: 1, name: "Amina K.", score: 9.4 },
                { rank: 2, name: "Dario M.", score: 9.1 },
                { rank: 3, name: "Élise B.", score: 8.8 },
                { rank: 4, name: "Thomas L.", score: 8.5 },
                { rank: 5, name: "Sarah N.", score: 8.2 },
                { rank: 6, name: "Marc P.", score: 7.9 },
                { rank: 7, name: "Julie R.", score: 7.6 },
                { rank: 8, name: "Antoine D.", score: 7.3 },
              ].map((participant) => (
                <div
                  key={participant.rank}
                  className="flex items-center justify-between p-4 border border-border bg-background"
                  style={{
                    background: participant.rank === 1 ? "rgba(255,77,0,0.1)" : undefined,
                    borderColor: participant.rank === 1 ? "#ff4d00" : undefined,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 flex items-center justify-center font-bold"
                      style={{
                        fontFamily: "Anton, sans-serif",
                        color: participant.rank === 1 ? "#ff4d00" : "#f2ede6",
                      }}
                    >
                      {participant.rank}
                    </div>
                    <div className="text-foreground">{participant.name}</div>
                  </div>
                  <div
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "Anton, sans-serif",
                      color: participant.rank === 1 ? "#ff4d00" : "#f2ede6",
                    }}
                  >
                    {participant.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border p-8 bg-card">
            <h2 
              className="mb-6 text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.8rem" }}
            >
              Ordre de passage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { order: 1, name: "Dario M.", status: "terminé" },
                { order: 2, name: "Élise B.", status: "terminé" },
                { order: 3, name: "Amina K.", status: "en cours" },
                { order: 4, name: "Thomas L.", status: "à venir" },
              ].map((passage) => (
                <div
                  key={passage.order}
                  className="flex items-center justify-between p-4 border border-border bg-background"
                  style={{
                    borderColor: passage.status === "en cours" ? "#ff4d00" : undefined,
                    background: passage.status === "en cours" ? "rgba(255,77,0,0.1)" : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 flex items-center justify-center font-bold"
                      style={{
                        fontFamily: "Anton, sans-serif",
                        color: passage.status === "en cours" ? "#ff4d00" : "#f2ede6",
                      }}
                    >
                      {passage.order}
                    </div>
                    <div className="text-foreground">{passage.name}</div>
                  </div>
                  <div
                    className="text-xs px-2 py-1"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      color: passage.status === "en cours" ? "#ff4d00" : "#888",
                      background: passage.status === "en cours" ? "rgba(255,77,0,0.2)" : "rgba(255,255,255,0.05)",
                    }}
                  >
                    {passage.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="border border-border p-8 bg-card mb-8">
            <h2 
              className="mb-6 text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}
            >
              Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full px-6 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider">
                Noter la performance
              </button>
              <button className="w-full px-6 py-4 border border-border hover:border-primary/60 transition-all duration-300">
                Voir les détails
              </button>
              <button className="w-full px-6 py-4 border border-border hover:border-primary/60 transition-all duration-300">
                Tirage au sort
              </button>
            </div>
          </div>

          <div className="border border-border p-8 bg-card">
            <h2 
              className="mb-4 text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}
            >
              Jury
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center border border-primary/30"
                    style={{
                      fontFamily: "Anton, sans-serif",
                      fontSize: "0.9rem",
                      color: "#ff4d00",
                    }}
                  >
                    J{i}
                  </div>
                  <div>
                    <div className="text-foreground text-sm">Jury {i}</div>
                    <div className="text-muted-foreground text-xs">Notes en attente</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}