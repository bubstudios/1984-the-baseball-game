import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = [
  {
    title: 'Welcome to 1984 Baseball',
    icon: '⚾',
    text: (
      <>
        <strong>A pitch-by-pitch baseball simulation</strong> featuring all 26 authentic 1984 MLB rosters - real players, real ratings, real stadiums.<br />
        <br />
        Call every pitch, swing every bat, and manage every substitution. The CPU handles the opposing team with real baseball AI - pinch-hitting, pitching changes, stolen base attempts, and more.<br />
        <br />
        This guide walks you through everything. You can revisit it anytime with the <strong>?</strong> button on the team selection screen.
      </>
    ),
  },
  {
    title: 'Game Modes',
    icon: '🎮',
    text: (
      <>
        <strong>Exhibition Mode</strong> - Pick any two teams, any ballpark, and play a single game. Great for learning the ropes or quick matchups.<br />
        <br />
        <strong>Season Mode</strong> - Take a team through a full 162-game schedule. The CPU simulates all other league games, tracks standings, stats, and awards. Your starters follow a 4-day rotation. Make the playoffs and chase the World Series.
      </>
    ),
  },
  {
    title: 'Team & Ballpark Selection',
    icon: '🏟️',
    text: (
      <>
        <strong>1. Pick Teams</strong> - Choose your squad and your CPU opponent from all 26 1984 clubs, organized by league and division.<br />
        <br />
        <strong>2. Pick the Ballpark</strong> - Select whose home field to play at. The stadium determines:<br />
        - <strong>DH Rule</strong>: AL parks use a Designated Hitter (pitcher does not bat). NL parks have the pitcher hit.<br />
        - <strong>Weather</strong>: Wind, temperature, and conditions affect gameplay. Domed stadiums have perfect conditions.<br />
        - <strong>Umpire</strong>: A home plate umpire is assigned with their own strike zone personality.
      </>
    ),
  },
  {
    title: 'Setting Your Lineup',
    icon: '📋',
    text: (
      <>
        Build your batting order and assign defensive positions. Each player shows four ratings:<br />
        <br />
        - <strong>C</strong> (Contact) - situational, adjusted by the opposing pitcher. Arrows (▲▼) show the shift.<br />
        - <strong>P</strong> (Power) - situational, adjusted by the opposing pitcher. Arrows (▲▼) show the shift.<br />
        - <strong>S</strong> (Speed) - base rating for stealing and running<br />
        - <strong>D</strong> (Defense) - base fielding ability. Turns amber if the player is out of position.<br />
        <br />
        <strong>Platoon indicators</strong> (▲/▼ icons) show advantage vs the pitcher's handedness: Lefty batters vs RHP = advantage, Righty batters vs LHP = advantage, Switch hitters always have the edge.<br />
        <br />
        <strong>Position penalties</strong>: Playing a player out of position causes defensive penalties. Same-group moves (OF to OF, IF to IF) are minor; cross-group moves (IF to OF) are major. Colored badges warn you.<br />
        <br />
        You also pick your <strong>Starting Pitcher</strong> and, in Exhibition mode, the <strong>Opponent's Starting Pitcher</strong> (which drives the C/P ratings above).
      </>
    ),
  },
  {
    title: 'Player Ratings Explained',
    icon: '📊',
    text: (
      <>
        All ratings are on a <strong>1-10 scale</strong>:<br />
        <br />
        <strong>Hitters:</strong><br />
        - <strong>Contact (C)</strong> - Chance of putting the ball in play. Higher = fewer strikeouts, more hits.<br />
        - <strong>Power (P)</strong> - Extra-base hit potential. Higher = more doubles, triples, home runs.<br />
        - <strong>Speed (S)</strong> - Steal success, stretching singles to doubles, taking extra bases, infield range.<br />
        - <strong>Defense (D)</strong> - Fielding skill at their natural position.<br />
        - <strong>Bunting (B)</strong> - Sacrifice bunt and drag bunt success rate.<br />
        - <strong>Arm (A)</strong> - Outfield throw strength and accuracy.<br />
        <br />
        <strong>Pitchers:</strong><br />
        - <strong>SPD</strong> (Pitch Speed) - Fastball velocity. Higher = harder to hit and steal against.<br />
        - <strong>OFF</strong> (Off-Speed) - Quality of breaking balls and changeups. Higher = more swings and misses.<br />
        - <strong>CTL</strong> (Control) - Strike-throw rate and command. Higher = fewer walks.<br />
        - <strong>STA</strong> (Stamina) - How many innings before fatigue sets in. Tracked separately from tier.
      </>
    ),
  },
  {
    title: 'Pitcher Tiers & Matchups',
    icon: '⚡',
    text: (
      <>
        Every pitcher is assigned a <strong>Tier</strong> based on SPD + OFF + CTL:<br />
        <br />
        - <strong>Elite</strong> (21+): Batter gets <strong>-1</strong> to Contact and Power. Tough arm.<br />
        - <strong>Mid</strong> (17-20): No modifier. Average matchup.<br />
        - <strong>Subpar</strong> (16 or less): Batter gets <strong>+1</strong> to Contact and Power. Soft arm.<br />
        <br />
        This modifier applies to the <strong>active pitcher at the moment of each at-bat</strong>. When you make a pitching change mid-game, the batter ratings update instantly.<br />
        <br />
        The <strong>Matchup Card</strong> in-game shows the current batter vs pitcher with all situational adjustments applied - platoon splits, count effects, fatigue, and pitcher tier - so you always know where you stand.
      </>
    ),
  },
  {
    title: 'When You Are Batting',
    icon: '🏏',
    text: (
      <>
        When your team is at the plate, choose your swing:<br />
        <br />
        - <strong>Normal Swing</strong> - Balanced contact and power. The safe default.<br />
        - <strong>Contact Swing</strong> - +2 contact, -2 power. Put the ball in play, avoid strikeouts.<br />
        - <strong>Power Swing</strong> - +2 power, -2 contact. Swing for the fences, risk missing.<br />
        - <strong>Take Pitch</strong> - Do not swing. Let the pitch go by, hope for a ball.<br />
        - <strong>Bunt</strong> - Lay one down. Good for advancing runners (sacrifice) or surprising the defense.<br />
        <br />
        The CPU pitcher selects pitches and locations against you. Watch the count - your ratings shift based on balls and strikes!
      </>
    ),
  },
  {
    title: 'Base Running',
    icon: '🏃',
    text: (
      <>
        With runners on base, you have options:<br />
        <br />
        - <strong>Steal</strong> - Send a runner on the pitch. Success depends on runner Speed vs catcher Arm and pitcher delivery time. Faster pitches are harder to steal against.<br />
        - <strong>Hit &amp; Run</strong> - The runner goes on the pitch and the batter must swing. If the batter misses, the runner is likely caught stealing. If contact is made, the runner advances extra bases.<br />
        - <strong>Double Steal</strong> - Two runners go at once. Catches the defense off guard but risks two outs.<br />
        <br />
        The CPU also attempts steals when they are batting - watch your pitcher's delivery!
      </>
    ),
  },
  {
    title: 'When You Are Pitching',
    icon: '⚾',
    text: (
      <>
        When your team is in the field, select your pitch:<br />
        <br />
        - <strong>FB</strong> (Fastball) - High velocity. Harder to hit, harder to steal against. Good for getting ahead in the count.<br />
        - <strong>BB</strong> (Breaking Ball) - Slower with movement. Higher strike rate, induces ground balls.<br />
        - <strong>CU</strong> (Changeup) - Speed differential off the fastball. Disrupts timing.<br />
        - <strong>KN</strong> (Knuckleball) - Unpredictable movement. Hard to hit, hard to control.<br />
        - <strong>SC</strong> (Screwball) - Breaks opposite to a curveball. Rare and deceptive.<br />
        - <strong>SF</strong> (Split-Finger) - Drops sharply. Swing-and-miss pitch.<br />
        <br />
        <strong>Specialty Pitches</strong>: Iconic pitchers (Nolan Ryan, Fernando Valenzuela, etc.) have a <strong>Reach Back</strong> specialty pitch. Limited uses per game - starters get 3, relievers get 1. Save them for big moments.<br />
        <br />
        <strong>Intentional Walk</strong>: Give up first base intentionally to set up a force-out or avoid a dangerous hitter.<br />
        <br />
        Watch your pitcher's <strong>stamina bar</strong> - as fatigue builds, control and velocity drop. Bring in a reliever before it is too late!
      </>
    ),
  },
  {
    title: 'Substitutions & Strategy',
    icon: '🔄',
    text: (
      <>
        Tap the <strong>Subs</strong> button (users icon) in the top bar during any half-inning to make changes:<br />
        <br />
        - <strong>Pinch Hit</strong> - Replace the current batter with a bench player. Good for platoon advantages or late-inning power.<br />
        - <strong>Pinch Run</strong> - Replace a runner on base with a faster player. Ideal for scoring on a single or stealing a base.<br />
        - <strong>Defensive Switch</strong> - Move players to different positions or swap in a bench player for better defense.<br />
        - <strong>Change Pitcher</strong> - Bring in a reliever from the bullpen. Choose based on the situation - lefty vs lefty, closer in the 9th, etc.<br />
        <br />
        <strong>Important:</strong> Once a player is substituted out, they cannot re-enter the game. The CPU makes its own substitutions - watch for pinch-hitters and pitching changes!
      </>
    ),
  },
  {
    title: 'The Game Screen',
    icon: '📺',
    text: (
      <>
        The game screen has three tabs at the top:<br />
        <br />
        <strong>Game Tab:</strong><br />
        - <strong>Scoreboard</strong> - Inning-by-inning runs, current score<br />
        - <strong>Diamond</strong> - Visual base runners and their positions<br />
        - <strong>Commentary</strong> - Broadcast-style play-by-play text<br />
        - <strong>Matchup Card</strong> - Current batter vs pitcher with all ratings<br />
        - <strong>Action Panel</strong> - Your controls (pitch selection or swing types)<br />
        - <strong>Event Banners</strong> - Pop-ups for celebrations, caught stealing, ballpark events<br />
        <br />
        <strong>Play Log Tab:</strong><br />
        - Full pitch-by-play log of every event in the game<br />
        - Incident log for arguments, ejections, and beanball events<br />
        <br />
        <strong>Box Score Tab:</strong><br />
        - Complete batting and pitching stats for both teams<br />
        - Updated in real time as the game progresses
      </>
    ),
  },
  {
    title: 'Top Bar & Audio Controls',
    icon: '🔊',
    text: (
      <>
        The top bar contains your game controls:<br />
        <br />
        - <strong>Score &amp; Inning</strong> - Always visible at the top left<br />
        - <strong>Radio Icon</strong> - Toggle <strong>Retro Audio</strong>: crowd noise, stadium organ, bat cracks, and sound effects. Tap to turn on/off.<br />
        - <strong>Speaker Icon</strong> - Toggle <strong>Robot Announcer</strong>: AI-generated voice play-by-play using the home stadium's lead announcer style. Tap to turn on/off.<br />
        - <strong>Users Icon</strong> - Open the <strong>Substitutions</strong> panel (hidden when game is over)<br />
        - <strong>Rotate Icon</strong> - <strong>New Game</strong> / return to menu. In Season Mode, this takes you back to the Season Dashboard.<br />
        - <strong>Help Icon (?)</strong> - Open this tutorial (available on the team selection screen)
      </>
    ),
  },
  {
    title: 'Injuries, Arguments & Beanballs',
    icon: '🚑',
    text: (
      <>
        <strong>Injuries:</strong> Players can get injured during play - batters on swings or HBPs, runners on the basepaths, fielders on diving plays, and pitchers from fatigue. An injury alert modal appears immediately - you must choose a replacement before continuing.<br />
        <br />
        <strong>Pre-Game Illnesses:</strong> Some players may be unavailable due to illness. A modal shows who is sidelined before the game starts.<br />
        <br />
        <strong>Umpire Arguments:</strong> Managers argue close calls. The argument can escalate from a chirp to a full ejection. Ejected managers are replaced by their coach. Some managers are more hot-headed than others!<br />
        <br />
        <strong>Beanball Events:</strong> Hit-by-pitches can trigger warnings, bat flips, bench-clearing tensions, and retaliation. Tension levels build throughout the game.<br />
        <br />
        <strong>Ballpark Events:</strong> Random stadium events can occur between at-bats - from rain delays to wild animals on the field to celebrity sightings.
      </>
    ),
  },
  {
    title: 'Achievements & Baseball Cards',
    icon: '🏆',
    text: (
      <>
        <strong>Baseball Cards:</strong> Win a game and you will earn a 1984 Topps-style baseball card from your team's collection. Cards are awarded after the game-over and card-award windows are closed. Collect them all!<br />
        <br />
        <strong>Achievements:</strong> Unlock milestones throughout your play - first win, first home run, ejections, no-hitters, comebacks, and more. Achievement pop-ups appear after the game ends so you never miss them.<br />
        <br />
        <strong>Season Awards:</strong> In Season Mode, track Player of the Week/Month, MVP, Cy Young, Rookie of the Year, and Manager of the Year. League leaders and standings update as the season progresses.<br />
        <br />
        <strong>Scorecards:</strong> Special records are tracked - longest home run, most runs in a game, and other historic performances.
      </>
    ),
  },
  {
    title: 'Tips & Game Flow',
    icon: '💡',
    text: (
      <>
        <strong>Game Speed:</strong> Sometimes the count jumps ahead (e.g., 1-2 straight to a walk) to keep the game moving. This is intentional - stay focused on the matchup and the next play.<br />
        <br />
        <strong>Strategy Tips:</strong><br />
        - Use <strong>platoon advantages</strong>: Lefty batters hit better vs RHP, righty batters vs LHP. Switch hitters always have the edge.<br />
        - Watch your pitcher's <strong>stamina</strong> - fatigue leads to walks and hard contact. Bring in relievers proactively.<br />
        - <strong>Defense matters</strong>: Do not play players out of position unless absolutely necessary.<br />
        - <strong>Bunting</strong> is useful for advancing runners in close games, especially with a fast hitter.<br />
        - <strong>Pinch-hit</strong> for the pitcher in NL parks when you need offense in the late innings.<br />
        - Save your <strong>Reach Back</strong> specialty pitch for high-leverage moments.<br />
        <br />
        That is it - step up to the plate and play ball!
      </>
    ),
  },
];

const HAS_SEEN_TUTORIAL = 'bb84_tutorial_seen';

export default function TutorialModal({ onClose }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    localStorage.setItem(HAS_SEEN_TUTORIAL, 'true');
  }, []);

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xl">{s.icon}</span>
            <h2 className="font-heading text-base font-bold text-foreground">{s.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 min-h-[160px] max-h-[55vh] overflow-y-auto">
          <div className="font-body text-sm text-muted-foreground leading-relaxed">{s.text}</div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          {/* Step indicator */}
          <span className="text-[10px] font-heading text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </span>

          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={prev} className="h-8 px-3 text-xs font-heading gap-1">
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={isLast ? onClose : next}
              className="h-8 px-4 text-xs font-heading gap-1"
            >
              {isLast ? 'Play Ball!' : 'Next'}
              {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Check if user has seen the tutorial
export function hasSeenTutorial() {
  return localStorage.getItem(HAS_SEEN_TUTORIAL) === 'true';
}