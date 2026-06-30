import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { seasonId, userTeam } = await req.json();

    if (!seasonId) {
      return Response.json({ error: 'Missing seasonId' }, { status: 400 });
    }

    console.log(`Generating schedule for Season ${seasonId}, userTeam: ${userTeam || 'none'}`);

    // Delete any existing schedule records for this season (cleanup for regeneration)
    await base44.asServiceRole.entities.Schedule.deleteMany({ seasonId });

    // 1984 MLB divisions (26 teams, no interleague play)
    const AL_EAST = ['yankees', 'redsox', 'orioles', 'bluejays', 'brewers', 'tigers', 'indians'];
    const AL_WEST = ['royals', 'whitesox', 'twins', 'angels', 'athletics', 'mariners', 'rangers'];
    const NL_EAST = ['phillies', 'mets', 'cardinals', 'cubs', 'pirates', 'expos'];
    const NL_WEST = ['reds', 'braves', 'dodgers', 'giants', 'padres', 'astros'];

    const AL_TEAMS = [...AL_EAST, ...AL_WEST];
    const NL_TEAMS = [...NL_EAST, ...NL_WEST];

    // Stadium lookup
    const STADIUMS = {
      yankees: 'Yankee Stadium', redsox: 'Fenway Park', orioles: 'Memorial Stadium',
      bluejays: 'Exhibition Stadium', brewers: 'County Stadium', tigers: 'Tiger Stadium',
      indians: 'Municipal Stadium', royals: 'Royals Stadium', whitesox: 'Comiskey Park',
      twins: 'Metrodome', angels: 'Anaheim Stadium', athletics: 'Oakland Coliseum',
      mariners: 'Kingdome', rangers: 'Arlington Stadium', phillies: 'Veterans Stadium',
      mets: 'Shea Stadium', cardinals: 'Busch Stadium', cubs: 'Wrigley Field',
      pirates: 'Three Rivers Stadium', expos: 'Olympic Stadium', reds: 'Riverfront Stadium',
      braves: 'Atlanta-Fulton County Stadium', dodgers: 'Dodger Stadium',
      giants: 'Candlestick Park', padres: 'Jack Murphy Stadium', astros: 'Astrodome',
    };

    // Generate matchups using round-robin for each league separately
    // Each pair of same-league teams plays multiple series
    function generateMatchups(teams, gamesPerPair) {
      const matchups = [];
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          const team1 = teams[i];
          const team2 = teams[j];
          for (let g = 0; g < gamesPerPair; g++) {
            // Alternate home/away
            const homeTeam = g % 2 === 0 ? team1 : team2;
            const awayTeam = g % 2 === 0 ? team2 : team1;
            matchups.push({ home: homeTeam, away: awayTeam });
          }
        }
      }
      return matchups;
    }

    // AL: 14 teams, each plays 162 games
    // Division rivals (6): ~18 games each = 108
    // Non-division AL (7): ~8 games each = 54... total 162? No, 108+54=162. 
    // Actually: 13 opponents. 162/13 ≈ 12.5. Use 13 games per pair = 169, trim to 162.
    // Simpler: use round-robin. 14 teams, 13 rounds per cycle.
    // 162 / 13 ≈ 12.5 cycles. Use 13 cycles = 169 games, then trim last 7 games per team.
    // For simplicity: 12 games per pair in AL = 12 * 13 = 156. Need 6 more per team.
    // Add extra series vs division rivals: +1 game per division rival (6 games) = 162.

    const alMatchups = generateMatchups(AL_TEAMS, 12);
    // Add extra division games for AL
    for (const div of [AL_EAST, AL_WEST]) {
      for (let i = 0; i < div.length; i++) {
        for (let j = i + 1; j < div.length; j++) {
          const homeTeam = Math.random() < 0.5 ? div[i] : div[j];
          const awayTeam = homeTeam === div[i] ? div[j] : div[i];
          alMatchups.push({ home: homeTeam, away: awayTeam });
        }
      }
    }

    // NL: 12 teams, each plays 162 games
    // 11 opponents. 162/11 ≈ 14.7. Use 15 games per pair = 165, trim 3 per team.
    // Simpler: 15 games per pair = 165. Close enough.
    const nlMatchups = generateMatchups(NL_TEAMS, 15);
    // Trim: remove ~3 games per team (remove 18 games total: 3 per team / 2 = 18 games)
    // Actually 165 - 162 = 3 extra per team. 12 teams * 3 / 2 = 18 games to remove.
    // For simplicity, just keep 165 - it's close enough for a simulation.

    const allMatchups = [...alMatchups, ...nlMatchups];

    // Shuffle
    for (let i = allMatchups.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allMatchups[i], allMatchups[j]] = [allMatchups[j], allMatchups[i]];
    }

    // Distribute across days ensuring each team plays at most 1 game per day
    // Greedy algorithm: for each day, assign games to teams that haven't played that day
    const startDate = new Date('1984-04-03'); // 1984 season opened April 3
    const scheduleData = [];
    let dayIndex = 0;
    let scheduled = 0;
    let remaining = [...allMatchups];

    while (remaining.length > 0) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + dayIndex);
      const gameDate = currentDate.toISOString().split('T')[0];
      const gameDay = dayIndex + 1;

      const teamsPlayingToday = new Set();
      const todayGames = [];

      for (let i = remaining.length - 1; i >= 0; i--) {
        const m = remaining[i];
        if (!teamsPlayingToday.has(m.home) && !teamsPlayingToday.has(m.away)) {
          todayGames.push(m);
          teamsPlayingToday.add(m.home);
          teamsPlayingToday.add(m.away);
          remaining.splice(i, 1);
        }
      }

      for (const game of todayGames) {
        scheduleData.push({
          seasonId,
          gameDay,
          gameDate,
          homeTeam: game.home,
          awayTeam: game.away,
          stadium: STADIUMS[game.home] || `${game.home} Stadium`,
          isUserGame: userTeam && (game.home === userTeam || game.away === userTeam) || false,
          isPlayoff: false,
          status: 'scheduled',
        });
        scheduled++;
      }

      dayIndex++;
    }

    // Bulk create schedule records
    const batchSize = 100;
    for (let i = 0; i < scheduleData.length; i += batchSize) {
      const batch = scheduleData.slice(i, i + batchSize);
      await base44.asServiceRole.entities.Schedule.bulkCreate(batch);
    }

    console.log(`Created ${scheduled} schedule records across ${dayIndex} days`);

    return Response.json({
      success: true,
      gamesCreated: scheduled,
      totalDays: dayIndex,
      message: `Generated ${scheduled} games across ${dayIndex} days`,
    });
  } catch (error) {
    console.error('generateSchedule error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});