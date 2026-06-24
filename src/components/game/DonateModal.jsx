import React, { useState } from 'react';
import { Heart, X } from 'lucide-react';

const PRESETS = [1, 3, 5, 10, 25];

export default function DonateModal({ onClose }) {
  const [amount, setAmount] = useState('5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDonate = async () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/_base44/api/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        console.error('Checkout error:', data);
        setError(data.error || 'Something went wrong');
        setLoading(false);
      }
    } catch (e) {
      console.error('Fetch error:', e);
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-primary/30 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className="bg-primary/10 border-b border-primary/20 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-base font-bold text-foreground">Tip the Developer</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-4">
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            This game is free, forever. If you're enjoying it and want to show some appreciation, any tip is greatly appreciated! ⚾
          </p>

          {/* Preset amounts */}
          <div className="grid grid-cols-5 gap-1.5">
            {PRESETS.map(p => (
              <button
                key={p}
                onClick={() => setAmount(String(p))}
                className={`font-heading text-sm font-bold rounded-lg py-2 transition-all border ${
                  amount === String(p)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:border-primary/40'
                }`}
              >
                ${p}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div>
            <label className="block text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">
              Custom Amount
            </label>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-heading text-sm">$</span>
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                placeholder="Enter amount"
              />
            </div>
          </div>

          {error && (
            <div className="text-[11px] text-red-400 font-body text-center">{error}</div>
          )}

          <button
            onClick={handleDonate}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-heading font-bold text-sm py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Redirecting…' : `Tip $${parseFloat(amount) || 0}`}
          </button>
        </div>

        <div className="px-5 py-3 border-t border-border">
          <p className="text-[9px] text-muted-foreground/50 text-center font-body">
            Secure checkout via Base44 Payments · created by Bub Studios
          </p>
        </div>
      </div>
    </div>
  );
}