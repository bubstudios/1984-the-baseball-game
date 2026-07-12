import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, MessageSquare } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

export default function ModeSelect({ onSelectMode, onBack }) {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col relative">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚾</span>
          <h1 className="font-heading text-lg font-bold text-foreground">1984 Baseball</h1>
        </div>
        <button
          onClick={onBack}
          className="text-xs font-heading text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl font-bold text-foreground">Select Game Mode</h2>
            <p className="text-sm text-muted-foreground">Choose how you want to play</p>
          </div>

          {/* Mode Cards */}
          <div className="space-y-4">
            {/* Exhibition Mode - Playable */}
            <button
              onClick={() => onSelectMode('exhibition')}
              className="w-full bg-card border-2 border-primary/50 hover:border-primary rounded-xl p-6 text-left transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">Exhibition Mode</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Play a single game with full control. Choose your teams, manage your lineup, and call every pitch.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-heading text-primary bg-primary/10 px-2 py-1 rounded">PLAYABLE</span>
                    <span className="text-xs font-heading text-primary/80 group-hover:text-primary transition-colors">Start Playing →</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Season Mode - Playable */}
            <button
              onClick={() => onSelectMode('season')}
              className="w-full bg-card border-2 border-primary/50 hover:border-primary rounded-xl p-6 text-left transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">Season Mode</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Manage your team through a full 162-game season. Track stats, make trades, and chase the pennant.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-heading text-primary bg-primary/10 px-2 py-1 rounded">PLAYABLE</span>
                    <span className="text-xs font-heading text-primary/80 group-hover:text-primary transition-colors">Start Playing →</span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Info Note */}
          <div className="bg-muted/30 border border-border rounded-lg px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground font-heading">
              Exhibition Mode includes all game features: pitch-by-pitch control, substitutions, injuries, and 1984-era atmosphere.
            </p>
          </div>

          {/* Feedback Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowFeedback(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all text-sm font-heading"
            >
              <MessageSquare className="w-4 h-4" />
              Report a Bug / Send Feedback
            </button>
          </div>
        </div>
      </div>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </div>
  );
}