import React, { useState } from 'react';

const GATE_KEY = 'game_auth_1984';
const GATE_USER_KEY = 'game_auth_1984_user';
const USERS_KEY = 'game_auth_1984_users';
const VALID_USER = 'MITCHELL';
const VALID_PASS = 'ISAJERRY';

export function isAuthenticated() {
  return sessionStorage.getItem(GATE_KEY) === 'true';
}

export function getCurrentUser() {
  return sessionStorage.getItem(GATE_USER_KEY) || null;
}

export function logout() {
  sessionStorage.removeItem(GATE_KEY);
  sessionStorage.removeItem(GATE_USER_KEY);
  window.location.reload();
}

function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function saveRegisteredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export default function GateLogin() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Enter both username and password');
      return;
    }
    // Check hardcoded creator account
    if (username.trim() === VALID_USER && password === VALID_PASS) {
      sessionStorage.setItem(GATE_KEY, 'true');
      sessionStorage.setItem(GATE_USER_KEY, VALID_USER);
      window.location.reload();
      return;
    }
    // Check registered users
    const users = getRegisteredUsers();
    const key = username.trim().toUpperCase();
    if (users[key] && users[key].password === password) {
      sessionStorage.setItem(GATE_KEY, 'true');
      sessionStorage.setItem(GATE_USER_KEY, users[key].displayName || key);
      window.location.reload();
    } else {
      setError('Invalid credentials');
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');
    const u = username.trim();
    if (!u || !password) {
      setError('Enter a username and password');
      return;
    }
    if (u.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const key = u.toUpperCase();
    if (key === VALID_USER) {
      setError('That username is taken');
      return;
    }
    const users = getRegisteredUsers();
    if (users[key]) {
      setError('That username is taken');
      return;
    }
    users[key] = { displayName: u, password: password };
    saveRegisteredUsers(users);
    sessionStorage.setItem(GATE_KEY, 'true');
    sessionStorage.setItem(GATE_USER_KEY, u);
    window.location.reload();
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
            {mode === 'signin' ? 'Sign in to play' : 'Create your account'}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => { setMode('signin'); setError(''); }}
            className={`font-heading text-[11px] rounded-md py-1.5 transition-all ${
              mode === 'signin' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`font-heading text-[11px] rounded-md py-1.5 transition-all ${
              mode === 'signup' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
              placeholder="Choose a username"
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
              placeholder={mode === 'signup' ? 'At least 4 characters' : 'Enter password'}
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                placeholder="Re-enter password"
              />
            </div>
          )}

          {error && (
            <div className="text-[11px] text-red-400 font-body text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-heading font-bold text-sm py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {mode === 'signin' && (
          <p className="text-[10px] text-muted-foreground/50 text-center font-body">
            New here?{' '}
            <button onClick={() => { setMode('signup'); setError(''); }} className="text-primary hover:underline">
              Create an account
            </button>
          </p>
        )}

        <p className="text-[9px] text-muted-foreground/40 text-center font-body">
          created by Bub Studios
        </p>
      </div>
    </div>
  );
}