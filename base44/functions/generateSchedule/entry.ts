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

    // 1984 MLB schedule structure (historically accurate):
    // NL (12 teams, 6 per division): 18 games vs 5 division rivals (90) + 12 games vs 6 cross-division (72) = 162
    // AL (14 teams, 7 per division): 13 games vs 6 division rivals (78) + 12 games vs 7 cross-division (84) = 162
    function generateMatchups(divA, divB, inDivGames, crossDivGames) {
      const matchups = [];
      // In-division matchups
      for (const div of [divA, divB]) {
        for (let i = 0; i < div.length; i++) {
          for (let j = i + 1; j < div.length; j++) {
            const team1 = div[i];
            const team2 = div[j];
            for (let g = 0; g < inDivGames; g++) {
              const homeTeam = g % 2 === 0 ? team1 : team2;
              const awayTeam = g % 2 === 0 ? team2 : team1;
              matchups.push({ home: homeTeam, away: awayTeam });
            }
          }
        }
      }
      // Cross-division matchups
      for (let i = 0; i < divA.length; i++) {
        for (let j = 0; j < divB.length; j++) {
          const team1 = divA[i];
          const team2 = divB[j];
          for (let g = 0; g < crossDivGames; g++) {
            const homeTeam = g % 2 === 0 ? team1 : team2;
            const awayTeam = g % 2 === 0 ? team2 : team1;
            matchups.push({ home: homeTeam, away: awayTeam });
          }
        }
      }
      return matchups;
    }

    // AL: 13 in-division, 12 cross-division = 78 + 84 = 162 per team
    const alMatchups = generateMatchups(AL_EAST, AL_WEST, 13, 12);
    // NL: 18 in-division, 12 cross-division = 90 + 72 = 162 per team
    const nlMatchups = generateMatchups(NL_EAST, NL_WEST, 18, 12);

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