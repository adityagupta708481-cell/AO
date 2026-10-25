import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Mail, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { api, setAuthToken } from '../api/client';
import ThemeToggle from '../components/ui/ThemeToggle';
import AlgoOrbitLogo from '../components/ui/AlgoOrbitLogo';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post('/auth/login', { email, password });
      setAuthToken(data.access_token);
      
      const me = await api.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(me));

      if (onLoginSuccess) onLoginSuccess(me);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('aditya@placement.edu');
    setPassword('student123');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'transparent', color: 'var(--foreground)', padding: '20px 16px' }}>
      {/* Top right ThemeToggle */}
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <ThemeToggle variant="sm" />
      </div>

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="auth-card"
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'var(--card)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius)',
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ marginBottom: '1.15rem' }}>
            <AlgoOrbitLogo size={44} variant="badge" className="shadow-[0_4px_24px_var(--primary-glow)]" />
          </div>

          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '-0.025em', color: 'var(--foreground)' }}>
            Sign in to AlgoOrbit
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Track your coding progress and interview readiness
          </p>

          {error && (
            <div
              style={{
                width: '100%',
                background: 'rgba(255, 81, 2, 0.15)',
                border: '1px solid rgba(255, 81, 2, 0.35)',
                color: 'var(--destructive)',
                padding: '10px 14px',
                borderRadius: 'var(--radius)',
                fontSize: '0.85rem',
                marginBottom: '16px',
                textAlign: 'left',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--muted-foreground)', marginBottom: '4px', fontWeight: 600 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--input)',
                    color: 'var(--foreground)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--muted-foreground)', marginBottom: '4px', fontWeight: 600 }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--input)',
                  color: 'var(--foreground)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginTop: '6px',
                borderRadius: 'var(--radius)',
                border: 'none',
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px var(--primary-glow)',
                transition: 'opacity 0.2s',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Fill Demo button */}
          <button
            type="button"
            onClick={fillDemo}
            style={{
              width: '100%',
              padding: '0.6rem',
              marginTop: '0.75rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={15} color="var(--primary)" />
            Try with Demo Account
          </button>

          <div style={{ height: 1, background: 'var(--border)', width: '100%', margin: '1.25rem 0' }} />

          <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--primary)',
                fontWeight: 700,
                textDecoration: 'none',
                marginLeft: '4px'
              }}
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

