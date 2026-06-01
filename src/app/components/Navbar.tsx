import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useCollectifStore } from "../../stores/collectifStore";
import { Menu, X, LogOut, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ConfirmDialog } from "../../components/ConfirmDialog";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { profile } = useCollectifStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutDialog(false);
    setIsLoggingOut(true);
    try {
      await logout();
      showSuccess('Déconnexion réussie');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      showError('Erreur lors de la déconnexion');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span
              className="text-primary"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.6rem", letterSpacing: "-0.02em" }}
            >
              SLAM
            </span>
            <span
              className="text-foreground"
              style={{ fontFamily: "Anton, sans-serif", fontSize: "1.6rem", letterSpacing: "-0.02em" }}
            >
              NET
            </span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse ml-1" />
          </Link>

        {/* Desktop links */}
        <div
          className="hidden md:flex items-center gap-8"
          style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", letterSpacing: "0.05em" }}
        >
          {isAuthenticated ? (
            <>
              {[
                { label: "DASHBOARD", to: "/dashboard" },
                { label: "MEMBRES", to: "/membres" },
                { label: "TOURNOIS", to: "/tournois" },
              ].map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`relative text-muted-foreground hover:text-foreground transition-colors duration-200 ${
                      isActive ? 'text-foreground' : ''
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                        layoutId="activeLink"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </>
          ) : (
            [
              { label: "FONCTIONNALITÉS", to: "/#features" },
              { label: "COMMENT ÇA MARCHE", to: "/#how-it-works" },
              { label: "COLLECTIFS", to: "/collectifs" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))
          )}
        </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {profile?.nomCollectif}
                </span>
                <button
                  onClick={handleLogoutClick}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 px-4 py-2 border border-border hover:border-primary/60 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Déconnexion...
                    </>
                  ) : (
                    <>
                      <LogOut size={16} />
                      Déconnexion
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem" }}
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary text-primary-foreground px-5 py-2 hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.04em" }}
                >
                  CRÉER UN COMPTE
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background px-6 pb-6 flex flex-col gap-4 pt-4"
            >
              {isAuthenticated ? (
                <>
                  {[
                    { label: "DASHBOARD", to: "/dashboard" },
                    { label: "MEMBRES", to: "/membres" },
                    { label: "TOURNOIS", to: "/tournois" },
                  ].map((link) => {
                    const isActive = location.pathname === link.to;
                    return (
                      <Link 
                        key={link.label} 
                        to={link.to} 
                        className={`relative py-1 ${
                          isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                        style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", letterSpacing: "0.05em" }}
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                        {isActive && (
                          <motion.div
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                            layoutId="activeLinkMobile"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </Link>
                    );
                  })}
                  <div className="pt-4 border-t border-border flex items-center gap-3 text-muted-foreground py-1"
                    style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", letterSpacing: "0.05em" }}>
                    <span>{profile?.nomCollectif}</span>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", letterSpacing: "0.05em" }}
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Déconnexion...
                      </>
                    ) : (
                      <>
                        <LogOut size={16} />
                        Déconnexion
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  {[
                    { label: "FONCTIONNALITÉS", to: "/#features" },
                    { label: "COMMENT ÇA MARCHE", to: "/#how-it-works" },
                    { label: "COLLECTIFS", to: "/collectifs" },
                  ].map((link) => (
                    <Link key={link.label} to={link.to} className="text-muted-foreground hover:text-foreground py-1"
                      style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.875rem", letterSpacing: "0.05em" }}>
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to="/signup"
                    className="bg-primary text-primary-foreground px-5 py-3 text-center mt-2"
                    style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, letterSpacing: "0.04em" }}
                  >
                    CRÉER UN COMPTE
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    
      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmText="Se déconnecter"
        cancelText="Annuler"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        loading={isLoggingOut}
      />
    </>
  );
}