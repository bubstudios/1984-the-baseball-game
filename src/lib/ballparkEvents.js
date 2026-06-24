// Ballpark Events — 1984 flavor: uncommon, colorful, rarely affecting gameplay
// 20-30% chance per game of at least one event; most are just atmosphere

const RARITY = {
  common: 0,    // ~40% of triggered events
  uncommon: 1,  // ~35%
  rare: 2,      // ~20%
  legendary: 3, // ~5%
};

const CATEGORIES = {
  fans: "Fans & Crowd",
  equipment: "Equipment",
  stadium: "Stadium",
  grounds: "Grounds Crew",
  weather: "Weather",
  animals: "Animals",
  umpire: "Umpires",
  player: "Player Oddities",
  retro: "Classic 1984",
  legendary: "Legendary",
};

// Full event catalog
export const BALLPARK_EVENTS = [
  // ── FANS & CROWD ──
  { id: "streaker", category: "fans", text: "Streaker on the field! Security is in hot pursuit.", delay: 60, rarity: "rare", effects: { crowdBoost: 20 } },
  { id: "fan_on_field", category: "fans", text: "A fan has jumped onto the field and is being escorted away by security.", delay: 45, rarity: "uncommon" },
  { id: "fan_catches_live", category: "fans", text: "A fan reached over and grabbed a live ball — the umpires are discussing fan interference.", delay: 25, rarity: "uncommon" },
  { id: "beach_ball", category: "fans", text: "A beach ball is bouncing through the crowd — classic summer ballpark scene.", delay: 10, rarity: "common" },
  { id: "fan_throws_object", category: "fans", text: "A fan has thrown something onto the field. A warning is issued.", delay: 15, rarity: "uncommon" },
  { id: "marriage_proposal", category: "fans", text: "A marriage proposal just appeared on the scoreboard! She said yes!", delay: 0, rarity: "uncommon" },
  { id: "celebrity_sighting", category: "fans", text: "The camera just found a local celebrity in the stands — the crowd gives a warm ovation.", delay: 0, rarity: "uncommon" },
  { id: "kids_chasing_foul", category: "fans", text: "A group of kids are scrambling down the aisle after a foul ball — the chase is on!", delay: 15, rarity: "common" },
  { id: "vendor_spill", category: "fans", text: "A vendor has dropped a tray of hot dogs — the fans near the aisle are helping clean it up.", delay: 10, rarity: "common" },

  // ── EQUIPMENT ──
  { id: "broken_bat", category: "equipment", text: "Broken bat shard flies toward the mound — grounds crew clears the field.", delay: 10, rarity: "common", requiresContact: true },
  { id: "cracked_helmet", category: "equipment", text: "The batter's helmet has cracked — he'll need a replacement before continuing.", delay: 20, rarity: "uncommon" },
  { id: "mask_strap", category: "equipment", text: "The catcher's mask strap has broken — the backup mask is being brought out.", delay: 30, rarity: "uncommon" },
  { id: "broken_belt", category: "equipment", text: "The pitcher has broken his belt! A clubhouse attendant is sprinting out with a new one.", delay: 45, rarity: "rare" },
  { id: "glove_tear", category: "equipment", text: "The first baseman's glove has a tear — he'll need a replacement mitt.", delay: 35, rarity: "uncommon" },
  { id: "chest_protector", category: "equipment", text: "The catcher's chest protector needs adjusting — brief pause while the trainer fixes the strap.", delay: 25, rarity: "uncommon" },
  { id: "broken_shoelace", category: "equipment", text: "A player has broken a shoelace and is waved over to the batboy for a quick fix.", delay: 15, rarity: "uncommon" },

  // ── STADIUM ──
  { id: "lights_flicker", category: "stadium", text: "The lights just flickered briefly — the stadium crew confirms everything is stable.", delay: 20, rarity: "uncommon" },
  { id: "partial_power", category: "stadium", text: "Partial power outage in the outfield — we'll have a brief delay while it's restored.", delay: 120, rarity: "rare" },
  { id: "scoreboard_fail", category: "stadium", text: "The scoreboard is malfunctioning — the manual scoreboard crew is springing into action.", delay: 30, rarity: "uncommon" },
  { id: "pa_failure", category: "stadium", text: "The PA system has cut out — the announcer is gesturing silently while the technicians scramble.", delay: 60, rarity: "uncommon" },
  { id: "elevator_stuck", category: "stadium", text: "An elevator appears to be stuck between levels — stadium personnel are on it, no cause for alarm.", delay: 0, rarity: "rare" },
  { id: "bullpen_phone", category: "stadium", text: "The bullpen phone has failed! The manager is reduced to hand signals to the relievers.", delay: 0, rarity: "rare" },
  { id: "dugout_leak", category: "stadium", text: "A water leak in the dugout — players are shuffling around while the groundskeeper investigates.", delay: 30, rarity: "uncommon" },
  { id: "sprinklers", category: "stadium", text: "The sprinklers have accidentally activated near the warning track! Grounds crew is sprinting to shut them off.", delay: 60, rarity: "legendary" },
  { id: "organist_playing", category: "stadium", text: "The organist has started playing during the at-bat — the umpire is signaling to cut the music.", delay: 10, rarity: "uncommon" },
  { id: "organist_wrong", category: "stadium", text: "The organist just played 'Take Me Out to the Ballgame' in the third inning. Someone's getting a talking-to.", delay: 0, rarity: "rare" },

  // ── GROUNDS CREW ──
  { id: "loose_base", category: "grounds", text: "First base has come loose! The grounds crew is running out to re-anchor it.", delay: 40, rarity: "uncommon", effects: { momentumReset: true }, requiresContact: true },
  { id: "home_plate_shifted", category: "grounds", text: "Home plate has shifted — the crew is digging it out and resetting it.", delay: 35, rarity: "uncommon" },
  { id: "mound_repair", category: "grounds", text: "The mound needs a quick repair — the head groundskeeper is out with a rake and tamp.", delay: 25, rarity: "uncommon" },
  { id: "divot_infield", category: "grounds", text: "A large divot in the infield dirt — grounds crew fills it in quickly.", delay: 15, rarity: "common" },
  { id: "missed_spot", category: "grounds", text: "The grounds crew missed a wet spot near third base — they're toweling it off now.", delay: 20, rarity: "uncommon" },
  { id: "chalk_repaint", category: "grounds", text: "The chalk line down the first base side has faded — grounds crew repaints it between innings.", delay: 0, rarity: "common" },
  { id: "bullpen_mound", category: "grounds", text: "The visiting bullpen mound needs a quick repair — relievers step back while the crew works.", delay: 30, rarity: "uncommon" },

  // ── WEATHER ──
  { id: "light_rain", category: "weather", text: "A light rain has started falling — the umpires are monitoring conditions.", delay: 0, rarity: "uncommon", effects: { pitcherStaminaBoost: 5 } },
  { id: "fog_rolls_in", category: "weather", text: "Fog is rolling in — outfielders are having trouble tracking fly balls.", delay: 0, rarity: "rare" },
  { id: "wind_gust", category: "weather", text: "A strong wind gust just swept across the field — the flags are standing straight out.", delay: 0, rarity: "uncommon" },
  { id: "dust_devil", category: "weather", text: "A dust devil just spun through the infield! Dirt and hot dog wrappers everywhere.", delay: 15, rarity: "rare" },
  { id: "lightning_nearby", category: "weather", text: "Lightning spotted nearby — the umpires are conferring about a possible delay.", delay: 60, rarity: "rare" },
  { id: "temp_drop", category: "weather", text: "A sudden temperature drop — fans are reaching for jackets while the pitchers try to stay loose.", delay: 0, rarity: "uncommon" },
  { id: "sun_glare", category: "weather", text: "The batter has stepped out — the sun is right in his eyes and he needs a moment.", delay: 20, rarity: "common" },

  // ── ANIMALS ──
  { id: "dog_on_field", category: "animals", text: "A dog has wandered onto the field! The outfielders are trying to coax it toward the dugout.", delay: 90, rarity: "rare", effects: { morale: 5 } },
  { id: "cat_on_field", category: "animals", text: "A cat has found its way into the outfield. The grounds crew is trying to catch it — good luck.", delay: 60, rarity: "rare" },
  { id: "bird_delays", category: "animals", text: "A bird is refusing to leave the batter's box — the umpire is waving his arms but it's not budging.", delay: 25, rarity: "uncommon" },
  { id: "bird_hit", category: "animals", text: "The batted ball struck a bird! The bird appears okay — it flew off toward the outfield.", delay: 15, rarity: "legendary", requiresContact: true },
  { id: "squirrel", category: "animals", text: "A squirrel is sprinting across the infield! The crowd cheers as it dodges the shortstop.", delay: 20, rarity: "uncommon" },
  { id: "bee_swarm", category: "animals", text: "A swarm of bees has settled near the on-deck circle! Players are being moved to safety.", delay: 120, rarity: "rare", effects: { concentrationPenalty: 2 } },
  { id: "seagulls", category: "animals", text: "A flock of seagulls has landed in the outfield — they're completely ignoring the game.", delay: 30, rarity: "uncommon" },
  { id: "bat_flying", category: "animals", text: "A bat is circling the stadium lights — the crowd is split between watching the game and the bat.", delay: 0, rarity: "uncommon" },
  { id: "hawk_lands", category: "animals", text: "A hawk has landed on the center field fence and is surveying the field — beautiful bird.", delay: 0, rarity: "rare" },

  // ── UMPIRE ──
  { id: "ump_loses_indicator", category: "umpire", text: "The home plate umpire has dropped his indicator — the second base ump is lending him a spare.", delay: 20, rarity: "uncommon" },
  { id: "ump_hit_by_ball", category: "umpire", text: "The umpire was hit by a foul ball — he's shaking it off but the crew is checking on him.", delay: 40, rarity: "uncommon" },
  { id: "ump_medical", category: "umpire", text: "An umpire needs a quick medical check after taking a pitch off the mask — he'll be fine, just a brief pause.", delay: 50, rarity: "rare" },
  { id: "ump_crew_conference", category: "umpire", text: "The umpire crew is huddling up — they're discussing a rule interpretation.", delay: 25, rarity: "uncommon" },
  { id: "wrong_count_board", category: "umpire", text: "The scoreboard is showing the wrong count — the umpire signals the correction to the press box.", delay: 10, rarity: "uncommon" },
  { id: "ump_pants_rip", category: "umpire", text: "The umpire's pants have ripped! He's trying to continue while looking extremely uncomfortable.", delay: 20, rarity: "legendary" },

  // ── PLAYER ODDITIES ──
  { id: "contact_lens", category: "player", text: "A player has lost a contact lens — the trainer is out with a spare and the infield is scanning the dirt.", delay: 45, rarity: "rare" },
  { id: "sunglasses_broken", category: "player", text: "The right fielder's sunglasses just snapped — he's signaling to the dugout for a replacement pair.", delay: 20, rarity: "uncommon" },
  { id: "loses_grip", category: "player", text: "The pitcher lost his grip on the ball mid-windup — it slipped out and rolled toward the third base coach.", delay: 10, rarity: "uncommon" },
  { id: "new_bat", category: "player", text: "The batter is requesting a different bat from the batboy — he's testing the weight of a few options.", delay: 25, rarity: "common" },
  { id: "uniform_tear", category: "player", text: "A player's uniform has torn during a slide — the clubhouse manager is bringing out a fresh jersey.", delay: 35, rarity: "uncommon" },
  { id: "cleat_issue", category: "player", text: "A player's cleat spike has come loose — he's doing emergency maintenance in the on-deck circle.", delay: 15, rarity: "uncommon" },
  { id: "blood_rule", category: "player", text: "Blood rule situation — the trainer is checking a small cut and the player will need a moment.", delay: 30, rarity: "uncommon" },
  { id: "cramp", category: "player", text: "A player is dealing with a cramp — the trainer is out stretching him while play pauses.", delay: 40, rarity: "uncommon" },

  // ── CLASSIC 1984 ──
  { id: "camera_cable", category: "retro", text: "The camera crew on the third base side is wrestling with a tangled cable — pure 1984 television magic.", delay: 0, rarity: "uncommon" },
  { id: "broadcast_interrupt", category: "retro", text: "The radio broadcast feed was briefly interrupted — somewhere a technician is frantically swapping cables.", delay: 0, rarity: "uncommon" },
  { id: "ball_boy_goof", category: "retro", text: "The ball boy accidentally fielded a live ball! The home plate umpire is explaining that he can't do that.", delay: 15, rarity: "rare" },
  { id: "wrong_batter", category: "retro", text: "The public address announcer just introduced the wrong batter — the correction is coming with a sheepish apology.", delay: 0, rarity: "uncommon" },

  // ── LEGENDARY ──
  { id: "base_completely_out", category: "legendary", text: "First base has come completely out of the ground! The grounds crew is digging a new hole for it.", delay: 60, rarity: "legendary" },
  { id: "bank_of_lights", category: "legendary", text: "An entire bank of lights has gone dark — the stadium crew is investigating the circuit breaker.", delay: 180, rarity: "legendary" },
  { id: "power_failure", category: "legendary", text: "Power failure in the surrounding neighborhood — we're running on emergency lights for the moment.", delay: 240, rarity: "legendary" },
  { id: "fireworks_accidental", category: "legendary", text: "The fireworks have accidentally been triggered! The sky above the stadium is exploding with color mid-inning!", delay: 30, rarity: "legendary" },
  { id: "mascot_ejected", category: "legendary", text: "The mascot has been ejected by the umpire! You have to see it to believe it.", delay: 45, rarity: "legendary" },
  { id: "ball_in_jersey", category: "legendary", text: "The ball got stuck inside a player's jersey! The umpire is trying to fish it out while everyone laughs.", delay: 30, rarity: "legendary", requiresContact: true },
  { id: "two_balls_field", category: "legendary", text: "There are two baseballs on the field at the same time! Someone threw one in from the bullpen by accident.", delay: 15, rarity: "legendary" },
  { id: "anthem_return", category: "legendary", text: "The national anthem singer from earlier has returned to the field — apparently there was a mix-up about the recognition ceremony.", delay: 60, rarity: "legendary" },

  // ── MORE FANS & CROWD ──
  { id: "giveaway_night", category: "fans", text: "It's giveaway night — fans are holding up replica jerseys and the crowd looks like a sea of team colors.", delay: 0, rarity: "common" },
  { id: "coast_guard_flyover", category: "fans", text: "A Coast Guard helicopter just did a low flyover — the crowd erupted with cheers!", delay: 0, rarity: "rare" },
  { id: "banner_plane", category: "fans", text: "A small plane is circling the stadium dragging a banner — 'HAPPY BIRTHDAY MOM' — the crowd waves at the sky.", delay: 0, rarity: "uncommon" },
  { id: "rubber_chicken", category: "fans", text: "Someone in the bleachers is waving a rubber chicken on a fishing pole — this has been going on for three innings.", delay: 0, rarity: "uncommon" },
  { id: "wave_starts", category: "fans", text: "The wave has broken out in the upper deck — it's making its third lap around the stadium.", delay: 0, rarity: "common" },
  { id: "costume_contest", category: "fans", text: "A group of fans dressed as superheroes just ran onto the concourse — apparently a costume contest broke out.", delay: 0, rarity: "uncommon" },
  { id: "twins", category: "fans", text: "The camera just found identical twins sitting side-by-side wearing matching jerseys — they're waving in perfect sync.", delay: 0, rarity: "common" },

  // ── MORE STADIUM ──
  { id: "tarp_slip", category: "stadium", text: "The grounds crew is practicing the tarp pull — they've almost got it nailed down but someone slipped on a corner.", delay: 30, rarity: "uncommon" },
  { id: "vendors_fight", category: "stadium", text: "Two hot dog vendors are arguing over territory near the third base line — the crowd is picking sides.", delay: 15, rarity: "uncommon" },
  { id: "net_catch", category: "stadium", text: "A foul ball has tangled itself in the backstop netting — the umpire is poking at it with a bat.", delay: 25, rarity: "uncommon" },
  { id: "water_main", category: "stadium", text: "A water main has burst near the concessions! Stadium employees are frantically redirecting foot traffic.", delay: 45, rarity: "rare" },
  { id: "pigeon_problem", category: "stadium", text: "Pigeons have taken over section 412 — stadium staff is attempting to relocate them with limited success.", delay: 0, rarity: "uncommon" },
  { id: "garbage_can", category: "stadium", text: "A garbage can lid has blown onto the warning track — a ball boy is sprinting out to grab it before a ball finds it.", delay: 10, rarity: "uncommon" },

  // ── MORE PLAYER ODDITIES ──
  { id: "interference_discussion", category: "player", text: "Players from both teams are having an impromptu conference near second base — appears to be about a pickoff move.", delay: 20, rarity: "uncommon" },
  { id: "batboy_error", category: "player", text: "The batboy just brought out the wrong bat — the batter is sending him back with very specific instructions.", delay: 15, rarity: "common" },
  { id: "pine_tar_check", category: "player", text: "The umpire is inspecting the pitcher's glove — the opposing manager is pointing at something near the wrist.", delay: 30, rarity: "rare" },
  { id: "runner_missed_bag", category: "player", text: "The first base coach is insisting the runner missed the bag — there's a lengthy discussion with the umpire.", delay: 20, rarity: "uncommon" },

  // ── MORE RETRO 1984 ──
  { id: "transistor_radio", category: "retro", text: "The camera just found a fan holding a transistor radio to his ear — listening to the game while watching it live, 1984 style.", delay: 0, rarity: "common" },
  { id: "polaroid_fan", category: "retro", text: "A fan near the dugout is taking photos with a Polaroid camera — the flash keeps going off between pitches.", delay: 0, rarity: "uncommon" },
  { id: "boombox", category: "retro", text: "Someone has brought a boombox into the bleachers — the usher is politely asking them to turn it off.", delay: 0, rarity: "uncommon" },
  { id: "rotary_phone", category: "retro", text: "The press box phone is a rotary — a reporter just got tangled in the cord trying to file his story.", delay: 0, rarity: "rare" },

  // ── TEAM-SPECIFIC ──
  // Reds-only Easter egg: Riverfront Streaker
  {
    id: "reds_streaker",
    category: "legendary",
    text: "A streaker has vaulted the fence at Riverfront! A gentleman wearing nothing but a large sombrero and carrying a pillow and a Spock bust is sprinting across the outfield. Security is baffled. The crowd loves it.",
    delay: 60,
    rarity: "rare",
    team: "reds",
  },

  // ── LEGENDARY: Rainbow-Mane Horse ──
  // Rarer than all other events — only rolls into the legendary pool (5% of event rolls),
  // and then only a fraction of legendary picks will be this one.
  {
    id: "rainbow_horse",
    category: "legendary",
    text: "A horse with a flowing rainbow-colored mane has wandered onto the field! It trots calmly across the outfield, mane shimmering in the sunlight, as players and umpires stare in disbelief. Grounds crew members approach cautiously with buckets of oats. The crowd has gone absolutely bonkers. Nobody can explain where it came from or where it's going.",
    delay: 90,
    rarity: "legendary",
    weight: 0.15, // only 15% of legendary-pool picks become the rainbow horse
  },
];

// ── Roll for events ──
// Called at the start of each half-inning; ~20-30% of games have at least one event.

// Track if we've already had an event this game (one per game is enough)
let eventFired = false;

export function resetBallparkEvents() {
  eventFired = false;
}

export function rollBallparkEvent(gameState) {
  if (!gameState || gameState.gameOver || eventFired) return null;

  // ~5% chance per half-inning → roughly 30% of 9-inning games get an event
  if (Math.random() > 0.05) return null;

  // Even if the roll passes, only one event per game
  eventFired = true;

  // Determine if the last play involved bat-on-ball contact
  const lastPlayType = gameState.lastPlay?.type;
  const contactTypes = ['single','double','triple','homerun','groundout','flyout','lineout','popout','foul','error','sacfly','fc','doubleplay'];
  const hadContact = contactTypes.includes(lastPlayType);

  // Weight by rarity
  const roll = Math.random();
  let pool;
  if (roll < 0.40) pool = BALLPARK_EVENTS.filter(e => e.rarity === "common");
  else if (roll < 0.75) pool = BALLPARK_EVENTS.filter(e => e.rarity === "uncommon");
  else if (roll < 0.95) pool = BALLPARK_EVENTS.filter(e => e.rarity === "rare");
  else pool = BALLPARK_EVENTS.filter(e => e.rarity === "legendary");

  // Filter out contact-required events when there was no contact
  if (!hadContact) {
    pool = pool.filter(e => !e.requiresContact);
  }

  // Filter team-specific events — only include when the right team is playing
  const homeTeam = gameState.homeTeam;
  const awayTeam = gameState.awayTeam;
  const poolBeforeTeam = [...pool];
  pool = pool.filter(e => {
    if (!e.team) return true; // not team-specific — always include
    return e.team === homeTeam || e.team === awayTeam;
  });
  // If the team filter eliminated everything, fall back to the original pool without team filtering
  if (pool.length === 0) pool = poolBeforeTeam.filter(e => !e.team);

  if (pool.length === 0) pool = BALLPARK_EVENTS.filter(e => hadContact || !e.requiresContact);
  if (pool.length === 0) return null;

  // ── Weighted selection: events with a `weight` property are rarer ──
  // An event with weight 0.15 has a 15% chance of being selected from the pool
  // (vs. equal share with all other non-weighted events).
  const weighted = pool.filter(e => typeof e.weight === 'number');
  const normal = pool.filter(e => typeof e.weight !== 'number');

  if (weighted.length > 0 && normal.length > 0) {
    // First decide: weighted event or normal event?
    const totalWeight = weighted.reduce((s, e) => s + e.weight, 0);
    const weightedShare = totalWeight / (totalWeight + normal.length);
    if (Math.random() < weightedShare) {
      // Pick among weighted events proportional to their weights
      let r = Math.random() * totalWeight;
      for (const e of weighted) {
        r -= e.weight;
        if (r <= 0) return e;
      }
      return weighted[weighted.length - 1];
    }
    // Otherwise pick a normal event
    return normal[Math.floor(Math.random() * normal.length)];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Apply gameplay effects ──
export function applyBallparkEventEffects(event, gameState) {
  if (!event || !event.effects) return null;

  const effects = { ...event.effects, text: event.text };
  return effects;
}