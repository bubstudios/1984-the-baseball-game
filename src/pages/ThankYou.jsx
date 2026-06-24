import React from 'react';
import { Heart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
            <Heart className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h1 className="font-display text-sm text-primary tracking-wider">THANK YOU!</h1>
        <p className="font-heading text-lg text-foreground font-bold">
          Your tip means the world.
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          This game is made with love for the great game of baseball and the summer of 1984.
          Your support keeps the lights on at the ballpark. Play ball! ⚾
        </p>
        <Button onClick={() => window.location.href = '/'} className="gap-2 font-heading" size="lg">
          <Home className="w-4 h-4" />
          Back to the Ballpark
        </Button>
      </div>
    </div>
  );
}