// Red Sox Broadcast - Ned Martin & Bob Montgomery
// Generic pool + rich player-specific tidbits via redSoxPlayerStats.js
import { pickRedSoxPlayerTidbit, pickRedSoxComboLine } from './redSoxPlayerStats';

export function pickRedSoxLine() {
  const totalWeight = Object.values(POOLS).reduce((sum, pool) => sum + pool.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const [category, pool] of Object.entries(POOLS)) {
    roll -= pool.weight;
    if (roll <= 0) return pool.lines[Math.floor(Math.random() * pool.lines.length)];
  }
  return POOLS.fundamentals.lines[0];
}

export function pickRedSoxPlayerLine(playerName) {
  // Use the new rich player tidbit system
  const tidbit = pickRedSoxPlayerTidbit(playerName);
  if (tidbit) return tidbit;

  // Fallback: generic combo line (fires ~12% of the time when no specific tidbit matches)
  if (playerName && Math.random() < 0.12) return pickRedSoxComboLine();

  return null;
}

const POOLS = {
  fundamentals: { weight: 30, lines: [
    "Nicely done.",
    "He stayed with that pitch.",
    "That's good baseball.",
    "Excellent pitch - never had a chance.",
    "A patient hitter - good strike-zone judgment.",
    "Uses the entire field. Professional approach.",
    "Works quickly on the mound. Changes speeds effectively.",
    "Gets ahead in the count. That's the foundation.",
    "Excellent command of the strike zone.",
    "That's a fundamentally sound play.",
    "He's seeing the ball well this evening.",
    "He's been working the count well in this at-bat.",
    "The pitcher is locating his fastball where he wants it.",
    "That's how you work a count - patience rewarded.",
    "Kept the ball down - that's where the outs live.",
    "Good pitch selection - kept the hitter guessing.",
    "He took what the pitcher gave him. That's a mature approach.",
  ]},
  fenway: { weight: 25, lines: [
    "Short porch over there in right - inviting target for left-handed hitters.",
    "Pesky's Pole is just 302 feet away. That's a very short trip for a well-hit ball.",
    "The Triangle out in deep center field - a center fielder's absolute nightmare.",
    "This ballpark has a personality all its own. Every game finds a new way to surprise you.",
    "The Green Monster turns singles into doubles and doubles into singles. It has a mind of its own.",
    "Fenway's dimensions have been confounding hitters and pitchers for over seventy years.",
    "The manual scoreboard on the Monster - still operated by hand. There's a charm to that.",
    "The bullpens out in right field - not the most comfortable place for a reliever to warm up.",
    "The shadows are getting long across the infield. The last few innings at Fenway can be challenging for hitters.",
    "No two games at Fenway are ever quite the same. The wall sees to that.",
    "The crowd is packed tight along the baselines - you're practically sitting on top of the field here.",
    "The Tet '68 flagpole out by the flag court - always gets a few curious looks from first-time visitors.",
    "That tight left field corner - 310 feet to the pole, but the wall shoots straight up from there.",
    "Fenway Park - opened in 1912, same week the Titanic sank. This place has seen some history.",
    "The grounds crew here takes extraordinary pride in this field. You can see it in every blade of grass.",
  ]},
  players: { weight: 18, lines: [
    "The Red Sox lineup is deep - one through nine, you have to work for every out.",
    "That young pitcher has a lively arm. The Red Sox have been developing arms well.",
    "He's hitting over .300 - quietly, as usual. That's the kind of player you appreciate more over time.",
    "The batter has a very compact swing. Not a lot of wasted movement.",
    "He's put together a very nice season. Dependable, day in and day out.",
    "You don't see many hitters with his combination of power and plate discipline.",
    "Consistently productive. You look up at the end of the year and he's hit .350 again.",
    "Ned Martin always said this about Red Sox hitters: they grind out at-bats like few others.",
    "This club has a knack for developing hitters who understand the strike zone.",
    "Bob Montgomery has been impressed with the plate discipline all season.",
    "There's a professionalism to this lineup - they make pitchers earn every out.",
  ]},
  history: { weight: 12, lines: [
    "This ballpark has seen a lot of baseball. Since 1912 - think of all the great players who've stood in that batter's box.",
    "The history here is remarkable. Ted Williams. Carl Yastrzemski. You feel it every time you walk in.",
    "Fenway Park remains one of baseball's treasures. There's nothing else quite like it.",
    "Many great players have worn this uniform. The tradition runs deep in New England.",
    "This franchise has produced some of the game's finest hitters. Williams, Yaz, now Rice and Boggs.",
    "You look around this park and you're reminded of what baseball means to this city.",
    "Generations of New Englanders have grown up watching baseball in this ballpark.",
    "The Red Seat out in right field - marks the spot where Ted Williams hit the longest home run ever measured here.",
    "Fenway has been hosting baseball since before the First World War. That's a lot of ballgames.",
    "Some of the most memorable moments in baseball history have unfolded right here on this field.",
    "Ted Williams hit .406 in 1941. No one's done it since. The Splendid Splinter set a bar that still stands.",
    "Carl Yastrzemski won the Triple Crown in 1967 right here at Fenway. The Impossible Dream season.",
    "The 1975 World Series - Game 6 - Carlton Fisk waving it fair. That happened right over there.",
    "The ghosts of Williams, Yaz, and the Kid still hover around this ballpark if you listen closely enough.",
  ]},
  crowd: { weight: 8, lines: [
    "A knowledgeable crowd here tonight. They've seen a few games in this park.",
    "The fans appreciate good baseball. You don't have to explain the game to this audience.",
    "They've seen a few games in this park - they know when something significant is happening.",
    "Fenway is buzzing. The crowd senses something developing.",
    "They're paying attention now. Every pitch matters at this stage.",
    "The crowd came to life - that's the sound of people who know baseball.",
    "The fans know the significance of this situation.",
    "This crowd is notoriously demanding - and right now, they're fully engaged.",
    "A quiet murmur in the stands. They're watching closely.",
    "The fans are on their feet. They know what's at stake here.",
    "New England baseball fans - there's nothing quite like them. Passionate, knowledgeable, and not afraid to let you know how they feel.",
    "The fans out on Lansdowne Street are peering over the Monster - best seats not in the ballpark.",
    "This is a crowd that's seen Curse talk come and go - they just love good baseball.",
  ]},
  dryHumor: { weight: 4, lines: [
    "Well, that should help.",
    "The Red Sox will gladly take that.",
    "That changes things rather quickly.",
    "Not his finest moment.",
    "He'd like another opportunity there.",
    "That's unfortunate.",
    "That should make the train ride home more pleasant.",
    "The crowd will discuss that one for a while.",
    "Baseball occasionally rewards persistence.",
    "The fans appear unconvinced.",
    "I suspect there are a few people in the grandstand who would have preferred a different outcome.",
    "That was not the intended result.",
    "Perhaps we'll look back on that play with more appreciation later. Much later.",
    "Well. Baseball is a long season.",
    "That's one way to handle that situation. There were others.",
    "Joe Castiglione once said covering the Red Sox keeps you young - or at least keeps you from being bored.",
    "If you bought a scorecard, you might want to hold onto it. This could get complicated.",
  ]},
  signature: { weight: 3, lines: [
    "Ned Martin always said Fenway Park is where dreams and nightmares share the same outfield.",
    "Bob Montgomery always points out that the wall giveth and the wall taketh away.",
    "The Green Monster has a way of humbling everyone eventually.",
    "In New England, baseball isn't a pastime - it's a full-blown religion.",
    "There's something about a night game at Fenway that feels different from anywhere else.",
    "Sometimes you just have to tip your cap. That's baseball.",
    "The great thing about this ballpark is you never know what's going to happen next.",
    "That's the thing about Fenway - the ballpark is as much a character as the players.",
    "If these walls could talk, they'd never stop.",
  ]},
};