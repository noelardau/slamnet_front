export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8">
        <h1 
          className="text-center mb-8"
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "2.5rem",
            lineHeight: 1,
            color: "#f2ede6",
          }}
        >
          CONNEXION
        </h1>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground px-6 py-4 hover:bg-primary/90 transition-all duration-200 font-bold uppercase tracking-wider"
            style={{ letterSpacing: "0.06em" }}
          >
            Se connecter
          </button>
        </form>
        <p className="text-center mt-6 text-muted-foreground">
          Pas encore de compte?{" "}
          <a href="/signup" className="text-primary hover:underline">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
}