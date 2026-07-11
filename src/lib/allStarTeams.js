// allStarTeams.js - Builds synthetic TEAMS entries for the All-Star Game.
// Looks up each selected player's full rating object from TEAMS and constructs
// a team object compatible with the game engine (lineup, bench, rotation, bullpen).

import { TEAMS } from './gameData';

// Look up a player's full object from TEAMS by teamKey + name
function lookupPlayer(teamKey, name) {
  const td = TEAMS[teamKey];
  if (!td) return null;
  const pool = [...(td.lineup || []), ...(td.bench || []), ...(td.rotation || []), ...(td.bullpen || [])];
  return pool.find(p => p.name === name) || null;
}

// Build a synthetic team object for the All-Star Game
// roster: { battingOrder: [{name, teamKey, pos}], bench: [...], pitchers: { starters, relievers, startingPitcherName } }
// league: 'AL' or 'NL'
// stadium: stadium name string
export function buildAllStarTeamObject(roster, league, stadium) {
  if (!roster) return null;

  // Build the starting lineup (9 players: 8 position + starting pitcher)
  const lineup = [];
  for (let i = 0; i < (roster.battingOrder || []).length; i++) {
    const entry = roster.battingOrder[i];
    const player = lookupPlayer(entry.teamKey, entry.name);
    if (!player) continue;
    lineup.push({
      ...player,
      pos: entry.pos,
      assignedPos: entry.pos,
      order: i + 1,
      gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 },
      _allStarTeamKey: entry.teamKey,
    });
  }

  // Add the starting pitcher as the 9th batter
  const spName = roster.pitchers?.startingPitcherName;
  let startingPitcher = null;
  if (spName) {
    // Find the SP in the starters list
    const spEntry = (roster.pitchers?.starters || []).find(p => p.name === spName);
    if (spEntry) {
      const player = lookupPlayer(spEntry.teamKey, spEntry.name);
      if (player) {
        startingPitcher = {
          ...player,
          pos: 'SP',
          assignedPos: 'SP',
          order: lineup.length + 1,
          gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 },
          _allStarTeamKey: spEntry.teamKey,
        };
        lineup.push(startingPitcher);
      }
    }
  }

  // Build the bench (remaining position players)
  const bench = (roster.bench || []).map(entry => {
    const player = lookupPlayer(entry.teamKey, entry.name);
    if (!player) return null;
    return {
      ...player,
      pos: entry.pos,
      _allStarTeamKey: entry.teamKey,
    };
  }).filter(Boolean);

  // Build the rotation (starting pitchers, excluding the starter who's in the lineup)
  const rotation = (roster.pitchers?.starters || [])
    .filter(p => p.name !== spName)
    .map(entry => {
      const player = lookupPlayer(entry.teamKey, entry.name);
      if (!player) return null;
      return { ...player, pos: 'SP', _allStarTeamKey: entry.teamKey };
    }).filter(Boolean);

  // Build the bullpen: ALL non-starting pitchers (starters + relievers) so they
  // all appear in the Change Pitcher screen. In the All-Star Game, every
  // selected pitcher must be available as a relief option - starting pitchers
  // can come out of the bullpen just like relievers.
  const allNonStartingPitchers = [
    ...(roster.pitchers?.starters || []).filter(p => p.name !== spName),
    ...(roster.pitchers?.relievers || []),
  ];
  const bullpen = allNonStartingPitchers.map(entry => {
    const player = lookupPlayer(entry.teamKey, entry.name);
    if (!player) return null;
    return { ...player, pos: entry.pos || 'RP', _allStarTeamKey: entry.teamKey };
  }).filter(Boolean);

  return {
    city: league === 'AL' ? 'American League' : 'National League',
    name: 'All-Stars',
    abbr: league,
    league: league,
    division: league === 'AL' ? 'AL All-Star' : 'NL All-Star',
    stadium: stadium,
    lineup,
    bench,
    rotation: startingPitcher ? [startingPitcher, ...rotation] : rotation,
    bullpen,
    _isAllStarTeam: true,
  };
}

// Inject All-Star teams into the TEAMS object so the game engine can find them.
// This must be called BEFORE createGameState.
export function injectAllStarTeams(rosters) {
  if (!rosters) return;
  const stadium = rosters.stadium || 'All-Star Stadium';
  TEAMS.AL_ALLSTAR = buildAllStarTeamObject(rosters.AL, 'AL', stadium);
  TEAMS.NL_ALLSTAR = buildAllStarTeamObject(rosters.NL, 'NL', stadium);
}

// Clean up: remove All-Star teams from TEAMS after the game
export function removeAllStarTeams() {
  delete TEAMS.AL_ALLSTAR;
  delete TEAMS.NL_ALLSTAR;
}

// Determine which All-Star team key corresponds to a league
export function getAllStarTeamKey(league) {
  return league === 'AL' ? 'AL_ALLSTAR' : 'NL_ALLSTAR';
}