# Pitcher Temperament & Composure System — Implementation Roadmap

## Phase 1: Core Engine ✅
**Status:** Complete

Files created:
- `lib/pitcherComposure.js` — Core composure tracking, deltas, recovery, behavior zones
- Integrated into `lib/gameEngine.js` — Pitchers initialized with `_composure` state + archetype

### What's included:
- **Archetype system** (HOTHEAD, STEADY_EDDY, HEADCASE, PROFESSIONAL, FIREBRAND)
- **Behavior zones** (LOCKED_IN, NORMAL, PRESSING, RED_ZONE)
- **Event deltas** (strike +3, homerun -10, walk -3, etc.)
- **Recovery logic** (per-inning recovery based on recovery rating + clean inning bonus)
- **Minor/major action checks** (wild pitch, argument, throwat, walkoff chances)

### Next step:
Wire composure deltas into pitch outcomes and connect behavior zones to pitcher decision-making.

---

## Phase 2: Integration into Pitch Outcomes (Pending)
Apply composure deltas when:
- Strike is thrown
- Ball is thrown
- Hit is achieved
- Walk is issued
- Home run is allowed
- HBP occurs
- Wild pitch occurs

Wire behavioral checks:
- **Locked In:** +5% strike chance, -2% wild pitch chance
- **Normal:** Baseline (no modifiers)
- **Pressing:** +3% wild pitch chance, erratic pitch selection
- **Red Zone:** +8% wild pitch chance, possible "major action" (ejection argument, throw at batter, etc.)

---

## Phase 3: Hitter Composure (Future)
Once pitchers are complete, mirror system for batters:
- Slumps & hot streaks
- Reactions to close pitches (HBP, ejection arguments)
- Clutch modifiers (2-strike/full-count discipline changes)

---

## Archetype Usage

When creating a pitcher (in gameEngine or TEAMS data), add `temperament` field:

```js
{
  name: "Nolan Ryan",
  pos: "SP",
  temperament: "HOTHEAD",  // or: "STEADY_EDDY", "HEADCASE", "PROFESSIONAL", "FIREBRAND"
  // ... rest of pitcher data
}
```

If omitted, defaults to "PROFESSIONAL" (balanced volatility/recovery).

---

## Testing Phase 1

To confirm phase 1 works:
1. Play a game & check browser console: pitcher objects should have `_composure` field
2. Verify `_composure` contains: composure (100), archetype, volatility, recovery, etc.
3. No gameplay changes yet — this is data plumbing.

Next phases will apply these values to actual pitch outcomes.