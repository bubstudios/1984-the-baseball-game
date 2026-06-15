// Teams and player rosters
export const TEAMS = {
  home: {
    name: "Orioles",
    abbr: "BAL",
    color: "#DF4601",
    players: [
      { name: "Cal Ripken Jr.", pos: "SS", avg: .318, power: 85, speed: 55, defense: 90, arm: 88 },
      { name: "Eddie Murray", pos: "1B", avg: .305, power: 90, speed: 40, defense: 82, arm: 70 },
      { name: "Frank Robinson", pos: "RF", avg: .294, power: 92, speed: 60, defense: 75, arm: 80 },
      { name: "Brooks Robinson", pos: "3B", avg: .267, power: 65, speed: 45, defense: 98, arm: 95 },
      { name: "Jim Palmer", pos: "CF", avg: .278, power: 55, speed: 72, defense: 85, arm: 75 },
      { name: "Boog Powell", pos: "DH", avg: .266, power: 88, speed: 30, defense: 60, arm: 55 },
      { name: "Roberto Alomar", pos: "2B", avg: .310, power: 55, speed: 80, defense: 92, arm: 82 },
      { name: "Rick Dempsey", pos: "C", avg: .233, power: 45, speed: 35, defense: 90, arm: 92 },
      { name: "Ken Singleton", pos: "LF", avg: .282, power: 70, speed: 50, defense: 78, arm: 72 },
    ],
    pitchers: [
      { name: "Jim Palmer", pos: "SP", era: 2.86, velocity: 88, control: 92, stamina: 90, stuff: 85 },
      { name: "Mike Mussina", pos: "SP", era: 3.68, velocity: 85, control: 90, stamina: 85, stuff: 88 },
      { name: "Tippy Martinez", pos: "RP", era: 3.45, velocity: 82, control: 78, stamina: 50, stuff: 80 },
      { name: "Gregg Olson", pos: "CL", era: 2.16, velocity: 90, control: 75, stamina: 40, stuff: 92 },
    ],
    bench: [
      { name: "Terry Crowley", pos: "PH", avg: .275, power: 60, speed: 35, defense: 50, arm: 50 },
      { name: "Al Bumbry", pos: "PH", avg: .281, power: 40, speed: 82, defense: 80, arm: 70 },
    ]
  },
  away: {
    name: "Yankees",
    abbr: "NYY",
    color: "#003087",
    players: [
      { name: "Derek Jeter", pos: "SS", avg: .310, power: 60, speed: 75, defense: 78, arm: 76 },
      { name: "Don Mattingly", pos: "1B", avg: .307, power: 78, speed: 45, defense: 92, arm: 80 },
      { name: "Mickey Mantle", pos: "CF", avg: .298, power: 95, speed: 85, defense: 82, arm: 85 },
      { name: "Lou Gehrig", pos: "DH", avg: .340, power: 93, speed: 55, defense: 85, arm: 78 },
      { name: "Reggie Jackson", pos: "RF", avg: .262, power: 94, speed: 60, defense: 68, arm: 82 },
      { name: "Yogi Berra", pos: "C", avg: .285, power: 72, speed: 40, defense: 88, arm: 90 },
      { name: "Graig Nettles", pos: "3B", avg: .248, power: 75, speed: 50, defense: 90, arm: 88 },
      { name: "Willie Randolph", pos: "2B", avg: .276, power: 35, speed: 70, defense: 88, arm: 80 },
      { name: "Dave Winfield", pos: "LF", avg: .290, power: 86, speed: 65, defense: 82, arm: 90 },
    ],
    pitchers: [
      { name: "Whitey Ford", pos: "SP", era: 2.75, velocity: 84, control: 95, stamina: 88, stuff: 85 },
      { name: "Ron Guidry", pos: "SP", era: 3.29, velocity: 92, control: 82, stamina: 82, stuff: 90 },
      { name: "Sparky Lyle", pos: "RP", era: 2.90, velocity: 85, control: 80, stamina: 55, stuff: 82 },
      { name: "Mariano Rivera", pos: "CL", era: 2.21, velocity: 92, control: 95, stamina: 45, stuff: 95 },
    ],
    bench: [
      { name: "Oscar Gamble", pos: "PH", avg: .265, power: 72, speed: 40, defense: 55, arm: 55 },
      { name: "Roy White", pos: "PH", avg: .271, power: 50, speed: 70, defense: 76, arm: 72 },
    ]
  }
};

export const PITCH_TYPES = [
  { name: "Fastball", icon: "🔥", speed: "high", breakChance: 0.15 },
  { name: "Curveball", icon: "🌀", speed: "low", breakChance: 0.35 },
  { name: "Slider", icon: "💨", speed: "medium", breakChance: 0.28 },
  { name: "Changeup", icon: "🎭", speed: "low", breakChance: 0.22 },
];

export const SWING_TYPES = [
  { name: "Swing", icon: "⚾", desc: "Full swing" },
  { name: "Contact", icon: "👆", desc: "Contact swing — higher chance to put in play" },
  { name: "Power", icon: "💪", desc: "Power swing — extra base hit or miss" },
  { name: "Take", icon: "👁️", desc: "Don't swing — take the pitch" },
  { name: "Bunt", icon: "🤏", desc: "Sacrifice bunt — advance runners" },
];