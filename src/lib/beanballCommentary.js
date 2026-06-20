// Beanball Commentary — team-specific calls for HBP, retaliation, celebrations, collisions

// ── HBP CALLS ──
const HBP_GENERIC = [
  "OH, he got drilled! That one got away from him.",
  "Hit by the pitch! The batter is not happy.",
  "That's going to leave a mark — he got plunked.",
  "He got smoked! Right in the ribs.",
  "The batter takes exception — he's staring out at the mound.",
];

const HBP_REVENGE = [
  "That looked intentional. The batter is pointing at the pitcher — he remembers that home run.",
  "He drilled him! The benches are stirring — that was payback.",
  "Message sent. That was for the homer earlier.",
];

const HBP_RETALIATION = [
  "Here we go — that's retaliation! Both dugouts are on their feet.",
  "That's payback for earlier! The umpires are already stepping in.",
  "He threw at him deliberately! This game is getting heated.",
];

const HBP_CELEBRATION = [
  "That's for the bat flip! The pitcher made him pay for showing him up.",
  "He didn't appreciate the celebration — and he just let him know it.",
];

const HBP_AFTER_WARNING = [
  "After the warnings — and that's going to cost him! The umpire is already reaching for the lineup card.",
  "He hit him after the warnings were issued! He's gotta go!",
];

// ── TEAM-SPECIFIC HBP ──
const HBP_TEAM_CALLS = {
  cubs: [
    "HOLY COW! He drilled him!",
    "Oh boy, he got him — and Wrigley is buzzing!",
  ],
  redsox: [
    "He drilled him — and the Fenway faithful are letting him hear it.",
    "The batter's staring out there — this could get interesting.",
  ],
  tigers: [
    "He got him with that one — and the batter isn't happy about it.",
    "A little chin music — the batter's jawing at the mound.",
  ],
  yankees: [
    "Holy Cow! He got drilled — and the Bronx crowd is on its feet!",
    "That one had intent. The batter is not happy at all.",
  ],
  dodgers: [
    "He got him — that was close to the chin. The batter stares out toward the mound.",
    "That pitch got away — or did it? The batter thinks it was intentional.",
  ],
  padres: [
    "Oh Doctor! He hit him — and the batter wants answers.",
    "He got drilled! Jerry, I think that was no accident.",
  ],
  mets: [
    "He drilled him — and the Mets dugout is on the top step!",
    "That one had a message attached to it.",
  ],
  orioles: [
    "He got him — the hitter's not happy.",
    "That pitch found the batter's ribs.",
  ],
  reds: [
    "He got hit — the benches are stirring at Riverfront.",
    "That one got away... or did it?",
  ],
  royals: [
    "He plunked him — the Royals dugout is barking.",
    "That one had purpose behind it.",
  ],
};

// ── UMPIRE WARNINGS ──
const WARNING_GENERIC = [
  "The umpire is stepping out in front of home plate — both dugouts are being warned.",
  "Warnings have been issued to both benches. The next one could mean ejections.",
  "The umpire points to both dugouts — that's a warning. No more.",
];

const WARNING_TEAM = {
  cubs: ["The umpire has seen enough — both sides are on notice.", "Harry's not happy — 'Nobody wants to see this!' Both benches warned."],
  redsox: ["The home plate umpire has had enough. Both managers are warned.", "Ned Martin: 'This has been brewing for a while.' Warnings issued."],
  tigers: ["The umpire steps out — warnings to both benches. Let's keep playing baseball.", "Ernie Harwell: 'The umpire is restoring order.' Both sides warned."],
  yankees: ["The ump marches toward both dugouts — that's the warning. Settle down.", "'Enough is enough,' the umpire says. Warnings to both sides."],
  dodgers: ["Vin Scully: 'The umpire is stepping in to keep the peace.' Both dugouts warned.", "The home plate umpire cautions both benches."],
  padres: ["Oh Doctor! The umpire's calling time — warnings to both sides!", "Jerry Coleman: 'The ump has had enough of the nonsense.' Warnings issued."],
  mets: ["The umpire points to both dugouts. That's your warning — next one is an ejection.", "Both managers have been put on notice by the umpire."],
  orioles: ["The umpire calls both managers out — that's the warning.", "Both dugouts are on notice."],
  reds: ["The umpire issues warnings to both benches at Riverfront.", "That's the warning from the home plate umpire."],
  royals: ["The umpire steps out — both dugouts warned at Royals Stadium.", "Denny Matthews: 'The umpire's had enough.' Both sides warned."],
};

// ── EJECTIONS ──
const EJECTION_GENERIC = [
  "HE'S GONE! The umpire tosses him — ejection!",
  "The manager is out of here! He got his money's worth.",
  "Ejected! The manager erupts and the umpire shows him the door.",
];

const EJECTION_TEAM = {
  cubs: ["HOLY COW, HE'S TOSSED!", "The manager is done — Harry can't believe it!"],
  redsox: ["He's been ejected! The Fenway crowd is letting the umpire hear it.", "The manager is gone — and the boos are raining down from every corner of Fenway."],
  tigers: ["He's been ejected — and he's giving the umpire an earful on the way out.", "The manager is heading for an early shower."],
  yankees: ["He's out of here! The Bronx is booing the umpire!", "Ejected! Billy Martin would be proud of that argument."],
  dodgers: ["Vin Scully: 'And the manager has been ejected.' He'll watch the rest from the clubhouse.", "He's tossed — a rare display of emotion at Chavez Ravine."],
  padres: ["Oh Doctor! He's gone! The manager is ejected!", "Jerry Coleman: 'You can hang a star on that ejection!' He's out of here!"],
  mets: ["He's tossed! Shea Stadium is going absolutely crazy!", "The manager is gone — and he's letting the umpire know exactly how he feels."],
  orioles: ["He's been ejected! The Memorial Stadium crowd erupts.", "The manager is thrown out of the ballgame."],
  reds: ["He's gone! Joe Nuxhall: 'The skipper has been run!'", "The manager heads to the Riverfront clubhouse — ejected."],
  royals: ["He's tossed! The Royals manager is heading for the showers.", "Denny Matthews: 'And the manager has been ejected from the ballgame.'"],
};

// ── BAT FLIP COMMENTARY ──
const BAT_FLIP_GENERIC = [
  "He pimped that one! The pitcher is definitely taking notes.",
  "Bat flip! That's going to show up on film.",
  "He admired that home run for a moment — the pitcher did NOT look pleased.",
];

const BAT_FLIP_TEAM = {
  cubs: ["HOLY COW! He launched one AND a bat flip!", "That bat is still spinning. The pitcher is staring."],
  redsox: ["He gave that one a ride AND a toss. The pitcher's not smiling.", "Bat flip at Fenway — that'll get the other dugout buzzing."],
  tigers: ["He stood and watched... then the bat goes flying. The pitcher is fuming.", "A little bit of flair there — and the pitcher noticed."],
  yankees: ["He admired it for just a second too long. The pitcher is NOT happy.", "That was a statement — and the pitcher read it loud and clear."],
  dodgers: ["He watched that one for a beat — some would call that showing up the pitcher.", "Vin Scully: 'Did he need to watch that one? The pitcher thinks not.'"],
  padres: ["Oh Doctor! He flipped the bat and the pitcher is absolutely fuming!", "That was a bat flip with attitude."],
  mets: ["He pimped that one — and the pitcher is making a mental note.", "The bat goes airborne! Shea loves it — the mound doesn't."],
  orioles: ["He admired his work there. The pitcher didn't appreciate it.", "Bat flip in Baltimore — the crowd loves it."],
  reds: ["He flipped it! The bat goes skyward and the pitcher stares.", "A little extra flair from the Reds batter — the pitcher noticed."],
  royals: ["He watched it go, then flipped the bat. The mound is not amused.", "That bat had a little extra on the flip too."],
};

// ── COLLISION COMMENTARY ──
const HOME_PLATE_COLLISION_GENERIC = [
  "They collide at the plate! Both players are down!",
  "What a collision! The runner CRASHES into the catcher!",
  "Home plate collision! The catcher is trying to hold onto the ball!",
];

const HOME_PLATE_COLLISION_TEAM = {
  cubs: ["HOLY COW — what a collision at home!", "Wrigley is silent — both players are slow to get up."],
  redsox: ["Fenway holds its breath — they collide at the plate!", "A brutal collision — both the runner and catcher are down."],
  tigers: ["What a collision at the dish — both players are shaken up.", "The runner CRASHES into the catcher — and the ball comes loose!"],
  yankees: ["Holy Cow — collision at home! The Bronx is on its feet!", "They collide at the plate — both players are slow to get up."],
  dodgers: ["Vin Scully: 'A violent collision at home plate.' Both players are down.", "They collide — the Chavez Ravine crowd gasps."],
  padres: ["Oh Doctor! What a CRASH at home plate!", "A massive collision — both players are down in a heap."],
  mets: ["Shea is on its feet — WHAT A COLLISION at home!", "They collide — both players are slow to move."],
  orioles: ["Collision at the plate! Both players hit the dirt hard.", "They crash into each other — a violent collision."],
  reds: ["They collide at home plate — Riverfront is buzzing!", "A hard collision — the artificial turf didn't cushion that."],
  royals: ["Collision at the plate! Both players go down hard.", "Denny Matthews: 'A violent collision — and there's the ball!'"],
};

// ── BRAWL COMMENTARY ──
const BRAWL_GENERIC = [
  "Both benches are clearing! Here we go!",
  "The dugouts empty — this is a full-scale brawl!",
  "Pandemonium! Both teams are on the field!",
];

const BRAWL_TEAM = {
  cubs: ["HOLY COW — THE BENCHES CLEAR!", "Both teams are pouring onto the field at Wrigley!"],
  redsox: ["Fenway is in chaos — both dugouts empty!", "The Red Sox and the visitors are going at it near the mound!"],
  tigers: ["Both benches empty at Tiger Stadium! This is getting ugly!", "The dugouts clear — punches might be thrown!"],
  yankees: ["Holy Cow — benches clearing brawl in the Bronx!", "Both teams are on the field — this could get ugly!"],
  dodgers: ["Vin Scully: 'Well, this is unfortunate — both benches have emptied onto the field.'", "A brawl at Chavez Ravine — both dugouts clear."],
  padres: ["Oh Doctor! Both benches are emptying! A melee at The Murph!", "Jerry Coleman: 'Pandemonium! Both teams are fighting!'"],
  mets: ["SHEA IS GOING CRAZY — BENCHES CLEAR!", "Both dugouts empty — this is chaos at Shea!"],
  orioles: ["Benches clearing at Memorial Stadium — both teams are on the field!", "It's a full-scale brawl at the old ball yard."],
  reds: ["Both benches empty at Riverfront! This is getting out of hand!", "The Reds and the visitors are going at it!"],
  royals: ["Both dugouts clear at Royals Stadium! A brawl near the mound!", "Denny Matthews: 'Oh boy — both benches are on the field.'"],
};

// ── PUBLIC API ──
export function getHBPCall(homeTeamKey, reason) {
  let pool;
  if (reason?.label?.includes('Retaliation')) pool = HBP_RETALIATION;
  else if (reason?.label?.includes('Revenge') || reason?.label?.includes('celebration')) pool = [...HBP_REVENGE, ...HBP_CELEBRATION];
  else pool = HBP_GENERIC;
  
  const teamPool = HBP_TEAM_CALLS[homeTeamKey];
  const useTeam = teamPool && Math.random() < 0.45;
  const calls = useTeam ? teamPool : pool;
  return '💥 ' + calls[Math.floor(Math.random() * calls.length)];
}

export function getWarningCall(homeTeamKey) {
  const teamPool = WARNING_TEAM[homeTeamKey];
  const useTeam = teamPool && Math.random() < 0.50;
  const calls = useTeam ? teamPool : WARNING_GENERIC;
  return '⚠️ ' + calls[Math.floor(Math.random() * calls.length)];
}

export function getEjectionCall(homeTeamKey) {
  const teamPool = EJECTION_TEAM[homeTeamKey];
  const useTeam = teamPool && Math.random() < 0.45;
  const calls = useTeam ? teamPool : EJECTION_GENERIC;
  return '🟥 ' + calls[Math.floor(Math.random() * calls.length)];
}

export function getBatFlipCall(homeTeamKey, batterName) {
  const teamPool = BAT_FLIP_TEAM[homeTeamKey];
  const useTeam = teamPool && Math.random() < 0.40;
  const calls = useTeam ? teamPool : BAT_FLIP_GENERIC;
  return '🦇 ' + calls[Math.floor(Math.random() * calls.length)];
}

export function getCollisionCall(homeTeamKey) {
  const teamPool = HOME_PLATE_COLLISION_TEAM[homeTeamKey];
  const useTeam = teamPool && Math.random() < 0.40;
  const calls = useTeam ? teamPool : HOME_PLATE_COLLISION_GENERIC;
  return '💢 ' + calls[Math.floor(Math.random() * calls.length)];
}

export function getBrawlCall(homeTeamKey) {
  const teamPool = BRAWL_TEAM[homeTeamKey];
  const useTeam = teamPool && Math.random() < 0.40;
  const calls = useTeam ? teamPool : BRAWL_GENERIC;
  return '👊 ' + calls[Math.floor(Math.random() * calls.length)];
}