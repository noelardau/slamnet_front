import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthProvider } from '../contexts/AuthContext';

export function Layout() {
  return (
    <AuthProvider>
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
      </div>
    </AuthProvider>
  );
}