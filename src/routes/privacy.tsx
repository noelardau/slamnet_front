export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 0.95,
            color: "#f2ede6",
          }}
        >
          CONFIDENTIALITÉ
        </h1>
      </div>

      <div className="space-y-8 text-muted-foreground" style={{ lineHeight: 1.7 }}>
        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            Collecte des données
          </h2>
          <p>
            Slam Net collecte uniquement les données nécessaires au fonctionnement de la plateforme,
            notamment les informations de compte, les données des collectifs et les statistiques de performance.
          </p>
        </div>

        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            Utilisation des données
          </h2>
          <p>
            Vos données sont utilisées pour vous permettre de gérer votre collectif, d'organiser des tournois
            et de suivre les performances des poètes. Nous ne vendons pas vos données à des tiers.
          </p>
        </div>

        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            Hébergement
          </h2>
          <p>
            Toutes vos données sont hébergées sur des serveurs situés en France, conformément aux
            réglementations européennes de protection des données (RGPD).
          </p>
        </div>

        <div>
          <h2 className="text-foreground mb-4" style={{ fontFamily: "Anton, sans-serif", fontSize: "1.4rem" }}>
            Vos droits
          </h2>
          <p>
            Vous avez le droit d'accéder, de modifier et de supprimer vos données personnelles à tout moment.
            Contactez-nous pour exercer ces droits.
          </p>
        </div>
      </div>
    </div>
  );
}