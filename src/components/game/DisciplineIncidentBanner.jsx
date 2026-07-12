import React, { useState, useEffect } from 'react';
import { X, ArrowRight, AlertTriangle } from 'lucide-react';

// DisciplineIncidentBanner - Shows a multi-step discipline incident sequence
// on the main gameplay screen. Each step displays one event (HBP, warning,
// ejection, mound charge, etc.) and the user clicks Continue to advance.
//
// Props:
//   incident: { steps: [{ text, type }], totalEjections }
//   onDismiss: () => void
export default function DisciplineIncidentBanner({ incident, onDismiss }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!incident) return;
    setVisible(true);
    setStep(0);
  }, [incident]);

  if (!incident || !visible || !incident.steps || incident.steps.length === 0) return null;

  const currentStep = incident.steps[step];
  const isLast = step >= incident.steps.length - 1;

  const getStepIcon = (type) => {
    if (type === 'hbp') return '🔴';
    if (type === 'warning') return '⚠️';
    if (type === 'ejection') return '🟥';
    if (type === 'mound_charge') return '😤';
    if (type === 'brawl') return '🥊';
    if (type === 'substitution') return '🔄';
    if (type === 'manager_ejection') return '🧢';
    return '📋';
  };

  const getStepColor = (type) => {
    if (type === 'ejection' || type === 'manager_ejection') return 'text-destructive';
    if (type === 'warning') return 'text-amber-400';
    if (type === 'mound_charge' || type === 'brawl') return 'text-orange-500';
    return 'text-foreground';
  };

  const advance = () => {
    if (isLast) {
      setVisible(false);
      onDismiss();
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={advance}>
      <div className="relative bg-card border border-destructive/30 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => { setVisible(false); onDismiss(); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-4 text-center">
          {/* Header */}
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-[10px] font-heading uppercase tracking-[0.2em] text-destructive">
              On-Field Incident
            </span>
          </div>

          {/* Step indicator dots */}
          <div className="flex items-center justify-center gap-1.5">
            {incident.steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-destructive w-8' : 'bg-muted w-4'
                }`}
              />
            ))}
          </div>

          {/* Current step content */}
          <div className="text-4xl">{getStepIcon(currentStep.type)}</div>
          <p className={`text-base font-heading font-bold ${getStepColor(currentStep.type)} leading-snug px-2`}>
            {currentStep.text}
          </p>

          {/* Continue button */}
          <button
            onClick={advance}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 text-destructive font-heading text-sm transition-colors"
          >
            <span>{isLast ? 'Continue' : 'Next'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Ejection summary at the end */}
          {isLast && incident.totalEjections > 0 && (
            <p className="text-xs text-muted-foreground font-heading">
              {incident.totalEjections} player{incident.totalEjections !== 1 ? 's' : ''} ejected this inning
            </p>
          )}
        </div>
      </div>
    </div>
  );
}