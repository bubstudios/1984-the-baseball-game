import React from 'react';

// 1984-accurate home win celebrations, researched:
// - Cubs: W flag flown since 1937 scoreboard construction. Authentic.
// - White Sox: Exploding scoreboard (Bill Veeck, 1960) fires fireworks after HRs — not a general win ceremony.
//   No distinct post-win flag/banner tradition in 1984.
// - Pirates: Jolly Roger at PNC Park started 2001. NOT a 1984 tradition. No special ceremony.
// - Everyone else: In 1984, no other team had a defined park-level win ceremony or flag tradition.
//   Teams played, fans went home. That's it.

const CELEBRATIONS = {
  cubs: {
    render: () => (
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 200 140" className="w-28 h-20 md:w-36 md:h-24 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="0" width="5" height="140" rx="2" fill="#8B7355" />
          <rect x="13" y="4" width="182" height="102" rx="3" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
          <text x="104" y="88" textAnchor="middle" fontFamily="'Oswald', 'Arial Black', sans-serif" fontSize="80" fontWeight="900" fill="#1E3A8A">W</text>
          <line x1="13" y1="55" x2="195" y2="55" stroke="#E5E7EB" strokeWidth="0.5" opacity="0.5" />
          <path d="M40 20 Q70 16 100 20 Q130 24 160 20" fill="none" stroke="#E5E7EB" strokeWidth="0.8" opacity="0.6" />
          <circle cx="12" cy="6" r="3" fill="#A0522D" />
        </svg>
        <div className="text-center">
          <p className="font-heading text-sm font-bold text-primary tracking-wide">CUBS WIN!</p>
          <p className="text-[10px] text-muted-foreground/60 font-heading tracking-wider mt-0.5">THE W IS FLYING AT WRIGLEY</p>
        </div>
      </div>
    ),
  },
};

// Teams with no special 1984 home win tradition get flavor text only
const FLAVOR = {
  tigers:   { emoji: '🐯', line: 'ROAR FROM TIGER STADIUM' },
  padres:   { emoji: '⚾', line: 'VICTORY IN MISSION VALLEY' },
  mets:     { emoji: '🔵🟠', line: 'SHEA STADIUM ROCKS' },
  redsox:   { emoji: '🧦', line: 'FENWAY FAITHFUL GO WILD' },
  yankees:  { emoji: '⚾', line: 'YANKEE STADIUM RISES' },
  orioles:  { emoji: '🐦', line: 'MEMORIAL STADIUM ERUPTS' },
  dodgers:  { emoji: '⚾', line: 'DODGER BLUE WINS IN THE RAVINE' },
  reds:     { emoji: '🔴', line: 'RIVERFRONT CELEBRATES' },
  royals:   { emoji: '👑', line: 'THE FOUNTAINS FLOW AT ROYALS STADIUM' },
  phillies: { emoji: '🔔', line: 'THE VET SHAKES' },
  bluejays: { emoji: '🐦', line: 'EXHIBITION STADIUM CHEERS' },
  indians:  { emoji: '⚾', line: 'THE TRIBE WINS ON THE LAKE' },
  brewers:  { emoji: '⚾', line: 'COUNTY STADIUM CELEBRATES' },
  twins:    { emoji: '⚾', line: 'THE DOME GOES WILD' },
  athletics:{ emoji: '⚾', line: 'OAKTOWN WINS AT THE COLISEUM' },
  angels:   { emoji: '⚾', line: 'THE BIG A SHINES TONIGHT' },
  whitesox: { emoji: '💥', line: 'THE SOUTH SIDE WINS — SCOREBOARD SALUTES!' },
  mariners: { emoji: '⚾', line: 'THE KINGDOME RUMBLES' },
  rangers:  { emoji: '⭐', line: 'ARLINGTON ARENA RISES' },
  expos:    { emoji: '⚾', line: 'LE BIG O FÊTE LA VICTOIRE' },
  cardinals:{ emoji: '🐦', line: 'BUSCH STADIUM CELEBRATES' },
  pirates:  { emoji: '⚾', line: 'THREE RIVERS STADIUM ERUPTS' },
  braves:   { emoji: '⚾', line: 'THE LAUNCHING PAD CELEBRATES' },
  astros:   { emoji: '⭐', line: 'THE ASTRODOME ROARS' },
  giants:   { emoji: '⚾', line: 'CANDLESTICK HOLDS ON FOR THE WIN' },
};

export default function WinCelebration({ teamKey }) {
  const custom = CELEBRATIONS[teamKey];
  if (custom) return custom.render();

  const flavor = FLAVOR[teamKey] || { emoji: '⚾', line: 'HOME TEAM WINS!' };
  return (
    <div className="flex flex-col items-center gap-1 py-1">
      <span className="text-3xl">{flavor.emoji}</span>
      <p className="text-[10px] text-muted-foreground/60 font-heading tracking-wider text-center">{flavor.line}</p>
    </div>
  );
}