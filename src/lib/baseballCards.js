// Unified 1984 Baseball Card Collection System — All 26 Teams + Manager Cards
// Each team's roster mirrors gameData.js exactly
import { EXTRA_ROSTERS, MANAGER_CARDS } from './baseballCards2';

export const ALL_ROSTERS = {

  tigers: [
    { id: 1,  name: 'Alan Trammell',   position: 'SS',   number: 3,  ba: '.314', hr: 14, rbi: 69,  era: '-',    role: 'Shortstop/Captain',    rarity: 'rare'     },
    { id: 2,  name: 'Lou Whitaker',    position: '2B',   number: 1,  ba: '.289', hr: 13, rbi: 56,  era: '-',    role: 'Second Base',          rarity: 'uncommon' },
    { id: 3,  name: 'Kirk Gibson',     position: 'LF',   number: 23, ba: '.282', hr: 27, rbi: 91,  era: '-',    role: 'Left Field',           rarity: 'uncommon' },
    { id: 4,  name: 'Lance Parrish',   position: 'C',    number: 13, ba: '.237', hr: 33, rbi: 98,  era: '-',    role: 'Catcher Power',        rarity: 'uncommon' },
    { id: 5,  name: 'Darrell Evans',   position: '3B',   number: 43, ba: '.232', hr: 32, rbi: 85,  era: '-',    role: 'Third Base Power',     rarity: 'common'   },
    { id: 6,  name: 'Chet Lemon',      position: 'CF',   number: 21, ba: '.287', hr: 12, rbi: 66,  era: '-',    role: 'Center Field',         rarity: 'common'   },
    { id: 7,  name: 'Larry Herndon',   position: 'RF',   number: 14, ba: '.277', hr: 10, rbi: 41,  era: '-',    role: 'Right Field',          rarity: 'common'   },
    { id: 8,  name: 'Howard Johnson',  position: '3B',   number: 10, ba: '.241', hr: 12, rbi: 50,  era: '-',    role: 'Infielder',            rarity: 'common'   },
    { id: 9,  name: 'Barbaro Garbey',  position: 'DH',   number: 7,  ba: '.287', hr: 5,  rbi: 35,  era: '-',    role: 'Designated Hitter',    rarity: 'common'   },
    { id: 10, name: 'Jack Morris',     position: 'SP',   number: 46, ba: '-',    hr: '-', rbi: '-', era: '3.60', role: 'Ace Pitcher',          rarity: 'rare'     },
    { id: 11, name: 'Dan Petry',       position: 'SP',   number: 38, ba: '-',    hr: '-', rbi: '-', era: '3.97', role: 'Starting Pitcher',     rarity: 'uncommon' },
    { id: 12, name: 'Milt Wilcox',     position: 'SP',   number: 40, ba: '-',    hr: '-', rbi: '-', era: '4.74', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 13, name: 'Juan Berenguer',  position: 'RP',   number: 34, ba: '-',    hr: '-', rbi: '-', era: '3.49', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 14, name: 'Willie Hernandez',position: 'CL',   number: 28, ba: '-',    hr: '-', rbi: '-', era: '1.92', role: 'Closer/MVP',           rarity: 'rare'     },
    { id: 15, name: 'Aurelio Lopez',   position: 'RP',   number: 36, ba: '-',    hr: '-', rbi: '-', era: '2.90', role: 'Relief Ace',           rarity: 'uncommon' },
    { id: 16, name: 'Doug Bair',       position: 'RP',   number: 52, ba: '-',    hr: '-', rbi: '-', era: '3.42', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 17, name: 'Bill Scherrer',   position: 'RP',   number: 51, ba: '-',    hr: '-', rbi: '-', era: '3.86', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 18, name: 'Sid Monge',       position: 'RP',   number: 35, ba: '-',    hr: '-', rbi: '-', era: '4.15', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 19, name: 'Tom Brookens',    position: 'UT',   number: 22, ba: '.283', hr: 13, rbi: 54,  era: '-',    role: 'Utility Infielder',    rarity: 'common'   },
    { id: 20, name: 'Dave Bergman',    position: '1B',   number: 9,  ba: '.226', hr: 1,  rbi: 8,   era: '-',    role: 'Pinch Hitter',         rarity: 'common'   },
    { id: 21, name: 'Rusty Kuntz',     position: 'OF',   number: 25, ba: '.239', hr: 1,  rbi: 10,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
    { id: 22, name: 'Marty Castillo',  position: 'C',    number: 32, ba: '.200', hr: 3,  rbi: 18,  era: '-',    role: 'Backup Catcher',       rarity: 'common'   },
    { id: 23, name: 'Johnny Grubb',    position: 'OF',   number: 18, ba: '.256', hr: 3,  rbi: 21,  era: '-',    role: 'Bench/Utility',        rarity: 'common'   },
  ],

  padres: [
    { id: 1,  name: 'Tony Gwynn',      position: 'RF',   number: 19, ba: '.351', hr: 5,  rbi: 71,  era: '-',    role: 'Batting Champion',     rarity: 'rare'     },
    { id: 2,  name: 'Steve Garvey',    position: '1B',   number: 6,  ba: '.284', hr: 8,  rbi: 86,  era: '-',    role: 'First Base/NLCS Hero', rarity: 'rare'     },
    { id: 3,  name: 'Goose Gossage',   position: 'CL',   number: 54, ba: '-',    hr: '-', rbi: '-', era: '2.90', role: 'Closer',               rarity: 'rare'     },
    { id: 4,  name: 'Alan Wiggins',    position: '2B',   number: 2,  ba: '.258', hr: 3,  rbi: 34,  era: '-',    role: 'Leadoff Speedster',    rarity: 'common'   },
    { id: 5,  name: 'Graig Nettles',   position: '3B',   number: 9,  ba: '.228', hr: 20, rbi: 65,  era: '-',    role: 'Third Base',           rarity: 'uncommon' },
    { id: 6,  name: 'Terry Kennedy',   position: 'C',    number: 14, ba: '.240', hr: 14, rbi: 57,  era: '-',    role: 'Catcher',              rarity: 'common'   },
    { id: 7,  name: 'Kevin McReynolds',position: 'CF',   number: 32, ba: '.278', hr: 20, rbi: 75,  era: '-',    role: 'Center Field',         rarity: 'uncommon' },
    { id: 8,  name: 'Carmelo Martinez',position: 'LF',   number: 24, ba: '.250', hr: 13, rbi: 66,  era: '-',    role: 'Left Field',           rarity: 'common'   },
    { id: 9,  name: 'Garry Templeton', position: 'SS',   number: 11, ba: '.257', hr: 2,  rbi: 47,  era: '-',    role: 'Shortstop',            rarity: 'common'   },
    { id: 10, name: 'Eric Show',       position: 'SP',   number: 26, ba: '-',    hr: '-', rbi: '-', era: '3.40', role: 'Starting Pitcher',     rarity: 'uncommon' },
    { id: 11, name: 'Ed Whitson',      position: 'SP',   number: 31, ba: '-',    hr: '-', rbi: '-', era: '3.24', role: 'Starting Pitcher',     rarity: 'uncommon' },
    { id: 12, name: 'Tim Lollar',      position: 'SP',   number: 25, ba: '-',    hr: '-', rbi: '-', era: '3.91', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 13, name: 'Andy Hawkins',    position: 'SP',   number: 44, ba: '-',    hr: '-', rbi: '-', era: '4.68', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 14, name: 'Craig Lefferts',  position: 'RP',   number: 37, ba: '-',    hr: '-', rbi: '-', era: '3.13', role: 'Relief Pitcher',       rarity: 'uncommon' },
    { id: 15, name: 'Dave Dravecky',   position: 'RP',   number: 43, ba: '-',    hr: '-', rbi: '-', era: '2.93', role: 'Relief Pitcher',       rarity: 'uncommon' },
    { id: 16, name: 'Greg Booker',     position: 'RP',   number: 47, ba: '-',    hr: '-', rbi: '-', era: '3.65', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 17, name: 'Luis DeLeon',     position: 'RP',   number: 38, ba: '-',    hr: '-', rbi: '-', era: '2.98', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 18, name: 'Kurt Bevacqua',   position: '1B',   number: 17, ba: '.261', hr: 4,  rbi: 31,  era: '-',    role: 'Bench/Utility',        rarity: 'common'   },
    { id: 19, name: 'Bobby Brown',     position: 'OF',   number: 23, ba: '.258', hr: 4,  rbi: 22,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
    { id: 20, name: 'Bruce Bochy',     position: 'C',    number: 8,  ba: '.234', hr: 5,  rbi: 16,  era: '-',    role: 'Backup Catcher',       rarity: 'common'   },
    { id: 21, name: 'Tim Flannery',    position: '2B',   number: 10, ba: '.275', hr: 3,  rbi: 22,  era: '-',    role: 'Utility Infielder',    rarity: 'common'   },
    { id: 22, name: 'Champ Summers',   position: 'OF',   number: 25, ba: '.255', hr: 6,  rbi: 20,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
  ],

  cubs: [
    { id: 1,  name: 'Ryne Sandberg',   position: '2B',   number: 23, ba: '.314', hr: 19, rbi: 84,  era: '-',    role: 'Second Base/MVP',      rarity: 'rare'     },
    { id: 2,  name: 'Rick Sutcliffe',  position: 'SP',   number: 40, ba: '-',    hr: '-', rbi: '-', era: '2.69', role: 'Ace/Cy Young',         rarity: 'rare'     },
    { id: 3,  name: 'Lee Smith',       position: 'CL',   number: 46, ba: '-',    hr: '-', rbi: '-', era: '3.65', role: 'Closer',               rarity: 'uncommon' },
    { id: 4,  name: 'Bob Dernier',     position: 'CF',   number: 3,  ba: '.278', hr: 3,  rbi: 32,  era: '-',    role: 'Center Field/Leadoff', rarity: 'common'   },
    { id: 5,  name: 'Gary Matthews',   position: 'LF',   number: 36, ba: '.291', hr: 14, rbi: 82,  era: '-',    role: 'Left Field/Sarge',     rarity: 'uncommon' },
    { id: 6,  name: 'Leon Durham',     position: '1B',   number: 10, ba: '.279', hr: 23, rbi: 96,  era: '-',    role: 'First Base/Bull',      rarity: 'uncommon' },
    { id: 7,  name: 'Keith Moreland',  position: 'RF',   number: 26, ba: '.279', hr: 16, rbi: 80,  era: '-',    role: 'Right Field',          rarity: 'common'   },
    { id: 8,  name: 'Jody Davis',      position: 'C',    number: 7,  ba: '.256', hr: 19, rbi: 94,  era: '-',    role: 'Catcher',              rarity: 'common'   },
    { id: 9,  name: 'Ron Cey',         position: '3B',   number: 11, ba: '.240', hr: 25, rbi: 97,  era: '-',    role: 'Third Base/Penguin',   rarity: 'uncommon' },
    { id: 10, name: 'Larry Bowa',      position: 'SS',   number: 2,  ba: '.223', hr: 0,  rbi: 17,  era: '-',    role: 'Shortstop/Veteran',    rarity: 'common'   },
    { id: 11, name: 'Dennis Eckersley',position: 'SP',   number: 43, ba: '-',    hr: '-', rbi: '-', era: '3.03', role: 'Starting Pitcher',     rarity: 'uncommon' },
    { id: 12, name: 'Steve Trout',     position: 'SP',   number: 21, ba: '-',    hr: '-', rbi: '-', era: '3.41', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 13, name: 'Scott Sanderson', position: 'SP',   number: 29, ba: '-',    hr: '-', rbi: '-', era: '3.14', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 14, name: 'Tim Stoddard',    position: 'RP',   number: 47, ba: '-',    hr: '-', rbi: '-', era: '3.82', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 15, name: 'George Frazier',  position: 'RP',   number: 31, ba: '-',    hr: '-', rbi: '-', era: '4.22', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 16, name: 'Warren Brusstar', position: 'RP',   number: 36, ba: '-',    hr: '-', rbi: '-', era: '4.45', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 17, name: 'Dickie Noles',    position: 'RP',   number: 44, ba: '-',    hr: '-', rbi: '-', era: '5.02', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 18, name: 'Thad Bosley',     position: 'OF',   number: 24, ba: '.286', hr: 4,  rbi: 26,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
    { id: 19, name: 'Richie Hebner',   position: '1B',   number: 8,  ba: '.265', hr: 5,  rbi: 23,  era: '-',    role: 'Pinch Hitter',         rarity: 'common'   },
    { id: 20, name: 'Henry Cotto',     position: 'OF',   number: 17, ba: '.261', hr: 2,  rbi: 11,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
    { id: 21, name: 'Steve Lake',      position: 'C',    number: 16, ba: '.231', hr: 3,  rbi: 14,  era: '-',    role: 'Backup Catcher',       rarity: 'common'   },
    { id: 22, name: 'Dave Owen',       position: 'SS',   number: 13, ba: '.215', hr: 3,  rbi: 12,  era: '-',    role: 'Backup Shortstop',     rarity: 'common'   },
  ],

  mets: [
    { id: 1,  name: 'Dwight Gooden',   position: 'SP',   number: 16, ba: '-',    hr: '-', rbi: '-', era: '2.60', role: 'Phenom/Doc',           rarity: 'rare'     },
    { id: 2,  name: 'Darryl Strawberry',position:'RF',   number: 18, ba: '.251', hr: 26, rbi: 97,  era: '-',    role: 'Right Field/Power',    rarity: 'rare'     },
    { id: 3,  name: 'Keith Hernandez', position: '1B',   number: 17, ba: '.311', hr: 15, rbi: 94,  era: '-',    role: 'First Base/Captain',   rarity: 'rare'     },
    { id: 4,  name: 'Wally Backman',   position: '2B',   number: 6,  ba: '.280', hr: 1,  rbi: 26,  era: '-',    role: 'Second Base',          rarity: 'common'   },
    { id: 5,  name: 'Mookie Wilson',   position: 'CF',   number: 1,  ba: '.276', hr: 10, rbi: 54,  era: '-',    role: 'Center Field',         rarity: 'common'   },
    { id: 6,  name: 'George Foster',   position: 'LF',   number: 15, ba: '.269', hr: 24, rbi: 86,  era: '-',    role: 'Left Field/Power',     rarity: 'uncommon' },
    { id: 7,  name: 'Hubie Brooks',    position: '3B',   number: 39, ba: '.283', hr: 16, rbi: 73,  era: '-',    role: 'Third Base',           rarity: 'uncommon' },
    { id: 8,  name: 'Mike Fitzgerald', position: 'C',    number: 12, ba: '.242', hr: 2,  rbi: 30,  era: '-',    role: 'Catcher',              rarity: 'common'   },
    { id: 9,  name: 'Jose Oquendo',    position: 'SS',   number: 4,  ba: '.224', hr: 0,  rbi: 23,  era: '-',    role: 'Shortstop',            rarity: 'common'   },
    { id: 10, name: 'Jesse Orosco',    position: 'CL',   number: 47, ba: '-',    hr: '-', rbi: '-', era: '2.59', role: 'Closer',               rarity: 'uncommon' },
    { id: 11, name: 'Ron Darling',     position: 'SP',   number: 44, ba: '-',    hr: '-', rbi: '-', era: '3.81', role: 'Starting Pitcher',     rarity: 'uncommon' },
    { id: 12, name: 'Walt Terrell',    position: 'SP',   number: 36, ba: '-',    hr: '-', rbi: '-', era: '3.52', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 13, name: 'Bruce Berenyi',   position: 'SP',   number: 21, ba: '-',    hr: '-', rbi: '-', era: '3.94', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 14, name: 'Doug Sisk',       position: 'RP',   number: 37, ba: '-',    hr: '-', rbi: '-', era: '2.24', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 15, name: 'Brent Gaff',      position: 'RP',   number: 34, ba: '-',    hr: '-', rbi: '-', era: '4.65', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 16, name: 'Tom Gorman',      position: 'RP',   number: 35, ba: '-',    hr: '-', rbi: '-', era: '3.34', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 17, name: 'Ed Lynch',        position: 'RP',   number: 33, ba: '-',    hr: '-', rbi: '-', era: '4.50', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 18, name: 'Ron Gardenhire',  position: 'SS',   number: 8,  ba: '.218', hr: 1,  rbi: 13,  era: '-',    role: 'Backup Infielder',     rarity: 'common'   },
    { id: 19, name: 'Kelvin Chapman',  position: '2B',   number: 3,  ba: '.282', hr: 1,  rbi: 19,  era: '-',    role: 'Utility Infielder',    rarity: 'common'   },
    { id: 20, name: 'John Gibbons',    position: 'C',    number: 9,  ba: '.217', hr: 2,  rbi: 8,   era: '-',    role: 'Backup Catcher',       rarity: 'common'   },
    { id: 21, name: 'Danny Heep',      position: 'OF',   number: 28, ba: '.278', hr: 4,  rbi: 36,  era: '-',    role: 'Pinch Hitter',         rarity: 'common'   },
    { id: 22, name: 'Rusty Staub',     position: 'DH',   number: 10, ba: '.264', hr: 5,  rbi: 28,  era: '-',    role: 'Pinch Hit Legend',     rarity: 'uncommon' },
  ],

  redsox: [
    { id: 1,  name: 'Wade Boggs',      position: '3B',   number: 26, ba: '.325', hr: 6,  rbi: 55,  era: '-',    role: 'Batting Champion',     rarity: 'rare'     },
    { id: 2,  name: 'Jim Rice',        position: 'LF',   number: 14, ba: '.280', hr: 28, rbi: 122, era: '-',    role: 'Left Field/Power',     rarity: 'rare'     },
    { id: 3,  name: 'Dwight Evans',    position: 'RF',   number: 24, ba: '.295', hr: 32, rbi: 104, era: '-',    role: 'Right Field/Gold Glv', rarity: 'uncommon' },
    { id: 4,  name: 'Tony Armas',      position: 'CF',   number: 22, ba: '.268', hr: 43, rbi: 123, era: '-',    role: 'Center Field/HR Champ',rarity: 'uncommon' },
    { id: 5,  name: 'Mike Easler',     position: 'DH',   number: 29, ba: '.313', hr: 27, rbi: 91,  era: '-',    role: 'Designated Hitter',    rarity: 'uncommon' },
    { id: 6,  name: 'Bill Buckner',    position: '1B',   number: 6,  ba: '.278', hr: 11, rbi: 57,  era: '-',    role: 'First Base',           rarity: 'common'   },
    { id: 7,  name: 'Rich Gedman',     position: 'C',    number: 10, ba: '.269', hr: 24, rbi: 72,  era: '-',    role: 'Catcher',              rarity: 'common'   },
    { id: 8,  name: 'Marty Barrett',   position: '2B',   number: 17, ba: '.303', hr: 3,  rbi: 45,  era: '-',    role: 'Second Base',          rarity: 'common'   },
    { id: 9,  name: 'Jackie Gutierrez',position: 'SS',   number: 3,  ba: '.261', hr: 3,  rbi: 28,  era: '-',    role: 'Shortstop',            rarity: 'common'   },
    { id: 10, name: 'Bruce Hurst',     position: 'SP',   number: 38, ba: '-',    hr: '-', rbi: '-', era: '3.92', role: 'Starting Pitcher',     rarity: 'uncommon' },
    { id: 11, name: 'Oil Can Boyd',    position: 'SP',   number: 21, ba: '-',    hr: '-', rbi: '-', era: '4.37', role: 'Starting Pitcher',     rarity: 'uncommon' },
    { id: 12, name: 'Bob Ojeda',       position: 'SP',   number: 19, ba: '-',    hr: '-', rbi: '-', era: '3.99', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 13, name: 'Al Nipper',       position: 'SP',   number: 35, ba: '-',    hr: '-', rbi: '-', era: '4.06', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 14, name: 'Bob Stanley',     position: 'CL',   number: 46, ba: '-',    hr: '-', rbi: '-', era: '3.54', role: 'Closer',               rarity: 'common'   },
    { id: 15, name: 'Mark Clear',      position: 'RP',   number: 31, ba: '-',    hr: '-', rbi: '-', era: '4.03', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 16, name: 'John Henry Johnson',position:'RP',  number: 36, ba: '-',    hr: '-', rbi: '-', era: '4.25', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 17, name: 'Steve Crawford',  position: 'RP',   number: 43, ba: '-',    hr: '-', rbi: '-', era: '3.77', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 18, name: 'Charlie Mitchell',position: 'RP',   number: 52, ba: '-',    hr: '-', rbi: '-', era: '4.89', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 19, name: 'Reid Nichols',    position: 'OF',   number: 34, ba: '.251', hr: 5,  rbi: 24,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
    { id: 20, name: 'Ed Jurak',        position: '3B',   number: 2,  ba: '.233', hr: 2,  rbi: 11,  era: '-',    role: 'Utility Infielder',    rarity: 'common'   },
    { id: 21, name: 'Rick Miller',     position: 'OF',   number: 15, ba: '.255', hr: 2,  rbi: 17,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
    { id: 22, name: 'Glenn Hoffman',   position: 'SS',   number: 7,  ba: '.231', hr: 2,  rbi: 22,  era: '-',    role: 'Backup Shortstop',     rarity: 'common'   },
    { id: 23, name: 'Jeff Newman',     position: 'C',    number: 10, ba: '.211', hr: 4,  rbi: 13,  era: '-',    role: 'Backup Catcher',       rarity: 'common'   },
  ],

  yankees: [
    { id: 1,  name: 'Don Mattingly',   position: '1B',   number: 23, ba: '.343', hr: 23, rbi: 110, era: '-',    role: 'First Base/Donnie Baseball', rarity: 'rare'   },
    { id: 2,  name: 'Dave Winfield',   position: 'RF',   number: 31, ba: '.340', hr: 19, rbi: 100, era: '-',    role: 'Right Field',          rarity: 'rare'     },
    { id: 3,  name: 'Ron Guidry',      position: 'SP',   number: 49, ba: '-',    hr: '-', rbi: '-', era: '4.51', role: 'Louisiana Lightning',  rarity: 'uncommon' },
    { id: 4,  name: 'Dave Righetti',   position: 'CL',   number: 19, ba: '-',    hr: '-', rbi: '-', era: '2.34', role: 'Closer/No-Hit Legend', rarity: 'uncommon' },
    { id: 5,  name: 'Phil Niekro',     position: 'SP',   number: 35, ba: '-',    hr: '-', rbi: '-', era: '3.09', role: 'Knucksie/Legend',      rarity: 'rare'     },
    { id: 6,  name: 'Willie Randolph', position: '2B',   number: 30, ba: '.287', hr: 2,  rbi: 31,  era: '-',    role: 'Second Base',          rarity: 'common'   },
    { id: 7,  name: 'Don Baylor',      position: 'DH',   number: 25, ba: '.262', hr: 27, rbi: 89,  era: '-',    role: 'Designated Hitter',    rarity: 'uncommon' },
    { id: 8,  name: 'Ken Griffey Sr.', position: 'CF',   number: 33, ba: '.273', hr: 11, rbi: 56,  era: '-',    role: 'Center Field',         rarity: 'common'   },
    { id: 9,  name: 'Steve Kemp',      position: 'LF',   number: 26, ba: '.291', hr: 7,  rbi: 41,  era: '-',    role: 'Left Field',           rarity: 'common'   },
    { id: 10, name: 'Butch Wynegar',   position: 'C',    number: 16, ba: '.246', hr: 7,  rbi: 45,  era: '-',    role: 'Catcher',              rarity: 'common'   },
    { id: 11, name: 'Mike Pagliarulo', position: '3B',   number: 13, ba: '.239', hr: 15, rbi: 54,  era: '-',    role: 'Third Base',           rarity: 'common'   },
    { id: 12, name: 'Bobby Meacham',   position: 'SS',   number: 2,  ba: '.253', hr: 1,  rbi: 27,  era: '-',    role: 'Shortstop',            rarity: 'common'   },
    { id: 13, name: 'Ray Fontenot',    position: 'SP',   number: 38, ba: '-',    hr: '-', rbi: '-', era: '3.72', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 14, name: 'Dennis Rasmussen',position: 'SP',   number: 48, ba: '-',    hr: '-', rbi: '-', era: '4.57', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 15, name: 'Jay Howell',      position: 'RP',   number: 43, ba: '-',    hr: '-', rbi: '-', era: '2.69', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 16, name: 'Mike Armstrong',  position: 'RP',   number: 44, ba: '-',    hr: '-', rbi: '-', era: '3.74', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 17, name: 'Bob Shirley',     position: 'RP',   number: 37, ba: '-',    hr: '-', rbi: '-', era: '4.45', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 18, name: 'Clay Christiansen',position:'RP',   number: 52, ba: '-',    hr: '-', rbi: '-', era: '5.06', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 19, name: 'Oscar Gamble',    position: 'OF',   number: 17, ba: '.245', hr: 9,  rbi: 27,  era: '-',    role: 'Pinch Hitter',         rarity: 'common'   },
    { id: 20, name: 'Roy Smalley',     position: '3B',   number: 3,  ba: '.241', hr: 8,  rbi: 34,  era: '-',    role: 'Utility Infielder',    rarity: 'common'   },
    { id: 21, name: 'Rick Cerone',     position: 'C',    number: 10, ba: '.242', hr: 4,  rbi: 18,  era: '-',    role: 'Backup Catcher',       rarity: 'common'   },
    { id: 22, name: 'Brian Dayett',    position: 'OF',   number: 22, ba: '.238', hr: 4,  rbi: 16,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
    { id: 23, name: 'Tim Foli',        position: 'SS',   number: 11, ba: '.249', hr: 2,  rbi: 19,  era: '-',    role: 'Utility Infielder',    rarity: 'common'   },
  ],

  orioles: [
    { id: 1,  name: 'Cal Ripken Jr.',  position: 'SS',   number: 8,  ba: '.304', hr: 27, rbi: 86,  era: '-',    role: 'Shortstop/Iron Man',   rarity: 'rare'     },
    { id: 2,  name: 'Eddie Murray',    position: '1B',   number: 33, ba: '.306', hr: 29, rbi: 110, era: '-',    role: 'First Base/Steady Eddie', rarity: 'rare'   },
    { id: 3,  name: 'Mike Boddicker',  position: 'SP',   number: 39, ba: '-',    hr: '-', rbi: '-', era: '2.79', role: 'Ace Pitcher',          rarity: 'rare'     },
    { id: 4,  name: 'Al Bumbry',       position: 'CF',   number: 6,  ba: '.275', hr: 2,  rbi: 22,  era: '-',    role: 'Center Field',         rarity: 'common'   },
    { id: 5,  name: 'Gary Roenicke',   position: 'LF',   number: 17, ba: '.230', hr: 8,  rbi: 40,  era: '-',    role: 'Left Field',           rarity: 'common'   },
    { id: 6,  name: 'Wayne Gross',     position: '3B',   number: 9,  ba: '.227', hr: 15, rbi: 50,  era: '-',    role: 'Third Base',           rarity: 'common'   },
    { id: 7,  name: 'Ken Singleton',   position: 'DH',   number: 29, ba: '.215', hr: 6,  rbi: 35,  era: '-',    role: 'Designated Hitter',    rarity: 'uncommon' },
    { id: 8,  name: 'Mike Young',      position: 'RF',   number: 43, ba: '.259', hr: 16, rbi: 53,  era: '-',    role: 'Right Field',          rarity: 'common'   },
    { id: 9,  name: 'Rich Dauer',      position: '2B',   number: 25, ba: '.256', hr: 3,  rbi: 30,  era: '-',    role: 'Second Base',          rarity: 'common'   },
    { id: 10, name: 'Rick Dempsey',    position: 'C',    number: 24, ba: '.244', hr: 8,  rbi: 39,  era: '-',    role: 'Catcher/WS MVP',       rarity: 'uncommon' },
    { id: 11, name: 'Scott McGregor',  position: 'SP',   number: 33, ba: '-',    hr: '-', rbi: '-', era: '4.08', role: 'Starting Pitcher',     rarity: 'uncommon' },
    { id: 12, name: 'Storm Davis',     position: 'SP',   number: 20, ba: '-',    hr: '-', rbi: '-', era: '3.12', role: 'Starting Pitcher',     rarity: 'uncommon' },
    { id: 13, name: 'Mike Flanagan',   position: 'SP',   number: 46, ba: '-',    hr: '-', rbi: '-', era: '3.53', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 14, name: 'Tippy Martinez',  position: 'CL',   number: 27, ba: '-',    hr: '-', rbi: '-', era: '2.80', role: 'Closer',               rarity: 'uncommon' },
    { id: 15, name: 'Sammy Stewart',   position: 'RP',   number: 40, ba: '-',    hr: '-', rbi: '-', era: '3.62', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 16, name: 'Tom Underwood',   position: 'RP',   number: 44, ba: '-',    hr: '-', rbi: '-', era: '4.34', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 17, name: 'Bill Swaggerty',  position: 'RP',   number: 52, ba: '-',    hr: '-', rbi: '-', era: '4.22', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 18, name: 'John Pacella',    position: 'RP',   number: 35, ba: '-',    hr: '-', rbi: '-', era: '4.60', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 19, name: 'John Shelby',     position: 'OF',   number: 23, ba: '.241', hr: 6,  rbi: 29,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
    { id: 20, name: 'Jim Dwyer',       position: 'OF',   number: 18, ba: '.278', hr: 8,  rbi: 21,  era: '-',    role: 'Pinch Hitter',         rarity: 'common'   },
    { id: 21, name: 'Floyd Rayford',   position: 'C',    number: 11, ba: '.231', hr: 5,  rbi: 20,  era: '-',    role: 'Utility/Catcher',      rarity: 'common'   },
    { id: 22, name: 'Lenn Sakata',     position: '2B',   number: 15, ba: '.223', hr: 3,  rbi: 14,  era: '-',    role: 'Utility Infielder',    rarity: 'common'   },
    { id: 23, name: 'Joe Nolan',       position: 'C',    number: 10, ba: '.245', hr: 3,  rbi: 15,  era: '-',    role: 'Backup Catcher',       rarity: 'common'   },
  ],

  reds: [
    { id: 1,  name: 'Pete Rose',       position: '1B',   number: 14, ba: '.286', hr: 0,  rbi: 34,  era: '-',    role: 'Player-Mgr/Charlie Hustle', rarity: 'rare'  },
    { id: 2,  name: 'Dave Parker',     position: 'RF',   number: 39, ba: '.285', hr: 16, rbi: 94,  era: '-',    role: 'Right Field/Cobra',    rarity: 'rare'     },
    { id: 3,  name: 'Mario Soto',      position: 'SP',   number: 21, ba: '-',    hr: '-', rbi: '-', era: '3.53', role: 'Ace Pitcher',          rarity: 'rare'     },
    { id: 4,  name: 'Gary Redus',      position: 'LF',   number: 22, ba: '.254', hr: 7,  rbi: 34,  era: '-',    role: 'Left Field/Speedster', rarity: 'common'   },
    { id: 5,  name: 'Cesar Cedeno',    position: 'CF',   number: 11, ba: '.276', hr: 10, rbi: 58,  era: '-',    role: 'Center Field',         rarity: 'uncommon' },
    { id: 6,  name: 'Dave Concepcion', position: 'SS',   number: 13, ba: '.245', hr: 4,  rbi: 58,  era: '-',    role: 'Shortstop/Big Red Machine', rarity: 'uncommon' },
    { id: 7,  name: 'Nick Esasky',     position: '3B',   number: 33, ba: '.192', hr: 10, rbi: 45,  era: '-',    role: 'Third Base',           rarity: 'common'   },
    { id: 8,  name: 'Ron Oester',      position: '2B',   number: 16, ba: '.241', hr: 3,  rbi: 38,  era: '-',    role: 'Second Base',          rarity: 'common'   },
    { id: 9,  name: 'Dann Bilardello', position: 'C',    number: 8,  ba: '.207', hr: 2,  rbi: 26,  era: '-',    role: 'Catcher',              rarity: 'common'   },
    { id: 10, name: 'John Franco',     position: 'CL',   number: 31, ba: '-',    hr: '-', rbi: '-', era: '2.61', role: 'Closer',               rarity: 'uncommon' },
    { id: 11, name: 'Jeff Russell',    position: 'SP',   number: 26, ba: '-',    hr: '-', rbi: '-', era: '4.26', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 12, name: 'Joe Price',       position: 'SP',   number: 38, ba: '-',    hr: '-', rbi: '-', era: '4.18', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 13, name: 'Jay Tibbs',       position: 'SP',   number: 43, ba: '-',    hr: '-', rbi: '-', era: '3.86', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 14, name: 'Ted Power',       position: 'RP',   number: 36, ba: '-',    hr: '-', rbi: '-', era: '2.82', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 15, name: 'Tom Hume',        position: 'RP',   number: 22, ba: '-',    hr: '-', rbi: '-', era: '4.33', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 16, name: 'Bob Owchinko',    position: 'RP',   number: 49, ba: '-',    hr: '-', rbi: '-', era: '4.95', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 17, name: 'Brad Gulden',     position: 'C',    number: 10, ba: '.221', hr: 2,  rbi: 10,  era: '-',    role: 'Backup Catcher',       rarity: 'common'   },
    { id: 18, name: 'Duane Walker',    position: 'OF',   number: 24, ba: '.239', hr: 5,  rbi: 22,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
    { id: 19, name: 'Tom Lawless',     position: '2B',   number: 4,  ba: '.218', hr: 0,  rbi: 9,   era: '-',    role: 'Utility Infielder',    rarity: 'common'   },
    { id: 20, name: 'Wayne Krenchicki',position: '3B',   number: 17, ba: '.251', hr: 4,  rbi: 19,  era: '-',    role: 'Bench Utility',        rarity: 'common'   },
    { id: 21, name: 'Eric Davis',      position: 'OF',   number: 44, ba: '.205', hr: 2,  rbi: 7,   era: '-',    role: 'Future Star',          rarity: 'uncommon' },
  ],

  royals: [
    { id: 1,  name: 'George Brett',    position: '3B',   number: 5,  ba: '.284', hr: 13, rbi: 69,  era: '-',    role: 'Third Base/Legend',    rarity: 'rare'     },
    { id: 2,  name: 'Dan Quisenberry', position: 'CL',   number: 29, ba: '-',    hr: '-', rbi: '-', era: '2.64', role: 'Closer/The Submarine', rarity: 'rare'     },
    { id: 3,  name: 'Bret Saberhagen', position: 'SP',   number: 31, ba: '-',    hr: '-', rbi: '-', era: '3.48', role: 'Young Ace',            rarity: 'uncommon' },
    { id: 4,  name: 'Willie Wilson',   position: 'CF',   number: 6,  ba: '.301', hr: 2,  rbi: 44,  era: '-',    role: 'Center Field/Speed',   rarity: 'uncommon' },
    { id: 5,  name: 'Frank White',     position: '2B',   number: 20, ba: '.263', hr: 17, rbi: 56,  era: '-',    role: 'Second Base/Gold Glv', rarity: 'uncommon' },
    { id: 6,  name: 'Hal McRae',       position: 'DH',   number: 11, ba: '.294', hr: 15, rbi: 70,  era: '-',    role: 'Designated Hitter',    rarity: 'uncommon' },
    { id: 7,  name: 'Steve Balboni',   position: '1B',   number: 34, ba: '.237', hr: 28, rbi: 77,  era: '-',    role: 'First Base/Bye-Bye',   rarity: 'common'   },
    { id: 8,  name: 'Pat Sheridan',    position: 'RF',   number: 27, ba: '.270', hr: 9,  rbi: 53,  era: '-',    role: 'Right Field',          rarity: 'common'   },
    { id: 9,  name: 'Darryl Motley',   position: 'LF',   number: 25, ba: '.284', hr: 15, rbi: 70,  era: '-',    role: 'Left Field',           rarity: 'common'   },
    { id: 10, name: 'Jamie Quirk',     position: 'C',    number: 9,  ba: '.238', hr: 5,  rbi: 20,  era: '-',    role: 'Catcher',              rarity: 'common'   },
    { id: 11, name: 'Onix Concepcion', position: 'SS',   number: 1,  ba: '.250', hr: 1,  rbi: 17,  era: '-',    role: 'Shortstop',            rarity: 'common'   },
    { id: 12, name: 'Bud Black',       position: 'SP',   number: 26, ba: '-',    hr: '-', rbi: '-', era: '3.12', role: 'Starting Pitcher',     rarity: 'uncommon' },
    { id: 13, name: 'Charlie Leibrandt',position:'SP',   number: 42, ba: '-',    hr: '-', rbi: '-', era: '3.63', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 14, name: 'Mark Gubicza',    position: 'SP',   number: 23, ba: '-',    hr: '-', rbi: '-', era: '4.05', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 15, name: 'Steve Farr',      position: 'RP',   number: 44, ba: '-',    hr: '-', rbi: '-', era: '3.11', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 16, name: 'Mike Jones',      position: 'RP',   number: 36, ba: '-',    hr: '-', rbi: '-', era: '4.24', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 17, name: 'Joe Beckwith',    position: 'RP',   number: 47, ba: '-',    hr: '-', rbi: '-', era: '3.58', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 18, name: 'Gary Christenson',position: 'RP',   number: 53, ba: '-',    hr: '-', rbi: '-', era: '4.41', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 19, name: 'Dane Iorg',       position: '1B',   number: 15, ba: '.276', hr: 4,  rbi: 26,  era: '-',    role: 'Bench/Utility',        rarity: 'common'   },
    { id: 20, name: 'Buddy Biancalana',position: 'SS',   number: 8,  ba: '.188', hr: 2,  rbi: 10,  era: '-',    role: 'Backup Shortstop',     rarity: 'common'   },
    { id: 21, name: 'John Wathan',     position: 'C',    number: 14, ba: '.249', hr: 4,  rbi: 22,  era: '-',    role: 'Backup Catcher',       rarity: 'common'   },
    { id: 22, name: 'Greg Pryor',      position: 'INF',  number: 12, ba: '.231', hr: 2,  rbi: 14,  era: '-',    role: 'Utility Infielder',    rarity: 'common'   },
    { id: 23, name: 'Cesar Geronimo',  position: 'OF',   number: 32, ba: '.244', hr: 3,  rbi: 18,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
  ],

  dodgers: [
    { id: 1,  name: 'Fernando Valenzuela', position: 'SP', number: 34, ba: '-',  hr: '-', rbi: '-', era: '3.03', role: 'Fernandomania/Lefty',  rarity: 'rare'     },
    { id: 2,  name: 'Pedro Guerrero',  position: '3B',   number: 28, ba: '.303', hr: 16, rbi: 72,  era: '-',    role: 'Third Base/Power',     rarity: 'rare'     },
    { id: 3,  name: 'Orel Hershiser',  position: 'SP',   number: 55, ba: '-',    hr: '-', rbi: '-', era: '2.66', role: 'Bulldog/Ace',          rarity: 'uncommon' },
    { id: 4,  name: 'Steve Sax',       position: '2B',   number: 3,  ba: '.243', hr: 1,  rbi: 35,  era: '-',    role: 'Second Base',          rarity: 'common'   },
    { id: 5,  name: 'Ken Landreaux',   position: 'CF',   number: 21, ba: '.251', hr: 11, rbi: 47,  era: '-',    role: 'Center Field',         rarity: 'common'   },
    { id: 6,  name: 'Mike Marshall',   position: 'RF',   number: 23, ba: '.257', hr: 20, rbi: 65,  era: '-',    role: 'Right Field',          rarity: 'uncommon' },
    { id: 7,  name: 'Mike Scioscia',   position: 'C',    number: 14, ba: '.276', hr: 5,  rbi: 38,  era: '-',    role: 'Catcher',              rarity: 'common'   },
    { id: 8,  name: 'Greg Brock',      position: '1B',   number: 24, ba: '.225', hr: 7,  rbi: 34,  era: '-',    role: 'First Base',           rarity: 'common'   },
    { id: 9,  name: 'Franklin Stubbs', position: 'LF',   number: 31, ba: '.200', hr: 8,  rbi: 24,  era: '-',    role: 'Left Field',           rarity: 'common'   },
    { id: 10, name: 'Dave Anderson',   position: 'SS',   number: 20, ba: '.240', hr: 3,  rbi: 20,  era: '-',    role: 'Shortstop',            rarity: 'common'   },
    { id: 11, name: 'Alejandro Pena',  position: 'SP',   number: 45, ba: '-',    hr: '-', rbi: '-', era: '2.48', role: 'Starting Pitcher',     rarity: 'uncommon' },
    { id: 12, name: 'Bob Welch',       position: 'SP',   number: 35, ba: '-',    hr: '-', rbi: '-', era: '3.78', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 13, name: 'Ken Howell',      position: 'CL',   number: 53, ba: '-',    hr: '-', rbi: '-', era: '3.85', role: 'Closer',               rarity: 'common'   },
    { id: 14, name: 'Tom Niedenfuer',  position: 'RP',   number: 49, ba: '-',    hr: '-', rbi: '-', era: '2.47', role: 'Relief Pitcher',       rarity: 'uncommon' },
    { id: 15, name: 'Pat Zachry',      position: 'RP',   number: 39, ba: '-',    hr: '-', rbi: '-', era: '3.52', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 16, name: 'Carlos Diaz',     position: 'RP',   number: 47, ba: '-',    hr: '-', rbi: '-', era: '3.03', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 17, name: 'Burt Hooton',     position: 'RP',   number: 43, ba: '-',    hr: '-', rbi: '-', era: '4.49', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 18, name: 'Bill Russell',    position: 'SS',   number: 18, ba: '.238', hr: 1,  rbi: 17,  era: '-',    role: 'Veteran Utility',      rarity: 'common'   },
    { id: 19, name: 'Candy Maldonado', position: 'OF',   number: 17, ba: '.248', hr: 6,  rbi: 24,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
    { id: 20, name: 'Bob Bailor',      position: 'INF',  number: 7,  ba: '.231', hr: 2,  rbi: 11,  era: '-',    role: 'Utility Infielder',    rarity: 'common'   },
    { id: 21, name: 'Steve Yeager',    position: 'C',    number: 7,  ba: '.214', hr: 4,  rbi: 19,  era: '-',    role: 'Backup Catcher',       rarity: 'common'   },
    { id: 22, name: 'R.J. Reynolds',   position: 'OF',   number: 16, ba: '.241', hr: 3,  rbi: 18,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
  ],

  phillies: [
    { id: 1,  name: 'Mike Schmidt',    position: '3B',   number: 20, ba: '.277', hr: 36, rbi: 106, era: '-',    role: 'Third Base/Captain',   rarity: 'rare'     },
    { id: 2,  name: 'Steve Carlton',   position: 'SP',   number: 32, ba: '-',    hr: '-', rbi: '-', era: '3.58', role: 'Ace Lefty/Lefty',      rarity: 'rare'     },
    { id: 3,  name: 'Juan Samuel',     position: '2B',   number: 7,  ba: '.272', hr: 15, rbi: 69,  era: '-',    role: 'Second Base',          rarity: 'uncommon' },
    { id: 4,  name: 'Tug McGraw',      position: 'RP',   number: 45, ba: '-',    hr: '-', rbi: '-', era: '3.12', role: 'Ya Gotta Believe!',    rarity: 'uncommon' },
    { id: 5,  name: 'Von Hayes',       position: '1B',   number: 9,  ba: '.292', hr: 16, rbi: 67,  era: '-',    role: 'First Base',           rarity: 'common'   },
    { id: 6,  name: 'Glenn Wilson',    position: 'RF',   number: 11, ba: '.264', hr: 14, rbi: 56,  era: '-',    role: 'Right Field',          rarity: 'common'   },
    { id: 7,  name: 'Ozzie Virgil Jr.',position: 'C',    number: 14, ba: '.261', hr: 18, rbi: 68,  era: '-',    role: 'Catcher',              rarity: 'uncommon' },
    { id: 8,  name: 'Garry Maddox',    position: 'CF',   number: 31, ba: '.258', hr: 3,  rbi: 46,  era: '-',    role: 'Secretary of Defense', rarity: 'uncommon' },
    { id: 9,  name: 'Jeff Stone',      position: 'LF',   number: 25, ba: '.362', hr: 1,  rbi: 18,  era: '-',    role: 'Left Field/Speedster', rarity: 'uncommon' },
    { id: 10, name: 'Ivan DeJesus',    position: 'SS',   number: 6,  ba: '.257', hr: 0,  rbi: 35,  era: '-',    role: 'Shortstop',            rarity: 'common'   },
    { id: 11, name: 'John Denny',      position: 'SP',   number: 23, ba: '-',    hr: '-', rbi: '-', era: '4.64', role: 'Starting Pitcher',     rarity: 'uncommon' },
    { id: 12, name: 'Kevin Gross',     position: 'SP',   number: 33, ba: '-',    hr: '-', rbi: '-', era: '4.12', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 13, name: 'Charles Hudson',  position: 'SP',   number: 44, ba: '-',    hr: '-', rbi: '-', era: '4.04', role: 'Starting Pitcher',     rarity: 'common'   },
    { id: 14, name: 'Al Holland',      position: 'CL',   number: 47, ba: '-',    hr: '-', rbi: '-', era: '5.24', role: 'Closer/Mr. T',         rarity: 'uncommon' },
    { id: 15, name: 'Larry Andersen',  position: 'RP',   number: 37, ba: '-',    hr: '-', rbi: '-', era: '2.38', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 16, name: 'Bill Campbell',   position: 'RP',   number: 39, ba: '-',    hr: '-', rbi: '-', era: '3.96', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 17, name: 'Don Carman',      position: 'RP',   number: 42, ba: '-',    hr: '-', rbi: '-', era: '4.56', role: 'Relief Pitcher',       rarity: 'common'   },
    { id: 18, name: 'Len Matuszek',    position: '1B',   number: 17, ba: '.268', hr: 12, rbi: 43,  era: '-',    role: 'Backup First Base',    rarity: 'common'   },
    { id: 19, name: 'Greg Gross',      position: 'OF',   number: 3,  ba: '.274', hr: 1,  rbi: 14,  era: '-',    role: 'Pinch Hitter',         rarity: 'common'   },
    { id: 20, name: 'John Wockenfuss', position: 'C',    number: 12, ba: '.289', hr: 6,  rbi: 16,  era: '-',    role: 'Backup Catcher',       rarity: 'common'   },
    { id: 21, name: 'Bo Diaz',         position: 'C',    number: 15, ba: '.240', hr: 5,  rbi: 26,  era: '-',    role: 'Backup Catcher',       rarity: 'common'   },
    { id: 22, name: 'Sixto Lezcano',   position: 'OF',   number: 22, ba: '.237', hr: 4,  rbi: 19,  era: '-',    role: 'Bench Outfielder',     rarity: 'common'   },
  ],

};

// Merge in extra rosters
export const ALL_ROSTERS_FULL = {
  ...ALL_ROSTERS,
  ...EXTRA_ROSTERS,
};

// ── Team metadata for UI ──
export const TEAM_CARD_META = {
  tigers:   { label: '🐯 Detroit Tigers',         color: '#f97316', storageKey: 'tigersCards'    },
  padres:   { label: '⚾ San Diego Padres',        color: '#7b5c2e', storageKey: 'padresCards'    },
  cubs:     { label: '🐻 Chicago Cubs',            color: '#0e3386', storageKey: 'cubsCards'      },
  mets:     { label: '🗽 New York Mets',           color: '#ff5910', storageKey: 'metsCards'      },
  redsox:   { label: '🧦 Boston Red Sox',          color: '#bd3039', storageKey: 'redsoxCards'    },
  yankees:  { label: '🏟 New York Yankees',        color: '#1c2841', storageKey: 'yankeesCards'   },
  orioles:  { label: '🐦 Baltimore Orioles',       color: '#df4601', storageKey: 'oriolesCards'   },
  reds:     { label: '🔴 Cincinnati Reds',         color: '#c6011f', storageKey: 'redsCards'      },
  royals:   { label: '👑 Kansas City Royals',      color: '#004687', storageKey: 'royalsCards'    },
  dodgers:  { label: '💙 Los Angeles Dodgers',     color: '#005a9c', storageKey: 'dodgersCards'   },
  phillies: { label: '🔔 Philadelphia Phillies',   color: '#e81828', storageKey: 'philliesCards'  },
  bluejays: { label: '🍁 Toronto Blue Jays',       color: '#134a8e', storageKey: 'bluejaysCards'  },
  indians:  { label: '🔴 Cleveland Indians',       color: '#cc0000', storageKey: 'indiansCards'   },
  brewers:  { label: '🍺 Milwaukee Brewers',       color: '#12284b', storageKey: 'brewersCards'   },
  twins:    { label: '⭐ Minnesota Twins',         color: '#002b5c', storageKey: 'twinsCards'     },
  athletics:{ label: '🐘 Oakland Athletics',       color: '#003831', storageKey: 'athleticsCards' },
  angels:   { label: '🌟 California Angels',       color: '#ba0021', storageKey: 'angelsCards'    },
  whitesox: { label: '⚾ Chicago White Sox',       color: '#27251f', storageKey: 'whitesoxCards'  },
  mariners: { label: '🌧️ Seattle Mariners',       color: '#0c2c56', storageKey: 'marinersCards'  },
  rangers:  { label: '🤠 Texas Rangers',           color: '#003278', storageKey: 'rangersCards'   },
  expos:    { label: '⚾ Montreal Expos',          color: '#003263', storageKey: 'exposCards'     },
  cardinals:{ label: '🐦 St. Louis Cardinals',    color: '#c41e3a', storageKey: 'cardinalsCards' },
  pirates:  { label: '🏴‍☠️ Pittsburgh Pirates',  color: '#fdb827', storageKey: 'piratesCards'   },
  braves:   { label: '🗡️ Atlanta Braves',         color: '#ce1141', storageKey: 'bravesCards'    },
  astros:   { label: '🌟 Houston Astros',          color: '#eb6e1f', storageKey: 'astrosCards'    },
  giants:   { label: '🔥 San Francisco Giants',   color: '#fd5a1e', storageKey: 'giantsCards'    },
};

export { MANAGER_CARDS };

// ── Per-team in-memory sets ──
const _sets = {};
Object.keys(TEAM_CARD_META).forEach(t => { _sets[t] = new Set(); });

// ── API ──

export function getRoster(teamKey) {
  return ALL_ROSTERS_FULL[teamKey] || [];
}

export function getManagerCard(teamKey) {
  const mgr = MANAGER_CARDS[teamKey];
  if (!mgr) return null;
  return { id: 0, ...mgr, position: 'MGR', ba: '-', hr: '-', rbi: '-', era: '-', isManager: true };
}

export function getAllTeamKeys() {
  return Object.keys(TEAM_CARD_META);
}

export function getRandomCardForTeam(teamKey) {
  const roster = getRoster(teamKey);
  return roster[Math.floor(Math.random() * roster.length)];
}

export function addCard(teamKey, cardId) {
  if (!_sets[teamKey]) return [];
  _sets[teamKey].add(cardId);
  const count = _sets[teamKey].size;
  const total = getRoster(teamKey).length;
  const unlocked = [];
  const key = teamKey;

  if (count === 5 && !localStorage.getItem(`ach_${key}_cards_5`)) {
    localStorage.setItem(`ach_${key}_cards_5`, Date.now());
    unlocked.push(`${key}_card_starter`);
  }
  if (count === Math.floor(total / 2) && !localStorage.getItem(`ach_${key}_cards_half`)) {
    localStorage.setItem(`ach_${key}_cards_half`, Date.now());
    unlocked.push(`${key}_card_collector`);
  }
  if (count === total && !localStorage.getItem(`ach_${key}_cards_full`)) {
    localStorage.setItem(`ach_${key}_cards_full`, Date.now());
    unlocked.push(`${key}_complete_roster`);
  }
  return unlocked;
}

export function getCollectedIds(teamKey) {
  return Array.from(_sets[teamKey] || []);
}

export function getProgress(teamKey) {
  const collected = (_sets[teamKey] || new Set()).size;
  const total = getRoster(teamKey).length;
  return { collected, total, percentage: total ? Math.round((collected / total) * 100) : 0 };
}

export function loadFromStorage(teamKey) {
  const meta = TEAM_CARD_META[teamKey];
  if (!meta) return;
  const stored = localStorage.getItem(meta.storageKey);
  if (stored) {
    JSON.parse(stored).forEach(id => _sets[teamKey].add(id));
  }
}

export function saveToStorage(teamKey) {
  const meta = TEAM_CARD_META[teamKey];
  if (!meta) return;
  localStorage.setItem(meta.storageKey, JSON.stringify(Array.from(_sets[teamKey])));
}

// Migrate legacy Tigers/Phillies storage keys
// NOTE: Old IDs don't match new roster ordering — clear ALL old card data to avoid mismatches
export function migrateLegacyStorage() {
  const MIGRATION_KEY = 'cards_migration_v2';
  if (localStorage.getItem(MIGRATION_KEY)) return; // already ran
  // Clear all old card storage so stale IDs don't cause name/stats mismatches
  localStorage.removeItem('tigersCardCollection');
  localStorage.removeItem('philliesCardCollection');
  localStorage.removeItem('tigersCards');
  localStorage.removeItem('philliesCards');
  // Clear in-memory sets too
  if (_sets['tigers']) _sets['tigers'].clear();
  if (_sets['phillies']) _sets['phillies'].clear();
  localStorage.setItem(MIGRATION_KEY, Date.now());
}