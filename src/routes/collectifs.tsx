export default function CollectifsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-primary" />
          <span
            className="text-primary"
            style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.2em" }}
          >
            COLLECTIFS
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
          LES COLLECTIFS
          <br />
          <span style={{ color: "#ff4d00" }}>DE SLAM.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <a
            key={i}
            href={`/collectifs/${i}`}
            className="group block border border-border p-8 hover:border-primary/60 transition-all duration-300 bg-card"
          >
            <h3
              className="mb-3 text-foreground group-hover:text-primary transition-colors"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem", letterSpacing: "0.02em" }}
            >
              Collectif {i}
            </h3>
            <p className="text-muted-foreground mb-4" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
              Collectif de slam poésie basé à Paris, organisant des événements mensuels.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>12 membres</span>
              <span>•</span>
              <span>23 tournois</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}