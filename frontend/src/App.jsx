import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Code2,
  BrainCircuit,
  BookOpen,
  LogOut,
  Sparkles,
  User,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { getAuthToken, removeAuthToken } from './api/client';
import DotMatrixBackground from './components/ui/DotMatrixBackground';
import AetherFlowBackground from './components/ui/AetherFlowBackground';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ui/ThemeToggle';
import AlgoOrbitLogo from './components/ui/AlgoOrbitLogo';

// Code-split pages for ultra-lightweight initial JS bundle
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CodingProfiles = lazy(() => import('./pages/CodingProfiles'));
const AIAnalysis = lazy(() => import('./pages/AIAnalysis'));
const CSFundamentals = lazy(() => import('./pages/CSFundamentals'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Landing = lazy(() => import('./pages/Landing'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (_) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#07080b',
          color: '#f8fafc',
          padding: '24px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            background: '#0e1117',
            border: '1px solid #222836',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255, 81, 2, 0.15)',
              color: '#ff5102',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              !
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.5 }}>
              The application encountered an unexpected runtime state. You can reload the page or clear temporary session cache.
            </p>
            {this.state.error?.message && (
              <div style={{
                background: '#151922',
                border: '1px solid #222836',
                borderRadius: '6px',
                padding: '10px 14px',
                fontSize: '0.78rem',
                color: '#ef4444',
                fontFamily: 'monospace',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '20px'
              }}>
                {this.state.error.message}
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#2fe92b',
                  color: '#07080b',
                  fontWeight: '600',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  background: '#1a1f2c',
                  color: '#f8fafc',
                  fontWeight: '500',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  border: '1px solid #222836',
                  cursor: 'pointer'
                }}
              >
                Reset Session
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '3px solid rgba(47, 233, 43, 0.2)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', fontWeight: '500' }}>Loading view...</span>
      </div>
    </div>
  );
}

function DynamicBackground() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return isAuthPage ? <DotMatrixBackground /> : <AetherFlowBackground />;
}

function ProtectedLayout({ children, onLogout }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        setCurrentUser(JSON.parse(raw));
      } catch (_) {}
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock background body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Coding Profiles', path: '/coding', icon: Code2 },
    { name: 'AI Insights & Prep', path: '/ai-analysis', icon: BrainCircuit },
    { name: 'CS & Aptitude', path: '/cs-fundamentals', icon: BookOpen },
  ];

  return (
    <div className="app-container">
      {/* Mobile Top Header (visible < 1024px) */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlgoOrbitLogo size={32} variant="badge" />
          <span style={{ fontWeight: '800', fontSize: '0.98rem', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
            Algo<span style={{ color: 'var(--primary)' }}>Orbit</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ThemeToggle variant="sm" />
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="app-sidebar"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Backdrop for mobile drawer */}
      <div
        className={`sidebar-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar (static on desktop, slide-in drawer on mobile) */}
      <aside id="app-sidebar" className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 24px', borderBottom: '1px solid var(--sidebar-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlgoOrbitLogo size={38} variant="badge" />
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.08rem', letterSpacing: '-0.02em', color: 'var(--sidebar-foreground)' }}>
                Algo<span style={{ color: 'var(--primary)' }}>Orbit</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Placement Prep
              </div>
            </div>
          </div>
          <ThemeToggle variant="sm" />
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '24px', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius)',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                  background: isActive ? 'var(--primary-subtle)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} color={isActive ? 'var(--primary)' : 'currentColor'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div style={{ borderTop: '1px solid var(--sidebar-border)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', padding: '0 4px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}
            >
              <User size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '600', fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--sidebar-foreground)' }}>
                {currentUser?.full_name || 'Student User'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.email || 'Logged in'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area with fluid route transitions */}
      <main className="main-content">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(getAuthToken());

  const handleLogout = () => {
    removeAuthToken();
    setToken(null);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          {/* Dynamic Ambient Background across whole frontend */}
          <DynamicBackground isLoggedIn={!!token} />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public cinematic landing page (always reachable) */}
              <Route path="/welcome" element={<Landing />} />

              <Route
                path="/login"
                element={token ? <Navigate to="/" replace /> : <Login onLoginSuccess={() => setToken(getAuthToken())} />}
              />
              <Route
                path="/register"
                element={token ? <Navigate to="/" replace /> : <Register onLoginSuccess={() => setToken(getAuthToken())} />}
              />

              <Route
                path="/"
                element={
                  token ? (
                    <ProtectedLayout onLogout={handleLogout}>
                      <Dashboard />
                    </ProtectedLayout>
                  ) : (
                    <Landing />
                  )
                }
              />

              <Route
                path="/coding"
                element={
                  token ? (
                    <ProtectedLayout onLogout={handleLogout}>
                      <CodingProfiles />
                    </ProtectedLayout>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/ai-analysis"
                element={
                  token ? (
                    <ProtectedLayout onLogout={handleLogout}>
                      <AIAnalysis />
                    </ProtectedLayout>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/cs-fundamentals"
                element={
                  token ? (
                    <ProtectedLayout onLogout={handleLogout}>
                      <CSFundamentals />
                    </ProtectedLayout>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}


