import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { seasonId } = await req.json();
    
    if (!seasonId) {
      return Response.json({ error: 'Missing seasonId' }, { status: 400 });
    }

    console.log(`Generating schedule for Season ${seasonId}`);

    const AL_EAST = ['yankees', 'redsox', 'orioles', 'bluejays', 'brewers'];
    const AL_CENTRAL = ['indians', 'tigers', 'royals', 'whitesox', 'twins'];
    const AL_WEST = ['angels', 'athletics', 'mariners', 'rangers', 'astros'];
    const NL_EAST = ['phillies', 'mets', 'cardinals', 'cubs', 'pirates'];
    const NL_CENTRAL = ['braves', 'reds', 'dodgers', 'giants', 'padres'];
    const NL_WEST = ['expos', 'marlins', 'rockies', 'diamondbacks', 'nationals'];

    const ALL_TEAMS = [
      ...AL_EAST, ...AL_CENTRAL, ...AL_WEST,
      ...NL_EAST, ...NL_CENTRAL, ...NL_WEST
    ];

    const matchups = [];
    
    for (let i = 0; i < ALL_TEAMS.length; i++) {
      for (let j = i + 1; j < ALL_TEAMS.length; j++) {
        const team1 = ALL_TEAMS[i];
        const team2 = ALL_TEAMS[j];
        const numGames = 12;
        
        for (let g = 0; g < numGames; g++) {
          const homeTeam = g % 2 === 0 ? team1 : team2;
          const awayTeam = g % 2 === 0 ? team2 : team1;
          matchups.push({ home: homeTeam, away: awayTeam });
        }
      }
    }

    for (let i = matchups.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [matchups[i], matchups[j]] = [matchups[j], matchups[i]];
    }

    const startDate = new Date('1984-04-02');
    const totalDays = 183;
    const gamesPerDay = Math.ceil(matchups.length / totalDays);
    
    const scheduleData = [];
    let created = 0;
    let dayIndex = 0;

    for (let i = 0; i < matchups.length; i++) {
      const matchup = matchups[i];
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + dayIndex);
      
      const gameDate = currentDate.toISOString().split('T')[0];
      const gameDay = dayIndex + 1;

      scheduleData.push({
        seasonId,
        gameDay,
        gameDate,
        homeTeam: matchup.home,
        awayTeam: matchup.away,
        stadium: `${matchup.home} Stadium`,
        isUserGame: false,
        isPlayoff: false,
        status: 'scheduled'
      });

      created++;
      if ((i + 1) % gamesPerDay === 0) {
        dayIndex++;
      }
    }

    for (const game of scheduleData) {
      await base44.asServiceRole.entities.Schedule.create(game);
    }

    console.log(`Created ${created} schedule records`);

    return Response.json({
      success: true,
      gamesCreated: created,
      totalDays,
      message: `Generated ${created} games across ${totalDays} days`
    });

  } catch (error) {
    console.error('generateSchedule error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});