import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';

const GATE_KEY = 'game_auth_1984';

export function isAuthenticated() {
  return sessionStorage.getItem(GATE_KEY) === 'true';
}

export function logout() {
  sessionStorage.removeItem(GATE_KEY);
  window.location.reload();
}

export default function GateLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Enter both username and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('validateLogin', { username: username.trim(), password });
      if (res.data?.success) {
        sessionStorage.setItem(GATE_KEY, 'true');
        window.location.reload();
      } else {
        setError(res.data?.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo area */}
        <div className="text-center space-y-2">
          <div className="text-2xl">⚾</div>
          <div className="font-display text-[13px] tracking-[0.3em] text-[#33cc33]">
            1984: THE BASEBALL SEASON
          </div>
          <p className="font-body text-sm text-muted-foreground">
            Private beta — enter credentials to play
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
              placeholder="Enter username"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="text-[11px] text-red-400 font-body text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-heading font-bold text-sm py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Sign In'}
          </button>
        </form>

        <p className="text-[9px] text-muted-foreground/40 text-center font-body">
          created by Bub Studios
        </p>
      </div>
    </div>
  );
}