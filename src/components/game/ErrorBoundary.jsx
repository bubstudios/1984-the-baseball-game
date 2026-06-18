import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="font-heading text-lg text-foreground">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">The game encountered an error. Please start a new game.</p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-heading text-sm"
            >Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}