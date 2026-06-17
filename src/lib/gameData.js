// 1984 MLB Teams & Players — ratings + real split data
// Hitters: Contact, Power, Bunting, Speed, Defense, Arm (1-10), splits (BA/HR vs LHP/RHP)
// Pitchers: Stamina, PitchSpeed, OffSpeed, Control (1-10), throws (L/R)

export const TEAMS = {
  tigers: {
    city: "Detroit",
    name: "Tigers",
    abbr: "DET",
    league: "AL",
    stadium: "Tiger Stadium",
    lineup: [
      { name: "Lou Whitaker", pos: "2B", bats: "L", contact: 8, power: 4, bunting: 5, speed: 5, defense: 9, arm: 6,
        splits: { vsLHP: { ab: 168, ba: .262, hr: 0 }, vsRHP: { ab: 434, ba: .300, hr: 13 } } },
      { name: "Alan Trammell", pos: "SS", bats: "R", contact: 8, power: 5, bunting: 6, speed: 6, defense: 9, arm: 8,
        splits: { vsLHP: { ab: 161, ba: .311, hr: 4 }, vsRHP: { ab: 394, ba: .315, hr: 10 } } },
      { name: "Kirk Gibson", pos: "RF", bats: "L", contact: 7, power: 8, bunting: 3, speed: 7, defense: 7, arm: 8,
        splits: { vsLHP: { ab: 104, ba: .212, hr: 5 }, vsRHP: { ab: 427, ba: .300, hr: 22 } } },
      { name: "Lance Parrish", pos: "C", bats: "R", contact: 6, power: 9, bunting: 2, speed: 3, defense: 7, arm: 9,
        splits: { vsLHP: { ab: 191, ba: .209, hr: 7 }, vsRHP: { ab: 387, ba: .251, hr: 26 } } },
      { name: "Darrell Evans", pos: "1B", bats: "L", contact: 6, power: 7, bunting: 2, speed: 3, defense: 6, arm: 5,
        splits: { vsLHP: { ab: 85, ba: .141, hr: 1 }, vsRHP: { ab: 377, ba: .252, hr: 15 } } },
      { name: "Chet Lemon", pos: "CF", bats: "R", contact: 7, power: 6, bunting: 4, speed: 5, defense: 8, arm: 7,
        splits: { vsLHP: { ab: 169, ba: .237, hr: 3 }, vsRHP: { ab: 338, ba: .308, hr: 17 } } },
      { name: "Larry Herndon", pos: "LF", bats: "R", contact: 7, power: 5, bunting: 4, speed: 6, defense: 6, arm: 6,
        splits: { vsLHP: { ab: 43, ba: .209, hr: 1 }, vsRHP: { ab: 382, ba: .288, hr: 6 } } },
      { name: "Howard Johnson", pos: "3B", bats: "S", contact: 6, power: 5, bunting: 4, speed: 6, defense: 5, arm: 7,
        splits: { vsLHP: { ab: 87, ba: .218, hr: 3 }, vsRHP: { ab: 268, ba: .254, hr: 9 } } },
      { name: "Barbaro Garbey", pos: "DH", bats: "R", contact: 7, power: 3, bunting: 4, speed: 4, defense: 0, arm: 0,
        splits: { vsLHP: { ab: 98, ba: .296, hr: 1 }, vsRHP: { ab: 229, ba: .279, hr: 4 } } },
    ],
    bench: [
      { name: "Johnny Grubb", pos: "OF", bats: "L", contact: 6, power: 4, bunting: 3, speed: 3, defense: 5, arm: 5,
        splits: estSplits(.276, 8, 134, 50, "L") },
      { name: "Dave Bergman", pos: "1B", bats: "L", contact: 6, power: 3, bunting: 4, speed: 3, defense: 6, arm: 4,
        splits: estSplits(.282, 5, 170, 45, "L") },
      { name: "Rusty Kuntz", pos: "OF", bats: "R", contact: 5, power: 2, bunting: 5, speed: 6, defense: 6, arm: 4,
        splits: estSplits(.267, 3, 118, 35, "R") },
      { name: "Marty Castillo", pos: "C/3B", bats: "R", contact: 5, power: 2, bunting: 4, speed: 3, defense: 6, arm: 6,
        splits: estSplits(.233, 3, 134, 30, "R") },
      { name: "Tom Brookens", pos: "3B", bats: "R", contact: 5, power: 3, bunting: 5, speed: 5, defense: 7, arm: 6,
        splits: estSplits(.258, 6, 251, 70, "R") },
    ],
    rotation: [
      { name: "Jack Morris", pos: "SP", throws: "R", bats: "R", stamina: 10, pitchSpeed: 7, offSpeed: 8, control: 6, contact: 3, power: 1, bunting: 4, speed: 2 },
      { name: "Dan Petry", pos: "SP", throws: "R", bats: "R", stamina: 8, pitchSpeed: 6, offSpeed: 7, control: 7, contact: 3, power: 1, bunting: 4, speed: 2 },
      { name: "Milt Wilcox", pos: "SP", throws: "R", bats: "R", stamina: 8, pitchSpeed: 5, offSpeed: 7, control: 6, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Juan Berenguer", pos: "SP", throws: "R", bats: "R", stamina: 6, pitchSpeed: 7, offSpeed: 6, control: 4, contact: 2, power: 1, bunting: 3, speed: 2 },
    ],
    bullpen: [
      { name: "Willie Hernandez", pos: "CL", throws: "L", bats: "L", stamina: 4, pitchSpeed: 7, offSpeed: 10, control: 9, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Aurelio Lopez", pos: "RP", throws: "R", bats: "R", stamina: 5, pitchSpeed: 6, offSpeed: 7, control: 7, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Doug Bair", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 6, offSpeed: 6, control: 5, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Bill Scherrer", pos: "RP", throws: "L", bats: "L", stamina: 4, pitchSpeed: 6, offSpeed: 5, control: 6, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Sid Monge", pos: "RP", throws: "L", bats: "L", stamina: 4, pitchSpeed: 5, offSpeed: 6, control: 5, contact: 2, power: 1, bunting: 3, speed: 2 },
    ],
  },

  padres: {
    city: "San Diego",
    name: "Padres",
    abbr: "SD",
    league: "NL",
    stadium: "Jack Murphy Stadium",
    lineup: [
      { name: "Alan Wiggins", pos: "2B", bats: "S", contact: 7, power: 2, bunting: 8, speed: 10, defense: 6, arm: 5,
        splits: { vsLHP: { ab: 201, ba: .244, hr: 1 }, vsRHP: { ab: 440, ba: .255, hr: 2 } } },
      { name: "Tony Gwynn", pos: "RF", bats: "L", contact: 10, power: 3, bunting: 6, speed: 7, defense: 8, arm: 8,
        splits: { vsLHP: { ab: 198, ba: .348, hr: 1 }, vsRHP: { ab: 408, ba: .353, hr: 4 } } },
      { name: "Steve Garvey", pos: "1B", bats: "R", contact: 7, power: 5, bunting: 2, speed: 3, defense: 7, arm: 5,
        splits: { vsLHP: { ab: 221, ba: .317, hr: 3 }, vsRHP: { ab: 396, ba: .265, hr: 5 } } },
      { name: "Graig Nettles", pos: "3B", bats: "L", contact: 6, power: 7, bunting: 3, speed: 3, defense: 9, arm: 8,
        splits: { vsLHP: { ab: 60, ba: .133, hr: 2 }, vsRHP: { ab: 405, ba: .242, hr: 18 } } },
      { name: "Terry Kennedy", pos: "C", bats: "L", contact: 7, power: 5, bunting: 3, speed: 2, defense: 6, arm: 7,
        splits: { vsLHP: { ab: 137, ba: .241, hr: 0 }, vsRHP: { ab: 393, ba: .239, hr: 14 } } },
      { name: "Kevin McReynolds", pos: "CF", bats: "R", contact: 7, power: 6, bunting: 3, speed: 5, defense: 7, arm: 7,
        splits: { vsLHP: { ab: 162, ba: .309, hr: 6 }, vsRHP: { ab: 363, ba: .264, hr: 14 } } },
      { name: "Carmelo Martinez", pos: "LF", bats: "R", contact: 6, power: 6, bunting: 3, speed: 4, defense: 6, arm: 8,
        splits: { vsLHP: { ab: 157, ba: .217, hr: 5 }, vsRHP: { ab: 331, ba: .266, hr: 8 } } },
      { name: "Garry Templeton", pos: "SS", bats: "S", contact: 7, power: 3, bunting: 5, speed: 6, defense: 6, arm: 8,
        splits: { vsLHP: { ab: 168, ba: .262, hr: 2 }, vsRHP: { ab: 402, ba: .254, hr: 0 } } },
    ],
    bench: [
      { name: "Kurt Bevacqua", pos: "1B/3B", bats: "R", contact: 6, power: 4, bunting: 3, speed: 3, defense: 5, arm: 5,
        splits: estSplits(.251, 4, 189, 55, "R") },
      { name: "Bobby Brown", pos: "OF", bats: "S", contact: 5, power: 3, bunting: 5, speed: 7, defense: 5, arm: 5,
        splits: estSplits(.242, 6, 194, 55, "S") },
      { name: "Bruce Bochy", pos: "C", bats: "R", contact: 5, power: 4, bunting: 2, speed: 2, defense: 5, arm: 6,
        splits: estSplits(.228, 5, 118, 35, "R") },
      { name: "Tim Flannery", pos: "2B", bats: "L", contact: 6, power: 2, bunting: 5, speed: 4, defense: 6, arm: 5,
        splits: estSplits(.271, 3, 168, 48, "L") },
      { name: "Luis Salazar", pos: "3B/OF", bats: "R", contact: 5, power: 3, bunting: 5, speed: 6, defense: 5, arm: 6,
        splits: estSplits(.241, 5, 287, 82, "R") },
    ],
    rotation: [
      { name: "Eric Show", pos: "SP", throws: "R", bats: "R", stamina: 7, pitchSpeed: 6, offSpeed: 7, control: 8, contact: 5, power: 2, bunting: 6, speed: 3 },
      { name: "Ed Whitson", pos: "SP", throws: "R", bats: "R", stamina: 8, pitchSpeed: 6, offSpeed: 8, control: 7, contact: 4, power: 2, bunting: 5, speed: 3 },
      { name: "Tim Lollar", pos: "SP", throws: "L", bats: "L", stamina: 6, pitchSpeed: 6, offSpeed: 6, control: 5, contact: 4, power: 3, bunting: 5, speed: 3 },
      { name: "Andy Hawkins", pos: "SP", throws: "R", bats: "R", stamina: 7, pitchSpeed: 5, offSpeed: 6, control: 6, contact: 4, power: 1, bunting: 5, speed: 3 },
    ],
    bullpen: [
      { name: "Goose Gossage", pos: "CL", throws: "R", bats: "R", stamina: 3, pitchSpeed: 9, offSpeed: 8, control: 7, contact: 3, power: 1, bunting: 3, speed: 2 },
      { name: "Craig Lefferts", pos: "RP", throws: "L", bats: "L", stamina: 4, pitchSpeed: 6, offSpeed: 7, control: 8, contact: 3, power: 1, bunting: 3, speed: 2 },
      { name: "Dave Dravecky", pos: "RP", throws: "L", bats: "L", stamina: 5, pitchSpeed: 5, offSpeed: 7, control: 8, contact: 4, power: 2, bunting: 5, speed: 3 },
      { name: "Greg Booker", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 5, offSpeed: 5, control: 6, contact: 3, power: 1, bunting: 3, speed: 2 },
      { name: "Luis DeLeon", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 6, offSpeed: 6, control: 5, contact: 3, power: 1, bunting: 3, speed: 2 },
    ],
  },

  cubs: {
    city: "Chicago",
    name: "Cubs",
    abbr: "CHC",
    league: "NL",
    stadium: "Wrigley Field",
    lineup: [
      { name: "Bob Dernier", pos: "CF", bats: "R", contact: 7, power: 2, bunting: 8, speed: 9, defense: 8, arm: 6,
        splits: { vsLHP: { ab: 172, ba: .285, hr: 2 }, vsRHP: { ab: 434, ba: .274, hr: 1 } } },
      { name: "Ryne Sandberg", pos: "2B", bats: "R", contact: 8, power: 7, bunting: 5, speed: 8, defense: 10, arm: 8,
        splits: { vsLHP: { ab: 179, ba: .318, hr: 3 }, vsRHP: { ab: 457, ba: .313, hr: 16 } } },
      { name: "Gary Matthews", pos: "LF", bats: "R", contact: 7, power: 5, bunting: 2, speed: 5, defense: 5, arm: 6,
        splits: { vsLHP: { ab: 147, ba: .313, hr: 2 }, vsRHP: { ab: 372, ba: .282, hr: 12 } } },
      { name: "Leon Durham", pos: "1B", bats: "L", contact: 7, power: 7, bunting: 3, speed: 5, defense: 5, arm: 5,
        splits: { vsLHP: { ab: 114, ba: .289, hr: 5 }, vsRHP: { ab: 359, ba: .276, hr: 18 } } },
      { name: "Keith Moreland", pos: "RF", bats: "R", contact: 7, power: 6, bunting: 2, speed: 3, defense: 5, arm: 7,
        splits: { vsLHP: { ab: 153, ba: .294, hr: 2 }, vsRHP: { ab: 342, ba: .272, hr: 14 } } },
      { name: "Jody Davis", pos: "C", bats: "R", contact: 6, power: 7, bunting: 2, speed: 2, defense: 7, arm: 8,
        splits: { vsLHP: { ab: 147, ba: .252, hr: 4 }, vsRHP: { ab: 376, ba: .258, hr: 15 } } },
      { name: "Ron Cey", pos: "3B", bats: "R", contact: 6, power: 7, bunting: 2, speed: 3, defense: 6, arm: 7,
        splits: { vsLHP: { ab: 135, ba: .200, hr: 3 }, vsRHP: { ab: 370, ba: .254, hr: 22 } } },
      { name: "Larry Bowa", pos: "SS", bats: "S", contact: 6, power: 2, bunting: 7, speed: 5, defense: 8, arm: 7,
        splits: { vsLHP: { ab: 121, ba: .231, hr: 0 }, vsRHP: { ab: 386, ba: .220, hr: 0 } } },
    ],
    bench: [
      { name: "Thad Bosley", pos: "OF", bats: "L", contact: 6, power: 3, bunting: 5, speed: 6, defense: 5, arm: 5,
        splits: estSplits(.285, 4, 141, 35, "L") },
      { name: "Richie Hebner", pos: "3B/1B", bats: "L", contact: 6, power: 4, bunting: 3, speed: 3, defense: 5, arm: 5,
        splits: estSplits(.265, 5, 227, 65, "L") },
      { name: "Henry Cotto", pos: "OF", bats: "R", contact: 5, power: 2, bunting: 6, speed: 7, defense: 5, arm: 5,
        splits: estSplits(.261, 2, 98, 28, "R") },
      { name: "Steve Lake", pos: "C", bats: "R", contact: 5, power: 2, bunting: 4, speed: 2, defense: 6, arm: 7,
        splits: estSplits(.231, 3, 134, 25, "R") },
      { name: "Dave Owen", pos: "SS", bats: "S", contact: 5, power: 2, bunting: 5, speed: 4, defense: 6, arm: 5,
        splits: estSplits(.215, 3, 142, 30, "S") },
    ],
    rotation: [
      { name: "Rick Sutcliffe", pos: "SP", throws: "R", bats: "L", stamina: 9, pitchSpeed: 8, offSpeed: 9, control: 8, contact: 6, power: 4, bunting: 6, speed: 3 },
      { name: "Steve Trout", pos: "SP", throws: "L", bats: "L", stamina: 7, pitchSpeed: 6, offSpeed: 8, control: 6, contact: 5, power: 2, bunting: 6, speed: 3 },
      { name: "Dennis Eckersley", pos: "SP", throws: "R", bats: "R", stamina: 8, pitchSpeed: 7, offSpeed: 7, control: 9, contact: 4, power: 1, bunting: 5, speed: 2 },
      { name: "Scott Sanderson", pos: "SP", throws: "R", bats: "R", stamina: 7, pitchSpeed: 7, offSpeed: 6, control: 7, contact: 4, power: 1, bunting: 5, speed: 2 },
    ],
    bullpen: [
      { name: "Lee Smith", pos: "CL", throws: "R", bats: "R", stamina: 4, pitchSpeed: 10, offSpeed: 7, control: 6, contact: 3, power: 1, bunting: 3, speed: 2 },
      { name: "Tim Stoddard", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 7, offSpeed: 5, control: 5, contact: 3, power: 1, bunting: 3, speed: 2 },
      { name: "George Frazier", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 5, offSpeed: 6, control: 6, contact: 3, power: 1, bunting: 3, speed: 2 },
      { name: "Warren Brusstar", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 5, offSpeed: 5, control: 5, contact: 3, power: 1, bunting: 3, speed: 2 },
      { name: "Dickie Noles", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 6, offSpeed: 5, control: 4, contact: 3, power: 1, bunting: 3, speed: 2 },
    ],
  },

  mets: {
    city: "New York",
    name: "Mets",
    abbr: "NYM",
    league: "NL",
    stadium: "Shea Stadium",
    lineup: [
      { name: "Wally Backman", pos: "2B", bats: "S", contact: 7, power: 2, bunting: 7, speed: 7, defense: 6, arm: 4,
        splits: { vsLHP: { ab: 37, ba: .162, hr: 0 }, vsRHP: { ab: 399, ba: .291, hr: 1 } } },
      { name: "Mookie Wilson", pos: "CF", bats: "S", contact: 7, power: 3, bunting: 7, speed: 9, defense: 7, arm: 6,
        splits: { vsLHP: { ab: 169, ba: .243, hr: 2 }, vsRHP: { ab: 418, ba: .289, hr: 8 } } },
      { name: "Keith Hernandez", pos: "1B", bats: "L", contact: 8, power: 5, bunting: 3, speed: 4, defense: 10, arm: 8,
        splits: { vsLHP: { ab: 168, ba: .298, hr: 2 }, vsRHP: { ab: 382, ba: .317, hr: 13 } } },
      { name: "Darryl Strawberry", pos: "RF", bats: "L", contact: 6, power: 8, bunting: 2, speed: 7, defense: 6, arm: 8,
        splits: { vsLHP: { ab: 153, ba: .209, hr: 6 }, vsRHP: { ab: 369, ba: .268, hr: 20 } } },
      { name: "George Foster", pos: "LF", bats: "R", contact: 6, power: 7, bunting: 2, speed: 3, defense: 5, arm: 6,
        splits: { vsLHP: { ab: 154, ba: .234, hr: 4 }, vsRHP: { ab: 399, ba: .283, hr: 20 } } },
      { name: "Hubie Brooks", pos: "3B", bats: "R", contact: 7, power: 6, bunting: 3, speed: 5, defense: 5, arm: 8,
        splits: { vsLHP: { ab: 177, ba: .328, hr: 7 }, vsRHP: { ab: 384, ba: .263, hr: 9 } } },
      { name: "Mike Fitzgerald", pos: "C", bats: "R", contact: 5, power: 3, bunting: 4, speed: 3, defense: 6, arm: 6,
        splits: { vsLHP: { ab: 97, ba: .206, hr: 1 }, vsRHP: { ab: 205, ba: .259, hr: 1 } } },
      { name: "Jose Oquendo", pos: "SS", bats: "S", contact: 5, power: 2, bunting: 6, speed: 5, defense: 7, arm: 6,
        splits: { vsLHP: { ab: 85, ba: .235, hr: 0 }, vsRHP: { ab: 304, ba: .220, hr: 0 } } },
    ],
    bench: [
      { name: "Ron Gardenhire", pos: "SS", bats: "R", contact: 5, power: 2, bunting: 5, speed: 4, defense: 6, arm: 5,
        splits: estSplits(.218, 1, 125, 35, "R") },
      { name: "Kelvin Chapman", pos: "2B", bats: "R", contact: 6, power: 2, bunting: 4, speed: 5, defense: 5, arm: 4,
        splits: estSplits(.282, 1, 161, 45, "R") },
      { name: "John Gibbons", pos: "C", bats: "R", contact: 5, power: 3, bunting: 3, speed: 2, defense: 5, arm: 6,
        splits: estSplits(.217, 2, 78, 22, "R") },
      { name: "Danny Heep", pos: "OF/1B", bats: "L", contact: 6, power: 3, bunting: 3, speed: 3, defense: 5, arm: 5,
        splits: estSplits(.278, 4, 176, 48, "L") },
      { name: "Rusty Staub", pos: "PH", bats: "L", contact: 6, power: 4, bunting: 2, speed: 1, defense: 0, arm: 0,
        splits: estSplits(.264, 5, 98, 25, "L") },
    ],
    rotation: [
      { name: "Dwight Gooden", pos: "SP", throws: "R", bats: "R", stamina: 8, pitchSpeed: 10, offSpeed: 9, control: 7, contact: 4, power: 2, bunting: 5, speed: 4 },
      { name: "Ron Darling", pos: "SP", throws: "R", bats: "R", stamina: 8, pitchSpeed: 7, offSpeed: 7, control: 6, contact: 5, power: 2, bunting: 5, speed: 4 },
      { name: "Walt Terrell", pos: "SP", throws: "R", bats: "R", stamina: 8, pitchSpeed: 6, offSpeed: 6, control: 7, contact: 4, power: 2, bunting: 5, speed: 3 },
      { name: "Bruce Berenyi", pos: "SP", throws: "R", bats: "R", stamina: 7, pitchSpeed: 7, offSpeed: 5, control: 4, contact: 3, power: 1, bunting: 4, speed: 3 },
    ],
    bullpen: [
      { name: "Jesse Orosco", pos: "CL", throws: "L", bats: "L", stamina: 4, pitchSpeed: 7, offSpeed: 8, control: 7, contact: 3, power: 1, bunting: 3, speed: 2 },
      { name: "Doug Sisk", pos: "RP", throws: "R", bats: "R", stamina: 5, pitchSpeed: 5, offSpeed: 7, control: 5, contact: 3, power: 1, bunting: 3, speed: 2 },
      { name: "Brent Gaff", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 6, offSpeed: 5, control: 5, contact: 3, power: 1, bunting: 3, speed: 2 },
      { name: "Tom Gorman", pos: "RP", throws: "L", bats: "L", stamina: 4, pitchSpeed: 5, offSpeed: 6, control: 6, contact: 3, power: 1, bunting: 3, speed: 2 },
      { name: "Ed Lynch", pos: "RP", throws: "R", bats: "R", stamina: 5, pitchSpeed: 5, offSpeed: 6, control: 6, contact: 3, power: 1, bunting: 3, speed: 2 },
    ],
  },

  redsox: {
    city: "Boston",
    name: "Red Sox",
    abbr: "BOS",
    league: "AL",
    stadium: "Fenway Park",
    lineup: [
      { name: "Wade Boggs", pos: "3B", bats: "L", contact: 10, power: 3, bunting: 4, speed: 4, defense: 7, arm: 7,
        splits: { vsLHP: { ab: 201, ba: .313, hr: 2 }, vsRHP: { ab: 424, ba: .330, hr: 9 } } },
      { name: "Dwight Evans", pos: "RF", bats: "R", contact: 7, power: 8, bunting: 3, speed: 4, defense: 9, arm: 10,
        splits: { vsLHP: { ab: 204, ba: .284, hr: 8 }, vsRHP: { ab: 426, ba: .300, hr: 24 } } },
      { name: "Jim Rice", pos: "LF", bats: "R", contact: 7, power: 8, bunting: 2, speed: 4, defense: 6, arm: 8,
        splits: { vsLHP: { ab: 216, ba: .264, hr: 10 }, vsRHP: { ab: 441, ba: .288, hr: 18 } } },
      { name: "Tony Armas", pos: "CF", bats: "R", contact: 6, power: 10, bunting: 2, speed: 4, defense: 7, arm: 9,
        splits: { vsLHP: { ab: 198, ba: .263, hr: 15 }, vsRHP: { ab: 441, ba: .270, hr: 28 } } },
      { name: "Mike Easler", pos: "DH", bats: "L", contact: 8, power: 6, bunting: 2, speed: 3, defense: 0, arm: 0,
        splits: { vsLHP: { ab: 125, ba: .312, hr: 4 }, vsRHP: { ab: 476, ba: .313, hr: 23 } } },
      { name: "Bill Buckner", pos: "1B", bats: "L", contact: 7, power: 4, bunting: 3, speed: 3, defense: 6, arm: 4,
        splits: { vsLHP: { ab: 139, ba: .281, hr: 1 }, vsRHP: { ab: 449, ba: .276, hr: 10 } } },
      { name: "Rich Gedman", pos: "C", bats: "L", contact: 6, power: 6, bunting: 3, speed: 2, defense: 6, arm: 7,
        splits: { vsLHP: { ab: 121, ba: .240, hr: 4 }, vsRHP: { ab: 340, ba: .279, hr: 20 } } },
      { name: "Marty Barrett", pos: "2B", bats: "R", contact: 7, power: 2, bunting: 6, speed: 5, defense: 7, arm: 5,
        splits: { vsLHP: { ab: 148, ba: .318, hr: 1 }, vsRHP: { ab: 354, ba: .297, hr: 2 } } },
      { name: "Jackie Gutierrez", pos: "SS", bats: "R", contact: 5, power: 2, bunting: 5, speed: 6, defense: 5, arm: 6,
        splits: { vsLHP: { ab: 134, ba: .276, hr: 1 }, vsRHP: { ab: 328, ba: .250, hr: 2 } } },
    ],
    bench: [
      { name: "Reid Nichols", pos: "OF", bats: "R", contact: 5, power: 3, bunting: 4, speed: 5, defense: 5, arm: 5,
        splits: estSplits(.251, 5, 175, 48, "R") },
      { name: "Ed Jurak", pos: "3B", bats: "R", contact: 5, power: 2, bunting: 4, speed: 4, defense: 5, arm: 5,
        splits: estSplits(.233, 2, 102, 28, "R") },
      { name: "Jeff Newman", pos: "C", bats: "R", contact: 4, power: 3, bunting: 2, speed: 2, defense: 5, arm: 5,
        splits: estSplits(.211, 4, 109, 30, "R") },
      { name: "Rick Miller", pos: "OF", bats: "L", contact: 5, power: 2, bunting: 5, speed: 4, defense: 6, arm: 5,
        splits: estSplits(.255, 2, 141, 38, "L") },
      { name: "Glenn Hoffman", pos: "SS", bats: "R", contact: 5, power: 2, bunting: 5, speed: 4, defense: 6, arm: 6,
        splits: estSplits(.231, 2, 176, 48, "R") },
    ],
    rotation: [
      { name: "Bruce Hurst", pos: "SP", throws: "L", bats: "L", stamina: 8, pitchSpeed: 7, offSpeed: 8, control: 7, contact: 3, power: 1, bunting: 4, speed: 2 },
      { name: "Oil Can Boyd", pos: "SP", throws: "R", bats: "R", stamina: 7, pitchSpeed: 7, offSpeed: 7, control: 7, contact: 3, power: 1, bunting: 4, speed: 3 },
      { name: "Bob Ojeda", pos: "SP", throws: "L", bats: "L", stamina: 7, pitchSpeed: 6, offSpeed: 7, control: 6, contact: 3, power: 1, bunting: 4, speed: 2 },
      { name: "Al Nipper", pos: "SP", throws: "R", bats: "R", stamina: 7, pitchSpeed: 5, offSpeed: 6, control: 6, contact: 2, power: 1, bunting: 3, speed: 2 },
    ],
    bullpen: [
      { name: "Bob Stanley", pos: "CL", throws: "R", bats: "R", stamina: 5, pitchSpeed: 5, offSpeed: 8, control: 8, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Mark Clear", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 8, offSpeed: 5, control: 4, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "John Henry Johnson", pos: "RP", throws: "L", bats: "L", stamina: 4, pitchSpeed: 6, offSpeed: 5, control: 5, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Steve Crawford", pos: "RP", throws: "R", bats: "R", stamina: 5, pitchSpeed: 5, offSpeed: 6, control: 6, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Charlie Mitchell", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 5, offSpeed: 5, control: 5, contact: 2, power: 1, bunting: 3, speed: 2 },
    ],
  },

  yankees: {
    city: "New York",
    name: "Yankees",
    abbr: "NYY",
    league: "AL",
    stadium: "Yankee Stadium",
    lineup: [
      { name: "Willie Randolph", pos: "2B", bats: "R", contact: 7, power: 3, bunting: 6, speed: 6, defense: 8, arm: 6,
        splits: { vsLHP: { ab: 161, ba: .311, hr: 0 }, vsRHP: { ab: 371, ba: .270, hr: 2 } } },
      { name: "Don Mattingly", pos: "1B", bats: "L", contact: 9, power: 7, bunting: 3, speed: 4, defense: 9, arm: 7,
        splits: { vsLHP: { ab: 166, ba: .337, hr: 3 }, vsRHP: { ab: 437, ba: .346, hr: 20 } } },
      { name: "Dave Winfield", pos: "RF", bats: "R", contact: 8, power: 7, bunting: 2, speed: 5, defense: 8, arm: 9,
        splits: { vsLHP: { ab: 169, ba: .355, hr: 4 }, vsRHP: { ab: 398, ba: .334, hr: 15 } } },
      { name: "Don Baylor", pos: "DH", bats: "R", contact: 6, power: 7, bunting: 2, speed: 3, defense: 0, arm: 0,
        splits: { vsLHP: { ab: 189, ba: .280, hr: 10 }, vsRHP: { ab: 406, ba: .254, hr: 17 } } },
      { name: "Steve Kemp", pos: "LF", bats: "L", contact: 6, power: 5, bunting: 3, speed: 4, defense: 5, arm: 6,
        splits: estSplits(.273, 12, 351, 100, "L") },
      { name: "Ken Griffey Sr.", pos: "CF", bats: "L", contact: 7, power: 4, bunting: 4, speed: 5, defense: 6, arm: 6,
        splits: estSplits(.284, 11, 398, 112, "L") },
      { name: "Butch Wynegar", pos: "C", bats: "S", contact: 6, power: 3, bunting: 3, speed: 2, defense: 6, arm: 6,
        splits: estSplits(.246, 7, 248, 72, "S") },
      { name: "Mike Pagliarulo", pos: "3B", bats: "L", contact: 6, power: 6, bunting: 3, speed: 3, defense: 5, arm: 7,
        splits: estSplits(.232, 15, 298, 84, "L") },
      { name: "Bobby Meacham", pos: "SS", bats: "S", contact: 5, power: 2, bunting: 6, speed: 6, defense: 5, arm: 6,
        splits: estSplits(.231, 1, 301, 88, "S") },
    ],
    bench: [
      { name: "Oscar Gamble", pos: "OF", bats: "L", contact: 5, power: 5, bunting: 2, speed: 3, defense: 4, arm: 4,
        splits: estSplits(.245, 9, 178, 50, "L") },
      { name: "Roy Smalley", pos: "3B/SS", bats: "S", contact: 5, power: 4, bunting: 4, speed: 3, defense: 5, arm: 5,
        splits: estSplits(.241, 8, 261, 74, "S") },
      { name: "Rick Cerone", pos: "C", bats: "R", contact: 5, power: 3, bunting: 3, speed: 2, defense: 6, arm: 6,
        splits: estSplits(.242, 4, 134, 36, "R") },
      { name: "Brian Dayett", pos: "OF", bats: "R", contact: 5, power: 3, bunting: 4, speed: 4, defense: 5, arm: 5,
        splits: estSplits(.238, 4, 112, 32, "R") },
      { name: "Tim Foli", pos: "SS", bats: "R", contact: 5, power: 2, bunting: 6, speed: 3, defense: 6, arm: 5,
        splits: estSplits(.249, 2, 168, 46, "R") },
    ],
    rotation: [
      { name: "Phil Niekro", pos: "SP", throws: "R", bats: "R", stamina: 9, pitchSpeed: 4, offSpeed: 10, control: 8, contact: 3, power: 2, bunting: 5, speed: 2, pitches: ["Fastball", "Knuckleball", "Changeup"] },
      { name: "Ron Guidry", pos: "SP", throws: "L", bats: "L", stamina: 8, pitchSpeed: 8, offSpeed: 8, control: 7, contact: 3, power: 1, bunting: 4, speed: 3 },
      { name: "Ray Fontenot", pos: "SP", throws: "L", bats: "L", stamina: 7, pitchSpeed: 5, offSpeed: 6, control: 6, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Dennis Rasmussen", pos: "SP", throws: "L", bats: "L", stamina: 6, pitchSpeed: 6, offSpeed: 6, control: 6, contact: 2, power: 1, bunting: 3, speed: 2 },
    ],
    bullpen: [
      { name: "Dave Righetti", pos: "CL", throws: "L", bats: "L", stamina: 4, pitchSpeed: 9, offSpeed: 7, control: 7, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Jay Howell", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 7, offSpeed: 6, control: 6, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Mike Armstrong", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 6, offSpeed: 5, control: 5, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Bob Shirley", pos: "RP", throws: "L", bats: "L", stamina: 4, pitchSpeed: 5, offSpeed: 6, control: 6, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Clay Christiansen", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 5, offSpeed: 5, control: 5, contact: 2, power: 1, bunting: 3, speed: 2 },
    ],
  },

  orioles: {
    city: "Baltimore",
    name: "Orioles",
    abbr: "BAL",
    league: "AL",
    stadium: "Memorial Stadium",
    lineup: [
      { name: "Al Bumbry", pos: "CF", bats: "L", contact: 6, power: 3, bunting: 6, speed: 7, defense: 5, arm: 5,
        splits: { vsLHP: { ab: 55, ba: .236, hr: 0 }, vsRHP: { ab: 279, ba: .280, hr: 2 } } },
      { name: "Cal Ripken Jr.", pos: "SS", bats: "R", contact: 8, power: 8, bunting: 3, speed: 4, defense: 9, arm: 9,
        splits: { vsLHP: { ab: 228, ba: .298, hr: 9 }, vsRHP: { ab: 418, ba: .306, hr: 18 } } },
      { name: "Eddie Murray", pos: "1B", bats: "S", contact: 8, power: 8, bunting: 2, speed: 4, defense: 8, arm: 7,
        splits: { vsLHP: { ab: 173, ba: .260, hr: 11 }, vsRHP: { ab: 415, ba: .325, hr: 18 } } },
      { name: "Gary Roenicke", pos: "LF", bats: "R", contact: 6, power: 6, bunting: 3, speed: 3, defense: 6, arm: 7,
        splits: { vsLHP: { ab: 162, ba: .253, hr: 4 }, vsRHP: { ab: 156, ba: .199, hr: 4 } } },
      { name: "Wayne Gross", pos: "3B", bats: "L", contact: 5, power: 6, bunting: 3, speed: 3, defense: 6, arm: 7,
        splits: estSplits(.232, 12, 314, 90, "L") },
      { name: "Ken Singleton", pos: "DH", bats: "S", contact: 7, power: 5, bunting: 2, speed: 2, defense: 0, arm: 0,
        splits: estSplits(.271, 12, 351, 98, "S") },
      { name: "Mike Young", pos: "RF", bats: "S", contact: 6, power: 5, bunting: 3, speed: 4, defense: 5, arm: 6,
        splits: estSplits(.243, 13, 312, 88, "S") },
      { name: "Rich Dauer", pos: "2B", bats: "R", contact: 5, power: 2, bunting: 6, speed: 3, defense: 7, arm: 5,
        splits: estSplits(.242, 3, 301, 84, "R") },
      { name: "Rick Dempsey", pos: "C", bats: "R", contact: 5, power: 3, bunting: 4, speed: 3, defense: 8, arm: 7,
        splits: estSplits(.238, 6, 316, 90, "R") },
    ],
    bench: [
      { name: "John Shelby", pos: "OF", bats: "S", contact: 5, power: 4, bunting: 5, speed: 6, defense: 6, arm: 7,
        splits: estSplits(.241, 6, 298, 84, "S") },
      { name: "Jim Dwyer", pos: "OF", bats: "L", contact: 6, power: 4, bunting: 3, speed: 3, defense: 5, arm: 5,
        splits: estSplits(.278, 8, 158, 42, "L") },
      { name: "Floyd Rayford", pos: "3B/C", bats: "R", contact: 5, power: 3, bunting: 3, speed: 3, defense: 5, arm: 6,
        splits: estSplits(.231, 5, 168, 46, "R") },
      { name: "Lenn Sakata", pos: "2B/SS", bats: "R", contact: 5, power: 2, bunting: 5, speed: 4, defense: 6, arm: 5,
        splits: estSplits(.223, 3, 142, 38, "R") },
      { name: "Joe Nolan", pos: "C", bats: "L", contact: 5, power: 2, bunting: 3, speed: 2, defense: 5, arm: 5,
        splits: estSplits(.245, 3, 112, 30, "L") },
    ],
    rotation: [
      { name: "Mike Boddicker", pos: "SP", throws: "R", bats: "R", stamina: 8, pitchSpeed: 6, offSpeed: 9, control: 7, contact: 3, power: 1, bunting: 4, speed: 3 },
      { name: "Scott McGregor", pos: "SP", throws: "L", bats: "S", stamina: 8, pitchSpeed: 5, offSpeed: 8, control: 9, contact: 3, power: 1, bunting: 5, speed: 2 },
      { name: "Storm Davis", pos: "SP", throws: "R", bats: "R", stamina: 7, pitchSpeed: 6, offSpeed: 7, control: 7, contact: 3, power: 1, bunting: 4, speed: 3 },
      { name: "Mike Flanagan", pos: "SP", throws: "L", bats: "L", stamina: 7, pitchSpeed: 6, offSpeed: 7, control: 6, contact: 3, power: 1, bunting: 4, speed: 2 },
    ],
    bullpen: [
      { name: "Tippy Martinez", pos: "CL", throws: "L", bats: "L", stamina: 4, pitchSpeed: 7, offSpeed: 8, control: 6, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Sammy Stewart", pos: "RP", throws: "R", bats: "R", stamina: 5, pitchSpeed: 6, offSpeed: 6, control: 6, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Tom Underwood", pos: "RP", throws: "L", bats: "L", stamina: 4, pitchSpeed: 6, offSpeed: 6, control: 5, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "Bill Swaggerty", pos: "RP", throws: "R", bats: "R", stamina: 5, pitchSpeed: 5, offSpeed: 6, control: 6, contact: 2, power: 1, bunting: 3, speed: 2 },
      { name: "John Pacella", pos: "RP", throws: "R", bats: "R", stamina: 3, pitchSpeed: 7, offSpeed: 4, control: 4, contact: 2, power: 1, bunting: 3, speed: 2 },
    ],
  },

  dodgers: {
    city: "Los Angeles",
    name: "Dodgers",
    abbr: "LAD",
    league: "NL",
    stadium: "Dodger Stadium",
    lineup: [
      { name: "Steve Sax", pos: "2B", bats: "R", contact: 6, power: 2, bunting: 7, speed: 7, defense: 5, arm: 5,
        splits: { vsLHP: { ab: 161, ba: .273, hr: 1 }, vsRHP: { ab: 400, ba: .233, hr: 0 } } },
      { name: "Ken Landreaux", pos: "CF", bats: "L", contact: 6, power: 4, bunting: 5, speed: 6, defense: 7, arm: 7,
        splits: { vsLHP: { ab: 104, ba: .212, hr: 0 }, vsRHP: { ab: 390, ba: .262, hr: 11 } } },
      { name: "Pedro Guerrero", pos: "3B", bats: "R", contact: 8, power: 7, bunting: 2, speed: 5, defense: 5, arm: 8,
        splits: { vsLHP: { ab: 154, ba: .338, hr: 3 }, vsRHP: { ab: 385, ba: .291, hr: 13 } } },
      { name: "Mike Marshall", pos: "RF", bats: "R", contact: 6, power: 7, bunting: 2, speed: 4, defense: 6, arm: 8,
        splits: { vsLHP: { ab: 147, ba: .272, hr: 5 }, vsRHP: { ab: 342, ba: .249, hr: 15 } } },
      { name: "Mike Scioscia", pos: "C", bats: "L", contact: 7, power: 3, bunting: 5, speed: 3, defense: 8, arm: 7,
        splits: { vsLHP: { ab: 37, ba: .189, hr: 0 }, vsRHP: { ab: 304, ba: .283, hr: 5 } } },
      { name: "Greg Brock", pos: "1B", bats: "L", contact: 5, power: 5, bunting: 3, speed: 3, defense: 6, arm: 5,
        splits: { vsLHP: { ab: 30, ba: .100, hr: 1 }, vsRHP: { ab: 241, ba: .241, hr: 6 } } },
      { name: "Franklin Stubbs", pos: "LF", bats: "L", contact: 5, power: 5, bunting: 4, speed: 5, defense: 6, arm: 6,
        splits: { vsLHP: { ab: 5, ba: .000, hr: 0 }, vsRHP: { ab: 181, ba: .199, hr: 8 } } },
      { name: "Dave Anderson", pos: "SS", bats: "R", contact: 5, power: 2, bunting: 5, speed: 5, defense: 6, arm: 6,
        splits: { vsLHP: { ab: 98, ba: .255, hr: 1 }, vsRHP: { ab: 172, ba: .233, hr: 2 } } },
    ],
    bench: [
      { name: "Bill Russell", pos: "SS", bats: "R", contact: 5, power: 2, bunting: 6, speed: 4, defense: 7, arm: 6,
        splits: estSplits(.238, 1, 218, 62, "R") },
      { name: "Candy Maldonado", pos: "OF", bats: "R", contact: 5, power: 4, bunting: 3, speed: 5, defense: 5, arm: 6,
        splits: estSplits(.248, 6, 181, 50, "R") },
      { name: "Bob Bailor", pos: "INF", bats: "R", contact: 5, power: 2, bunting: 5, speed: 4, defense: 5, arm: 5,
        splits: estSplits(.231, 2, 134, 38, "R") },
      { name: "Steve Yeager", pos: "C", bats: "R", contact: 4, power: 3, bunting: 3, speed: 2, defense: 6, arm: 6,
        splits: estSplits(.214, 4, 178, 48, "R") },
      { name: "R.J. Reynolds", pos: "OF", bats: "S", contact: 5, power: 2, bunting: 5, speed: 6, defense: 5, arm: 5,
        splits: estSplits(.241, 3, 161, 46, "S") },
    ],
    rotation: [
      { name: "Alejandro Pena", pos: "SP", throws: "R", bats: "R", stamina: 7, pitchSpeed: 7, offSpeed: 8, control: 8, contact: 5, power: 2, bunting: 5, speed: 3 },
      { name: "Orel Hershiser", pos: "SP", throws: "R", bats: "R", stamina: 9, pitchSpeed: 7, offSpeed: 9, control: 7, contact: 5, power: 3, bunting: 7, speed: 4 },
      { name: "Fernando Valenzuela", pos: "SP", throws: "L", bats: "L", stamina: 9, pitchSpeed: 6, offSpeed: 9, control: 6, contact: 6, power: 3, bunting: 6, speed: 3, pitches: ["Fastball", "Breaking Ball", "Changeup", "Screwball"] },
      { name: "Bob Welch", pos: "SP", throws: "R", bats: "R", stamina: 7, pitchSpeed: 7, offSpeed: 7, control: 7, contact: 5, power: 2, bunting: 5, speed: 3 },
    ],
    bullpen: [
      { name: "Ken Howell", pos: "CL", throws: "R", bats: "R", stamina: 4, pitchSpeed: 8, offSpeed: 6, control: 5, contact: 3, power: 1, bunting: 4, speed: 3 },
      { name: "Pat Zachry", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 5, offSpeed: 6, control: 5, contact: 4, power: 1, bunting: 4, speed: 2 },
      { name: "Carlos Diaz", pos: "RP", throws: "L", bats: "L", stamina: 3, pitchSpeed: 5, offSpeed: 6, control: 6, contact: 3, power: 1, bunting: 3, speed: 2 },
      { name: "Tom Niedenfuer", pos: "RP", throws: "R", bats: "R", stamina: 4, pitchSpeed: 7, offSpeed: 7, control: 8, contact: 3, power: 1, bunting: 3, speed: 2 },
      { name: "Burt Hooton", pos: "RP", throws: "R", bats: "R", stamina: 5, pitchSpeed: 5, offSpeed: 7, control: 7, contact: 4, power: 2, bunting: 4, speed: 2 },
    ],
  },
};

// 1984 Error counts (estimated from real stats) — used for fielding error probability
export const PLAYER_ERRORS = {
  // Tigers
  "Lou Whitaker": 11, "Alan Trammell": 10, "Kirk Gibson": 8, "Lance Parrish": 5,
  "Darrell Evans": 11, "Chet Lemon": 2, "Larry Herndon": 10, "Howard Johnson": 24, "Barbaro Garbey": 0,
  "Johnny Grubb": 2, "Dave Bergman": 2, "Rusty Kuntz": 1, "Marty Castillo": 5, "Tom Brookens": 16,
  // Padres
  "Alan Wiggins": 30, "Tony Gwynn": 4, "Steve Garvey": 5, "Graig Nettles": 13,
  "Terry Kennedy": 10, "Kevin McReynolds": 5, "Carmelo Martinez": 7, "Garry Templeton": 29,
  "Kurt Bevacqua": 4, "Bobby Brown": 3, "Bruce Bochy": 4, "Tim Flannery": 7, "Luis Salazar": 14,
  // Cubs
  "Bob Dernier": 3, "Ryne Sandberg": 6, "Gary Matthews": 13, "Leon Durham": 11,
  "Keith Moreland": 8, "Jody Davis": 13, "Ron Cey": 18, "Larry Bowa": 12,
  "Thad Bosley": 2, "Richie Hebner": 8, "Henry Cotto": 2, "Steve Lake": 3, "Dave Owen": 5,
  // Mets
  "Wally Backman": 13, "Mookie Wilson": 7, "Keith Hernandez": 4, "Darryl Strawberry": 8,
  "George Foster": 7, "Hubie Brooks": 29, "Mike Fitzgerald": 8, "Jose Oquendo": 12,
  "Ron Gardenhire": 5, "Kelvin Chapman": 4, "John Gibbons": 3, "Danny Heep": 3, "Rusty Staub": 0,
  // Red Sox
  "Wade Boggs": 20, "Dwight Evans": 2, "Jim Rice": 6, "Tony Armas": 11, "Mike Easler": 0,
  "Bill Buckner": 12, "Rich Gedman": 9, "Marty Barrett": 11, "Jackie Gutierrez": 24,
  "Reid Nichols": 2, "Ed Jurak": 4, "Jeff Newman": 3, "Rick Miller": 2, "Glenn Hoffman": 8,
  // Yankees
  "Willie Randolph": 9, "Don Mattingly": 6, "Dave Winfield": 2, "Don Baylor": 0,
  "Steve Kemp": 7, "Ken Griffey Sr.": 9, "Butch Wynegar": 5, "Mike Pagliarulo": 24, "Bobby Meacham": 24,
  "Oscar Gamble": 1, "Roy Smalley": 12, "Rick Cerone": 3, "Brian Dayett": 2, "Tim Foli": 7,
  // Orioles
  "Al Bumbry": 4, "Cal Ripken Jr.": 26, "Eddie Murray": 18, "Gary Roenicke": 1,
  "Wayne Gross": 17, "Ken Singleton": 0, "Mike Young": 8, "Rich Dauer": 7, "Rick Dempsey": 3,
  "John Shelby": 5, "Jim Dwyer": 1, "Floyd Rayford": 6, "Lenn Sakata": 5, "Joe Nolan": 3,
  // Dodgers
  "Steve Sax": 22, "Ken Landreaux": 5, "Pedro Guerrero": 27, "Mike Marshall": 7,
  "Mike Scioscia": 13, "Greg Brock": 9, "Franklin Stubbs": 4, "Dave Anderson": 14,
  "Bill Russell": 10, "Candy Maldonado": 3, "Bob Bailor": 4, "Steve Yeager": 4, "R.J. Reynolds": 2,
};

// Estimate splits for bench players based on overall stats + handedness
// Same side: BA ~8% worse, HR rate ~20% worse; Opposite side: BA ~5% better, HR rate ~20% better
function estSplits(totalBA, totalHR, totalAB, vsSameAB, bats) {
  const vsOppAB = totalAB - vsSameAB;
  const totalH = totalBA * totalAB;

  // Distribute hits: assume ~48% come vs same side, 52% vs opposite (typical MLB split)
  const sameBA = totalBA * 0.92;
  const oppBA = totalBA * 1.05;

  // Distribute HRs: same side gets fewer
  const hrRate = totalHR / totalAB;
  const sameHR = Math.round(hrRate * 0.80 * vsSameAB);
  const oppHR = totalHR - sameHR;

  const sameKey = (bats === "L") ? "vsLHP" : "vsRHP";
  const oppKey = (bats === "L") ? "vsRHP" : "vsLHP";

  if (bats === "S") {
    // Switch hitters are more balanced
    return {
      vsLHP: { ab: vsSameAB, ba: totalBA * 0.96, hr: Math.round(totalHR * 0.48) },
      vsRHP: { ab: vsOppAB, ba: totalBA * 1.02, hr: Math.round(totalHR * 0.52) },
    };
  }

  return {
    [sameKey]: { ab: vsSameAB, ba: Math.round(sameBA * 1000) / 1000, hr: sameHR },
    [oppKey]: { ab: vsOppAB, ba: Math.round(oppBA * 1000) / 1000, hr: oppHR },
  };
}

export const PITCH_TYPES = {
  "Fastball":     { name: "Fastball",     speed: "fast",   break: 0, controlBonus: 2 },
  "Breaking Ball":{ name: "Breaking Ball",speed: "slow",   break: 3, controlBonus: 0 },
  "Changeup":     { name: "Changeup",     speed: "slow",   break: 1, controlBonus: 1 },
  "Knuckleball":  { name: "Knuckleball",  speed: "slow",   break: 4, controlBonus: -2 },
  "Screwball":    { name: "Screwball",    speed: "medium", break: 3, controlBonus: 0 },
  "Split-Finger": { name: "Split-Finger", speed: "medium", break: 2, controlBonus: 0 },
};

export const DEFAULT_PITCHES = ["Fastball", "Breaking Ball", "Changeup"];

export const SWING_TYPES = [
  { name: "Normal Swing", powerMod: 0, contactMod: 0, outcomeMod: 0 },
  { name: "Contact Swing", powerMod: -2, contactMod: 2, outcomeMod: 0 },
  { name: "Power Swing", powerMod: 2, contactMod: -2, outcomeMod: 1 },
  { name: "Take Pitch", powerMod: 0, contactMod: 0, outcomeMod: -1 },
  { name: "Bunt", powerMod: 0, contactMod: 0, outcomeMod: 0 },
];

export const TEAM_IDS = Object.keys(TEAMS);