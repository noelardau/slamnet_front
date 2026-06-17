import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthModalProvider, useAuthModal } from '../contexts/AuthModalContext';
import { LoginModal } from '../components/LoginModal';
import { SignupModal } from '../components/SignupModal';

export function Layout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AuthModalProvider>
            <div
              className="min-h-screen bg-background text-foreground"
              style={{ scrollbarWidth: "none" }}
            >
              <style>{`
                ::-webkit-scrollbar { display: none; }
                * { font-family: 'DM Sans', sans-serif; }
              `}</style>
              <Navbar />
              <main className="min-h-[calc(100vh-128px)]">
                <Outlet />
              </main>
              <Footer />
              <GlobalAuthModals />
            </div>
          </AuthModalProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

function GlobalAuthModals() {
  const { showLoginModal, showSignupModal, closeModals, openLoginModal, openSignupModal } = useAuthModal();
  
  const handleSwitchToSignup = () => {
    closeModals();
    setTimeout(openSignupModal, 100);
  };
  
  const handleSwitchToLogin = () => {
    closeModals();
    setTimeout(openLoginModal, 100);
  };

  return (
    <>
      <LoginModal 
        open={showLoginModal} 
        onOpenChange={closeModals}
        onSwitchToSignup={handleSwitchToSignup}
      />
      <SignupModal 
        open={showSignupModal} 
        onOpenChange={closeModals}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}