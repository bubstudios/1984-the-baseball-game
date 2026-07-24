import GateLogin from './GateLogin';

/**
 * Modal overlay that wraps GateLogin for inline auth prompts.
 * Used when a user needs to sign up/sign in mid-session (e.g. after
 * reaching the free exhibition inning limit, or before starting Season Mode).
 */
export default function AuthGateModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] p-4">
      <div className="w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center text-lg font-bold text-muted-foreground z-10"
        >
          ×
        </button>
        <GateLogin onAuthenticated={onClose} />
      </div>
    </div>
  );
}