import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { team } = await req.json().catch(() => ({}));

    const pitchersByTeam = {
      cubs: "Rick Sutcliffe, Steve Trout, Dennis Eckersley, Scott Sanderson, Lee Smith, Tim Stoddard, George Frazier",
      tigers: "Jack Morris, Dan Petry, Milt Wilcox, Juan Berenguer, Willie Hernandez, Aurelio Lopez, Doug Bair",
      padres: "Eric Show, Ed Whitson, Tim Lollar, Andy Hawkins, Goose Gossage, Craig Lefferts, Dave Dravecky",
      mets: "Dwight Gooden, Ron Darling, Walt Terrell, Bruce Berenyi, Jesse Orosco, Doug Sisk, Brent Gaff",
      redsox: "Bruce Hurst, Oil Can Boyd, Bob Ojeda, Al Nipper, Bob Stanley, Mark Clear, John Henry Johnson",
      yankees: "Phil Niekro, Ron Guidry, Ray Fontenot, Dennis Rasmussen, Dave Righetti, Jay Howell, Mike Armstrong",
      orioles: "Mike Boddicker, Scott McGregor, Storm Davis, Mike Flanagan, Tippy Martinez, Sammy Stewart, Tom Underwood",
      dodgers: "Alejandro Pena, Orel Hershiser, Fernando Valenzuela, Bob Welch, Ken Howell, Pat Zachry, Carlos Diaz",
      all: "Rick Sutcliffe, Steve Trout, Dennis Eckersley, Scott Sanderson, Lee Smith, Jack Morris, Dan Petry, Milt Wilcox, Juan Berenguer, Willie Hernandez, Aurelio Lopez, Dwight Gooden, Ron Darling, Walt Terrell, Jesse Orosco, Bruce Hurst, Oil Can Boyd, Bob Ojeda, Bob Stanley, Phil Niekro, Ron Guidry, Dave Righetti, Mike Boddicker, Scott McGregor, Storm Davis, Alejandro Pena, Orel Hershiser, Fernando Valenzuela, Bob Welch, Eric Show, Ed Whitson, Goose Gossage"
    };

    const pitcherList = pitchersByTeam[team] || pitchersByTeam.all;

    const prompt = `For each of these 1984 MLB pitchers, give me: Throws (L/R), AB vs LHB, BA allowed vs LHB, HR allowed vs LHB, AB vs RHB, BA allowed vs RHB, HR allowed vs RHB. Also total IP, total ERA, total SO.

Pitchers: ${pitcherList}

Use baseball-reference.com splits data. Return as JSON.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          pitchers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                team: { type: 'string' },
                throws: { type: 'string' },
                ip: { type: 'number' },
                era: { type: 'number' },
                so: { type: 'number' },
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