import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { team } = await req.json().catch(() => ({}));

    const playersByTeam = {
      cubs: "Bob Dernier, Ryne Sandberg, Gary Matthews, Leon Durham, Keith Moreland, Jody Davis, Ron Cey, Larry Bowa, Thad Bosley, Richie Hebner, Henry Cotto, Steve Lake, Dave Owen",
      tigers: "Lou Whitaker, Alan Trammell, Kirk Gibson, Lance Parrish, Darrell Evans, Chet Lemon, Larry Herndon, Howard Johnson, Barbaro Garbey",
      padres: "Alan Wiggins, Tony Gwynn, Steve Garvey, Graig Nettles, Terry Kennedy, Kevin McReynolds, Carmelo Martinez, Garry Templeton",
      mets: "Wally Backman, Mookie Wilson, Keith Hernandez, Darryl Strawberry, George Foster, Hubie Brooks, Mike Fitzgerald, Jose Oquendo",
      redsox: "Wade Boggs, Dwight Evans, Jim Rice, Tony Armas, Mike Easler, Bill Buckner, Rich Gedman, Marty Barrett, Jackie Gutierrez",
      yankees: "Willie Randolph, Don Mattingly, Dave Winfield, Don Baylor, Steve Kemp, Ken Griffey Sr., Butch Wynegar, Mike Pagliarulo, Bobby Meacham",
      orioles: "Al Bumbry, Cal Ripken Jr., Eddie Murray, Gary Roenicke, Wayne Gross, Ken Singleton, Mike Young, Rich Dauer, Rick Dempsey",
      dodgers: "Steve Sax, Ken Landreaux, Pedro Guerrero, Mike Marshall, Mike Scioscia, Greg Brock, Franklin Stubbs, Dave Anderson"
    };

    const playerList = playersByTeam[team] || Object.values(playersByTeam).join(', ');

    const prompt = `For each of these MLB players in 1984, give me: AB vs LHP, Batting Average vs LHP, HR vs LHP, AB vs RHP, Batting Average vs RHP, HR vs RHP. Also batting handedness (L/R/S), total AB, total BA, total HR.

Players: ${playerList}

Use baseball-reference.com splits data. If a player has fewer than 20 ABs against a side, note it. Return as JSON array.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          players: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                team: { type: 'string' },
                bats: { type: 'string' },
                abTotal: { type: 'number' },
                baTotal: { type: 'number' },
                hrTotal: { type: 'number' },
                abVsL: { type: 'number' },
                baVsL: { type: 'number' },
                hrVsL: { type: 'number' },
                abVsR: { type: 'number' },
                baVsR: { type: 'number' },
                hrVsR: { type: 'number' }
              }
            }
          }
        }
      }
    });

    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});