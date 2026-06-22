// Philadelphia Phillies 1984 Baseball Card Collection System
// Roster mirrors gameData.js phillies: 8 lineup + 5 bench + 4 rotation + 5 bullpen = 22 players

export const PHILLIES_ROSTER = [
  // Lineup (8)
  { id: 1,  name: 'Juan Samuel',    position: '2B', number: 7,  ba: '.272', hr: 15, rbi: 69,  era: '-',    role: 'Second Base',          rarity: 'uncommon' },
  { id: 2,  name: 'Ivan DeJesus',   position: 'SS', number: 6,  ba: '.257', hr: 0,  rbi: 35,  era: '-',    role: 'Shortstop',            rarity: 'common'   },
  { id: 3,  name: 'Mike Schmidt',   position: '3B', number: 20, ba: '.277', hr: 36, rbi: 106, era: '-',    role: 'Third Base/Captain',   rarity: 'rare'     },
  { id: 4,  name: 'Von Hayes',      position: '1B', number: 9,  ba: '.292', hr: 16, rbi: 67,  era: '-',    role: 'First Base',           rarity: 'common'   },
  { id: 5,  name: 'Glenn Wilson',   position: 'RF', number: 11, ba: '.264', hr: 14, rbi: 56,  era: '-',    role: 'Right Field',          rarity: 'common'   },
  { id: 6,  name: 'Ozzie Virgil Jr.',position:'C',  number: 14, ba: '.261', hr: 18, rbi: 68,  era: '-',    role: 'Catcher',              rarity: 'uncommon' },
  { id: 7,  name: 'Garry Maddox',  position: 'CF', number: 31, ba: '.258', hr: 3,  rbi: 46,  era: '-',    role: 'Center Field/8 Gold Gloves', rarity: 'uncommon' },
  { id: 8,  name: 'Jeff Stone',     position: 'LF', number: 25, ba: '.362', hr: 1,  rbi: 18,  era: '-',    role: 'Left Field/Speedster', rarity: 'uncommon' },
  // Bench (5)
  { id: 9,  name: 'Len Matuszek',  position: '1B',     number: 17, ba: '.268', hr: 12, rbi: 43, era: '-',  role: 'Backup First Base',  rarity: 'common'   },
  { id: 10, name: 'Greg Gross',    position: 'OF',     number: 3,  ba: '.274', hr: 1,  rbi: 14, era: '-',  role: 'Pinch Hitter',       rarity: 'common'   },
  { id: 11, name: 'Derrel Thomas', position: 'INF/OF', number: 2,  ba: '.239', hr: 3,  rbi: 23, era: '-',  role: 'Utility Player',     rarity: 'common'   },
  { id: 12, name: 'Bo Diaz',       position: 'C',      number: 15, ba: '.240', hr: 5,  rbi: 26, era: '-',  role: 'Backup Catcher',     rarity: 'common'   },
  { id: 13, name: 'Sixto Lezcano', position: 'OF',     number: 22, ba: '.237', hr: 4,  rbi: 19, era: '-',  role: 'Bench Outfielder',   rarity: 'common'   },
  // Rotation (4)
  { id: 14, name: 'Steve Carlton', position: 'SP', number: 32, ba: '-', hr: '-', rbi: '-', era: '3.58', role: 'Ace Lefty',           rarity: 'rare'     },
  { id: 15, name: 'John Denny',    position: 'SP', number: 23, ba: '-', hr: '-', rbi: '-', era: '4.64', role: 'Starting Pitcher',    rarity: 'uncommon' },
  { id: 16, name: 'Kevin Gross',   position: 'SP', number: 33, ba: '-', hr: '-', rbi: '-', era: '4.12', role: 'Starting Pitcher',    rarity: 'common'   },
  { id: 17, name: 'Charles Hudson',position: 'SP', number: 45, ba: '-', hr: '-', rbi: '-', era: '4.04', role: 'Starting Pitcher',    rarity: 'common'   },
  // Bullpen (5)
  { id: 18, name: 'Al Holland',    position: 'CL', number: 47, ba: '-', hr: '-', rbi: '-', era: '5.24', role: 'Closer/Mr. T',        rarity: 'uncommon' },
  { id: 19, name: 'Larry Andersen',position: 'RP', number: 47, ba: '-', hr: '-', rbi: '-', era: '2.38', role: 'Relief Pitcher',      rarity: 'common'   },
  { id: 20, name: 'Bill Campbell', position: 'RP', number: 39, ba: '-', hr: '-', rbi: '-', era: '3.96', role: 'Relief Pitcher',      rarity: 'common'   },
  { id: 21, name: 'Don Carman',    position: 'RP', number: 42, ba: '-', hr: '-', rbi: '-', era: '4.56', role: 'Relief Pitcher',      rarity: 'common'   },
  { id: 22, name: 'Tug McGraw',    position: 'RP', number: 45, ba: '-', hr: '-', rbi: '-', era: '3.12', role: 'Ya Gotta Believe!',   rarity: 'uncommon' },
];

const COLLECTED_CARDS = new Set();

export function getRandomPhilliesCard() {
  return PHILLIES_ROSTER[Math.floor(Math.random() * PHILLIES_ROSTER.length)];
}

export function addCollectedPhilliesCard(cardId) {
  COLLECTED_CARDS.add(cardId);
  const unlocked = [];
  const count = COLLECTED_CARDS.size;
  if (count === 5 && !localStorage.getItem('ach_phi_card_starter')) {
    localStorage.setItem('ach_phi_card_starter', Date.now());
    unlocked.push('phi_card_starter');
  }
  if (count === 11 && !localStorage.getItem('ach_phi_card_collector')) {
    localStorage.setItem('ach_phi_card_collector', Date.now());
    unlocked.push('phi_card_collector');
  }
  if (count === 22 && !localStorage.getItem('ach_phi_complete_roster')) {
    localStorage.setItem('ach_phi_complete_roster', Date.now());
    unlocked.push('phi_complete_roster');
  }
  return unlocked;
}

export function getPhilliesCollectedCards() {
  return Array.from(COLLECTED_CARDS);
}

export function getPhilliesCollectionProgress() {
  return {
    collected: COLLECTED_CARDS.size,
    total: PHILLIES_ROSTER.length,
    percentage: Math.round((COLLECTED_CARDS.size / PHILLIES_ROSTER.length) * 100),
  };
}

export function hasPhilliesCard(cardId) {
  return COLLECTED_CARDS.has(cardId);
}

export function loadPhilliesCollectionFromStorage() {
  const stored = localStorage.getItem('philliesCardCollection');
  if (stored) {
    JSON.parse(stored).forEach(id => COLLECTED_CARDS.add(id));
  }
}

export function savePhilliesCollectionToStorage() {
  localStorage.setItem('philliesCardCollection', JSON.stringify(Array.from(COLLECTED_CARDS)));
}