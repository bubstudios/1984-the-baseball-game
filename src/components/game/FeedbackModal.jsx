import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bug, MessageSquare, X, Loader2, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function FeedbackModal({ onClose }) {
  const [feedbackType, setFeedbackType] = useState('feedback');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      await base44.functions.invoke('sendFeedback', {
        feedbackType,
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Feedback submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center px-4" onClick={onClose}>
      <div
        className="bg-card border-2 border-border rounded-xl max-w-md w-full p-6 space-y-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="w-12 h-12 text-secondary mx-auto" />
            <h3 className="font-heading text-lg font-bold text-foreground">Thank You!</h3>
            <p className="text-sm text-muted-foreground">
              Your {feedbackType === 'bug' ? 'bug report' : 'feedback'} has been sent. We appreciate you helping improve the game!
            </p>
            <Button onClick={onClose} variant="secondary" className="mt-2">Close</Button>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-foreground">Send Feedback</h3>
              <p className="text-xs text-muted-foreground">Report a bug or share your thoughts</p>
            </div>

            {/* Type Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setFeedbackType('feedback')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-sm font-heading ${
                  feedbackType === 'feedback'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Feedback
              </button>
              <button
                onClick={() => setFeedbackType('bug')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-sm font-heading ${
                  feedbackType === 'bug'
                    ? 'border-destructive bg-destructive/10 text-destructive'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <Bug className="w-4 h-4" />
                Bug Report
              </button>
            </div>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={feedbackType === 'bug'
                ? 'Describe the bug: what happened, what you expected, and what you were doing...'
                : 'Share your feedback, suggestions, or ideas...'}
              rows={5}
              className="resize-none"
            />

            <Button
              onClick={handleSubmit}
              disabled={!message.trim() || submitting}
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                feedbackType === 'bug' ? 'Send Bug Report' : 'Send Feedback'
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}