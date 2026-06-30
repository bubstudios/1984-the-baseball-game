import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { seasonId, gameDay } = await req.json();
    
    if (!seasonId || !gameDay) {
      return Response.json({ error: 'Missing seasonId or gameDay' }, { status: 400 });
    }

    console.log(`Simulating Season ${seasonId}, Game Day ${gameDay}`);

    const schedule = await base44.entities.Schedule.filter({ 
      seasonId, 
      gameDay, 
      status: 'scheduled' 
    });

    if (schedule.length === 0) {
      return Response.json({ 
        message: 'No games scheduled', 
        gameDay,
        gamesSimulated: 0 
      });
    }

    const results = [];
    const userTeamGame = schedule.find(g => g.isUserGame);

    for (const game of schedule) {
      try {
        if (game.isUserGame) {
          results.push({
            homeTeam: game.homeTeam,
            awayTeam: game.awayTeam,
            status: 'pending_user'
          });
          continue;
        }

        const homeRuns = Math.floor(Math.random() * 8) + 2;
        const awayRuns = Math.floor(Math.random() * 8) + 2;
        const winner = homeRuns > awayRuns ? game.homeTeam : (awayRuns > homeRuns ? game.awayTeam : game.homeTeam);

        const gameResult = await base44.asServiceRole.entities.GameResult.create({
          seasonId,
          gameDay,
          gameDate: game.gameDate,
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          homeScore: homeRuns,
          awayScore: awayRuns,
          winner,
          isUserGame: false,
          homeHits: Math.floor(Math.random() * 10) + 5,
          awayHits: Math.floor(Math.random() * 10) + 5,
          homeHRs: [],
          awayHRs: [],
          winningPitcher: 'TBD',
          losingPitcher: 'TBD',
          savePitcher: null,
          attendance: Math.floor(Math.random() * 30000) + 15000,
          stadium: game.stadium || 'Stadium',
          weather: 'Clear',
          innings: Array(9).fill(null).map(() => ({ home: Math.floor(Math.random() * 3), away: Math.floor(Math.random() * 3) }))
        });
        
        await base44.entities.Schedule.update(game.id, {
          status: 'completed',
          homeScore: homeRuns,
          awayScore: awayRuns,
          gameResultId: gameResult.id
        });

        results.push({
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          homeScore: homeRuns,
          awayScore: awayRuns,
          winner,
          status: 'completed'
        });

      } catch (gameError) {
        console.error(`Sim error:`, gameError);
        results.push({
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          status: 'error',
          error: gameError.message
        });
      }
    }

    const completedGames = await base44.entities.GameResult.filter({ seasonId });
    await base44.entities.Season.update(seasonId, {
      currentGameDay: gameDay,
      currentDate: schedule[0]?.gameDate,
      completedGames: completedGames.length
    });

    return Response.json({
      success: true,
      gameDay,
      gamesSimulated: results.filter(r => r.status === 'completed').length,
      userTeamGame: userTeamGame,
      results
    });

  } catch (error) {
    console.error('simulateDay error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});