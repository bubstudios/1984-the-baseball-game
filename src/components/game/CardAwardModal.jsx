import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import BaseballCard from './BaseballCard';

export default function CardAwardModal({ card, isNewCard, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  if (!visible || !card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-96">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-yellow-300 transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="bg-slate-900 rounded-xl border-4 border-yellow-400 shadow-2xl p-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-yellow-300 mb-2 uppercase tracking-wider">
            ⭐ Card Awarded!
          </h2>
          
          {isNewCard && (
            <p className="text-green-400 font-heading text-sm font-bold mb-4 uppercase">
              🎉 New Card Added to Collection!
            </p>
          )}
          {!isNewCard && (
            <p className="text-amber-300 font-heading text-sm font-bold mb-4 uppercase">
              Duplicate - Already in Collection
            </p>
          )}

          <div className="my-6">
            <BaseballCard card={card} isNew={isNewCard} />
          </div>

          <button
            onClick={onClose}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-heading font-bold uppercase rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg"
          >
            Continue Game
          </button>
        </div>
      </div>
    </div>
  );
}