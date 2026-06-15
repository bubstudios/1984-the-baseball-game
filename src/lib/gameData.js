// 1984 MLB Teams & Players — ratings based on real 1984 stats
// Hitters: Contact, Power, Bunting, Speed, Defense, Arm (1-10)
// Pitchers: Stamina, PitchSpeed, OffSpeed, Control (1-10)

export const TEAMS = {
  tigers: {
    city: "Detroit",
    name: "Tigers",
    abbr: "DET",
    league: "AL",
    lineup: [
      { name: "Lou Whitaker", pos: "2B", contact: 8, power: 4, bunting: 5, speed: 5, defense: 9, arm: 6 },
      { name: "Alan Trammell", pos: "SS", contact: 8, power: 5, bunting: 6, speed: 6, defense: 9, arm: 8 },
      { name: "Kirk Gibson", pos: "RF", contact: 7, power: 8, bunting: 3, speed: 7, defense: 7, arm: 8 },
      { name: "Lance Parrish", pos: "C", contact: 6, power: 9, bunting: 2, speed: 3, defense: 7, arm: 9 },
      { name: "Darrell Evans", pos: "1B", contact: 6, power: 7, bunting: 2, speed: 3, defense: 6, arm: 5 },
      { name: "Chet Lemon", pos: "CF", contact: 7, power: 6, bunting: 4, speed: 5, defense: 8, arm: 7 },
      { name: "Larry Herndon", pos: "LF", contact: 7, power: 5, bunting: 4, speed: 6, defense: 6, arm: 6 },
      { name: "Howard Johnson", pos: "3B", contact: 6, power: 5, bunting: 4, speed: 6, defense: 5, arm: 7 },
      { name: "Barbaro Garbey", pos: "DH", contact: 7, power: 3, bunting: 4, speed: 4, defense: 0, arm: 0 },
    ],
    bench: [
      { name: "Johnny Grubb", pos: "OF", contact: 6, power: 4, bunting: 3, speed: 3, defense: 5, arm: 5 },
      { name: "Dave Bergman", pos: "1B", contact: 6, power: 3, bunting: 4, speed: 3, defense: 6, arm: 4 },
      { name: "Rusty Kuntz", pos: "OF", contact: 5, power: 2, bunting: 5, speed: 6, defense: 6, arm: 4 },
      { name: "Marty Castillo", pos: "C/3B", contact: 5, power: 2, bunting: 4, speed: 3, defense: 6, arm: 6 },
      { name: "Tom Brookens", pos: "3B", contact: 5, power: 3, bunting: 5, speed: 5, defense: 7, arm: 6 },
    ],
    rotation: [
      { name: "Jack Morris", pos: "SP", stamina: 10, pitchSpeed: 7, offSpeed: 8, control: 6 },
      { name: "Dan Petry", pos: "SP", stamina: 8, pitchSpeed: 6, offSpeed: 7, control: 7 },
      { name: "Milt Wilcox", pos: "SP", stamina: 8, pitchSpeed: 5, offSpeed: 7, control: 6 },
      { name: "Juan Berenguer", pos: "SP", stamina: 6, pitchSpeed: 7, offSpeed: 6, control: 4 },
    ],
    bullpen: [
      { name: "Willie Hernandez", pos: "CL", stamina: 4, pitchSpeed: 7, offSpeed: 10, control: 9 },
      { name: "Aurelio Lopez", pos: "RP", stamina: 5, pitchSpeed: 6, offSpeed: 7, control: 7 },
      { name: "Doug Bair", pos: "RP", stamina: 4, pitchSpeed: 6, offSpeed: 6, control: 5 },
    ],
  },

  padres: {
    city: "San Diego",
    name: "Padres",
    abbr: "SD",
    league: "NL",
    lineup: [
      { name: "Alan Wiggins", pos: "2B", contact: 7, power: 2, bunting: 8, speed: 10, defense: 6, arm: 5 },
      { name: "Tony Gwynn", pos: "RF", contact: 10, power: 3, bunting: 6, speed: 7, defense: 8, arm: 8 },
      { name: "Steve Garvey", pos: "1B", contact: 7, power: 5, bunting: 2, speed: 3, defense: 7, arm: 5 },
      { name: "Graig Nettles", pos: "3B", contact: 6, power: 7, bunting: 3, speed: 3, defense: 9, arm: 8 },
      { name: "Terry Kennedy", pos: "C", contact: 7, power: 5, bunting: 3, speed: 2, defense: 6, arm: 7 },
      { name: "Kevin McReynolds", pos: "CF", contact: 7, power: 6, bunting: 3, speed: 5, defense: 7, arm: 7 },
      { name: "Carmelo Martinez", pos: "LF", contact: 6, power: 6, bunting: 3, speed: 4, defense: 6, arm: 8 },
      { name: "Garry Templeton", pos: "SS", contact: 7, power: 3, bunting: 5, speed: 6, defense: 6, arm: 8 },
    ],
    bench: [
      { name: "Kurt Bevacqua", pos: "1B/3B", contact: 6, power: 4, bunting: 3, speed: 3, defense: 5, arm: 5 },
      { name: "Bobby Brown", pos: "OF", contact: 5, power: 3, bunting: 5, speed: 7, defense: 5, arm: 5 },
      { name: "Bruce Bochy", pos: "C", contact: 5, power: 4, bunting: 2, speed: 2, defense: 5, arm: 6 },
      { name: "Tim Flannery", pos: "2B", contact: 6, power: 2, bunting: 5, speed: 4, defense: 6, arm: 5 },
      { name: "Luis Salazar", pos: "3B/OF", contact: 5, power: 3, bunting: 5, speed: 6, defense: 5, arm: 6 },
    ],
    rotation: [
      { name: "Eric Show", pos: "SP", stamina: 7, pitchSpeed: 6, offSpeed: 7, control: 8 },
      { name: "Ed Whitson", pos: "SP", stamina: 8, pitchSpeed: 6, offSpeed: 8, control: 7 },
      { name: "Tim Lollar", pos: "SP", stamina: 6, pitchSpeed: 6, offSpeed: 6, control: 5 },
      { name: "Andy Hawkins", pos: "SP", stamina: 7, pitchSpeed: 5, offSpeed: 6, control: 6 },
    ],
    bullpen: [
      { name: "Goose Gossage", pos: "CL", stamina: 3, pitchSpeed: 9, offSpeed: 8, control: 7 },
      { name: "Craig Lefferts", pos: "RP", stamina: 4, pitchSpeed: 6, offSpeed: 7, control: 8 },
      { name: "Dave Dravecky", pos: "RP", stamina: 5, pitchSpeed: 5, offSpeed: 7, control: 8 },
    ],
  },

  cubs: {
    city: "Chicago",
    name: "Cubs",
    abbr: "CHC",
    league: "NL",
    lineup: [
      { name: "Bob Dernier", pos: "CF", contact: 7, power: 2, bunting: 8, speed: 9, defense: 8, arm: 6 },
      { name: "Ryne Sandberg", pos: "2B", contact: 8, power: 7, bunting: 5, speed: 8, defense: 10, arm: 8 },
      { name: "Gary Matthews", pos: "LF", contact: 7, power: 5, bunting: 2, speed: 5, defense: 5, arm: 6 },
      { name: "Leon Durham", pos: "1B", contact: 7, power: 7, bunting: 3, speed: 5, defense: 5, arm: 5 },
      { name: "Keith Moreland", pos: "RF", contact: 7, power: 6, bunting: 2, speed: 3, defense: 5, arm: 7 },
      { name: "Jody Davis", pos: "C", contact: 6, power: 7, bunting: 2, speed: 2, defense: 7, arm: 8 },
      { name: "Ron Cey", pos: "3B", contact: 6, power: 7, bunting: 2, speed: 3, defense: 6, arm: 7 },
      { name: "Larry Bowa", pos: "SS", contact: 6, power: 2, bunting: 7, speed: 5, defense: 8, arm: 7 },
    ],
    bench: [
      { name: "Thad Bosley", pos: "OF", contact: 6, power: 3, bunting: 5, speed: 6, defense: 5, arm: 5 },
      { name: "Richie Hebner", pos: "3B/1B", contact: 6, power: 4, bunting: 3, speed: 3, defense: 5, arm: 5 },
      { name: "Henry Cotto", pos: "OF", contact: 5, power: 2, bunting: 6, speed: 7, defense: 5, arm: 5 },
      { name: "Steve Lake", pos: "C", contact: 5, power: 2, bunting: 4, speed: 2, defense: 6, arm: 7 },
      { name: "Dave Owen", pos: "SS", contact: 5, power: 2, bunting: 5, speed: 4, defense: 6, arm: 5 },
    ],
    rotation: [
      { name: "Rick Sutcliffe", pos: "SP", stamina: 9, pitchSpeed: 8, offSpeed: 9, control: 8 },
      { name: "Steve Trout", pos: "SP", stamina: 7, pitchSpeed: 6, offSpeed: 8, control: 6 },
      { name: "Dennis Eckersley", pos: "SP", stamina: 8, pitchSpeed: 7, offSpeed: 7, control: 9 },
      { name: "Scott Sanderson", pos: "SP", stamina: 7, pitchSpeed: 7, offSpeed: 6, control: 7 },
    ],
    bullpen: [
      { name: "Lee Smith", pos: "CL", stamina: 4, pitchSpeed: 10, offSpeed: 7, control: 6 },
      { name: "Tim Stoddard", pos: "RP", stamina: 4, pitchSpeed: 7, offSpeed: 5, control: 5 },
      { name: "George Frazier", pos: "RP", stamina: 4, pitchSpeed: 5, offSpeed: 6, control: 6 },
    ],
  },

  mets: {
    city: "New York",
    name: "Mets",
    abbr: "NYM",
    league: "NL",
    lineup: [
      { name: "Wally Backman", pos: "2B", contact: 7, power: 2, bunting: 7, speed: 7, defense: 6, arm: 4 },
      { name: "Mookie Wilson", pos: "CF", contact: 7, power: 3, bunting: 7, speed: 9, defense: 7, arm: 6 },
      { name: "Keith Hernandez", pos: "1B", contact: 8, power: 5, bunting: 3, speed: 4, defense: 10, arm: 8 },
      { name: "Darryl Strawberry", pos: "RF", contact: 6, power: 8, bunting: 2, speed: 7, defense: 6, arm: 8 },
      { name: "George Foster", pos: "LF", contact: 6, power: 7, bunting: 2, speed: 3, defense: 5, arm: 6 },
      { name: "Hubie Brooks", pos: "3B", contact: 7, power: 6, bunting: 3, speed: 5, defense: 5, arm: 8 },
      { name: "Mike Fitzgerald", pos: "C", contact: 5, power: 3, bunting: 4, speed: 3, defense: 6, arm: 6 },
      { name: "Jose Oquendo", pos: "SS", contact: 5, power: 2, bunting: 6, speed: 5, defense: 7, arm: 6 },
    ],
    bench: [
      { name: "Ron Gardenhire", pos: "SS", contact: 5, power: 2, bunting: 5, speed: 4, defense: 6, arm: 5 },
      { name: "Kelvin Chapman", pos: "2B", contact: 6, power: 2, bunting: 4, speed: 5, defense: 5, arm: 4 },
      { name: "John Gibbons", pos: "C", contact: 5, power: 3, bunting: 3, speed: 2, defense: 5, arm: 6 },
      { name: "Danny Heep", pos: "OF/1B", contact: 6, power: 3, bunting: 3, speed: 3, defense: 5, arm: 5 },
      { name: "Rusty Staub", pos: "PH", contact: 6, power: 4, bunting: 2, speed: 1, defense: 0, arm: 0 },
    ],
    rotation: [
      { name: "Dwight Gooden", pos: "SP", stamina: 8, pitchSpeed: 10, offSpeed: 9, control: 7 },
      { name: "Ron Darling", pos: "SP", stamina: 8, pitchSpeed: 7, offSpeed: 7, control: 6 },
      { name: "Walt Terrell", pos: "SP", stamina: 8, pitchSpeed: 6, offSpeed: 6, control: 7 },
      { name: "Bruce Berenyi", pos: "SP", stamina: 7, pitchSpeed: 7, offSpeed: 5, control: 4 },
    ],
    bullpen: [
      { name: "Jesse Orosco", pos: "CL", stamina: 4, pitchSpeed: 7, offSpeed: 8, control: 7 },
      { name: "Doug Sisk", pos: "RP", stamina: 5, pitchSpeed: 5, offSpeed: 7, control: 5 },
      { name: "Brent Gaff", pos: "RP", stamina: 4, pitchSpeed: 6, offSpeed: 5, control: 5 },
    ],
  },

  redsox: {
    city: "Boston",
    name: "Red Sox",
    abbr: "BOS",
    league: "AL",
    lineup: [
      { name: "Wade Boggs", pos: "3B", contact: 10, power: 3, bunting: 4, speed: 4, defense: 7, arm: 7 },
      { name: "Dwight Evans", pos: "RF", contact: 7, power: 8, bunting: 3, speed: 4, defense: 9, arm: 10 },
      { name: "Jim Rice", pos: "LF", contact: 7, power: 8, bunting: 2, speed: 4, defense: 6, arm: 8 },
      { name: "Tony Armas", pos: "CF", contact: 6, power: 10, bunting: 2, speed: 4, defense: 7, arm: 9 },
      { name: "Mike Easler", pos: "DH", contact: 8, power: 6, bunting: 2, speed: 3, defense: 0, arm: 0 },
      { name: "Bill Buckner", pos: "1B", contact: 7, power: 4, bunting: 3, speed: 3, defense: 6, arm: 4 },
      { name: "Rich Gedman", pos: "C", contact: 6, power: 6, bunting: 3, speed: 2, defense: 6, arm: 7 },
      { name: "Marty Barrett", pos: "2B", contact: 7, power: 2, bunting: 6, speed: 5, defense: 7, arm: 5 },
      { name: "Jackie Gutierrez", pos: "SS", contact: 5, power: 2, bunting: 5, speed: 6, defense: 5, arm: 6 },
    ],
    bench: [
      { name: "Reid Nichols", pos: "OF", contact: 5, power: 3, bunting: 4, speed: 5, defense: 5, arm: 5 },
      { name: "Ed Jurak", pos: "3B", contact: 5, power: 2, bunting: 4, speed: 4, defense: 5, arm: 5 },
      { name: "Jeff Newman", pos: "C", contact: 4, power: 3, bunting: 2, speed: 2, defense: 5, arm: 5 },
      { name: "Rick Miller", pos: "OF", contact: 5, power: 2, bunting: 5, speed: 4, defense: 6, arm: 5 },
      { name: "Glenn Hoffman", pos: "SS", contact: 5, power: 2, bunting: 5, speed: 4, defense: 6, arm: 6 },
    ],
    rotation: [
      { name: "Bruce Hurst", pos: "SP", stamina: 8, pitchSpeed: 7, offSpeed: 8, control: 7 },
      { name: "Oil Can Boyd", pos: "SP", stamina: 7, pitchSpeed: 7, offSpeed: 7, control: 7 },
      { name: "Bob Ojeda", pos: "SP", stamina: 7, pitchSpeed: 6, offSpeed: 7, control: 6 },
      { name: "Al Nipper", pos: "SP", stamina: 7, pitchSpeed: 5, offSpeed: 6, control: 6 },
    ],
    bullpen: [
      { name: "Bob Stanley", pos: "CL", stamina: 5, pitchSpeed: 5, offSpeed: 8, control: 8 },
      { name: "Mark Clear", pos: "RP", stamina: 4, pitchSpeed: 8, offSpeed: 5, control: 4 },
      { name: "John Henry Johnson", pos: "RP", stamina: 4, pitchSpeed: 6, offSpeed: 5, control: 5 },
    ],
  },

  yankees: {
    city: "New York",
    name: "Yankees",
    abbr: "NYY",
    league: "AL",
    lineup: [
      { name: "Willie Randolph", pos: "2B", contact: 7, power: 3, bunting: 6, speed: 6, defense: 8, arm: 6 },
      { name: "Don Mattingly", pos: "1B", contact: 9, power: 7, bunting: 3, speed: 4, defense: 9, arm: 7 },
      { name: "Dave Winfield", pos: "RF", contact: 8, power: 7, bunting: 2, speed: 5, defense: 8, arm: 9 },
      { name: "Don Baylor", pos: "DH", contact: 6, power: 7, bunting: 2, speed: 3, defense: 0, arm: 0 },
      { name: "Steve Kemp", pos: "LF", contact: 6, power: 5, bunting: 3, speed: 4, defense: 5, arm: 6 },
      { name: "Ken Griffey Sr.", pos: "CF", contact: 7, power: 4, bunting: 4, speed: 5, defense: 6, arm: 6 },
      { name: "Butch Wynegar", pos: "C", contact: 6, power: 3, bunting: 3, speed: 2, defense: 6, arm: 6 },
      { name: "Mike Pagliarulo", pos: "3B", contact: 6, power: 6, bunting: 3, speed: 3, defense: 5, arm: 7 },
      { name: "Bobby Meacham", pos: "SS", contact: 5, power: 2, bunting: 6, speed: 6, defense: 5, arm: 6 },
    ],
    bench: [
      { name: "Oscar Gamble", pos: "OF", contact: 5, power: 5, bunting: 2, speed: 3, defense: 4, arm: 4 },
      { name: "Roy Smalley", pos: "3B/SS", contact: 5, power: 4, bunting: 4, speed: 3, defense: 5, arm: 5 },
      { name: "Rick Cerone", pos: "C", contact: 5, power: 3, bunting: 3, speed: 2, defense: 6, arm: 6 },
      { name: "Brian Dayett", pos: "OF", contact: 5, power: 3, bunting: 4, speed: 4, defense: 5, arm: 5 },
      { name: "Tim Foli", pos: "SS", contact: 5, power: 2, bunting: 6, speed: 3, defense: 6, arm: 5 },
    ],
    rotation: [
      { name: "Phil Niekro", pos: "SP", stamina: 9, pitchSpeed: 4, offSpeed: 10, control: 8 },
      { name: "Ron Guidry", pos: "SP", stamina: 8, pitchSpeed: 8, offSpeed: 8, control: 7 },
      { name: "Ray Fontenot", pos: "SP", stamina: 7, pitchSpeed: 5, offSpeed: 6, control: 6 },
      { name: "Dennis Rasmussen", pos: "SP", stamina: 6, pitchSpeed: 6, offSpeed: 6, control: 6 },
    ],
    bullpen: [
      { name: "Dave Righetti", pos: "CL", stamina: 4, pitchSpeed: 9, offSpeed: 7, control: 7 },
      { name: "Jay Howell", pos: "RP", stamina: 4, pitchSpeed: 7, offSpeed: 6, control: 6 },
      { name: "Mike Armstrong", pos: "RP", stamina: 4, pitchSpeed: 6, offSpeed: 5, control: 5 },
    ],
  },

  orioles: {
    city: "Baltimore",
    name: "Orioles",
    abbr: "BAL",
    league: "AL",
    lineup: [
      { name: "Al Bumbry", pos: "CF", contact: 6, power: 3, bunting: 6, speed: 7, defense: 5, arm: 5 },
      { name: "Cal Ripken Jr.", pos: "SS", contact: 8, power: 8, bunting: 3, speed: 4, defense: 9, arm: 9 },
      { name: "Eddie Murray", pos: "1B", contact: 8, power: 8, bunting: 2, speed: 4, defense: 8, arm: 7 },
      { name: "Gary Roenicke", pos: "LF", contact: 6, power: 6, bunting: 3, speed: 3, defense: 6, arm: 7 },
      { name: "Wayne Gross", pos: "3B", contact: 5, power: 6, bunting: 3, speed: 3, defense: 6, arm: 7 },
      { name: "Ken Singleton", pos: "DH", contact: 7, power: 5, bunting: 2, speed: 2, defense: 0, arm: 0 },
      { name: "Mike Young", pos: "RF", contact: 6, power: 5, bunting: 3, speed: 4, defense: 5, arm: 6 },
      { name: "Rich Dauer", pos: "2B", contact: 5, power: 2, bunting: 6, speed: 3, defense: 7, arm: 5 },
      { name: "Rick Dempsey", pos: "C", contact: 5, power: 3, bunting: 4, speed: 3, defense: 8, arm: 7 },
    ],
    bench: [
      { name: "John Shelby", pos: "OF", contact: 5, power: 4, bunting: 5, speed: 6, defense: 6, arm: 7 },
      { name: "Jim Dwyer", pos: "OF", contact: 6, power: 4, bunting: 3, speed: 3, defense: 5, arm: 5 },
      { name: "Floyd Rayford", pos: "3B/C", contact: 5, power: 3, bunting: 3, speed: 3, defense: 5, arm: 6 },
      { name: "Lenn Sakata", pos: "2B/SS", contact: 5, power: 2, bunting: 5, speed: 4, defense: 6, arm: 5 },
      { name: "Joe Nolan", pos: "C", contact: 5, power: 2, bunting: 3, speed: 2, defense: 5, arm: 5 },
    ],
    rotation: [
      { name: "Mike Boddicker", pos: "SP", stamina: 8, pitchSpeed: 6, offSpeed: 9, control: 7 },
      { name: "Scott McGregor", pos: "SP", stamina: 8, pitchSpeed: 5, offSpeed: 8, control: 9 },
      { name: "Storm Davis", pos: "SP", stamina: 7, pitchSpeed: 6, offSpeed: 7, control: 7 },
      { name: "Mike Flanagan", pos: "SP", stamina: 7, pitchSpeed: 6, offSpeed: 7, control: 6 },
    ],
    bullpen: [
      { name: "Tippy Martinez", pos: "CL", stamina: 4, pitchSpeed: 7, offSpeed: 8, control: 6 },
      { name: "Sammy Stewart", pos: "RP", stamina: 5, pitchSpeed: 6, offSpeed: 6, control: 6 },
      { name: "Tom Underwood", pos: "RP", stamina: 4, pitchSpeed: 6, offSpeed: 6, control: 5 },
    ],
  },

  dodgers: {
    city: "Los Angeles",
    name: "Dodgers",
    abbr: "LAD",
    league: "NL",
    lineup: [
      { name: "Steve Sax", pos: "2B", contact: 6, power: 2, bunting: 7, speed: 7, defense: 5, arm: 5 },
      { name: "Ken Landreaux", pos: "CF", contact: 6, power: 4, bunting: 5, speed: 6, defense: 7, arm: 7 },
      { name: "Pedro Guerrero", pos: "3B", contact: 8, power: 7, bunting: 2, speed: 5, defense: 5, arm: 8 },
      { name: "Mike Marshall", pos: "RF", contact: 6, power: 7, bunting: 2, speed: 4, defense: 6, arm: 8 },
      { name: "Mike Scioscia", pos: "C", contact: 7, power: 3, bunting: 5, speed: 3, defense: 8, arm: 7 },
      { name: "Greg Brock", pos: "1B", contact: 5, power: 5, bunting: 3, speed: 3, defense: 6, arm: 5 },
      { name: "Franklin Stubbs", pos: "LF", contact: 5, power: 5, bunting: 4, speed: 5, defense: 6, arm: 6 },
      { name: "Dave Anderson", pos: "SS", contact: 5, power: 2, bunting: 5, speed: 5, defense: 6, arm: 6 },
    ],
    bench: [
      { name: "Bill Russell", pos: "SS", contact: 5, power: 2, bunting: 6, speed: 4, defense: 7, arm: 6 },
      { name: "Candy Maldonado", pos: "OF", contact: 5, power: 4, bunting: 3, speed: 5, defense: 5, arm: 6 },
      { name: "Bob Bailor", pos: "INF", contact: 5, power: 2, bunting: 5, speed: 4, defense: 5, arm: 5 },
      { name: "Steve Yeager", pos: "C", contact: 4, power: 3, bunting: 3, speed: 2, defense: 6, arm: 6 },
      { name: "R.J. Reynolds", pos: "OF", contact: 5, power: 2, bunting: 5, speed: 6, defense: 5, arm: 5 },
    ],
    rotation: [
      { name: "Alejandro Pena", pos: "SP", stamina: 7, pitchSpeed: 7, offSpeed: 8, control: 8 },
      { name: "Orel Hershiser", pos: "SP", stamina: 9, pitchSpeed: 7, offSpeed: 9, control: 7 },
      { name: "Fernando Valenzuela", pos: "SP", stamina: 9, pitchSpeed: 6, offSpeed: 9, control: 6 },
      { name: "Bob Welch", pos: "SP", stamina: 7, pitchSpeed: 7, offSpeed: 7, control: 7 },
    ],
    bullpen: [
      { name: "Ken Howell", pos: "CL", stamina: 4, pitchSpeed: 8, offSpeed: 6, control: 5 },
      { name: "Pat Zachry", pos: "RP", stamina: 4, pitchSpeed: 5, offSpeed: 6, control: 5 },
      { name: "Carlos Diaz", pos: "RP", stamina: 3, pitchSpeed: 5, offSpeed: 6, control: 6 },
    ],
  },
};

export const PITCH_TYPES = [
  { name: "Fastball", speed: "fast", break: 0, controlBonus: 2 },
  { name: "Curveball", speed: "slow", break: 3, controlBonus: 0 },
  { name: "Slider", speed: "medium", break: 2, controlBonus: 1 },
  { name: "Changeup", speed: "slow", break: 1, controlBonus: 1 },
];

export const SWING_TYPES = [
  { name: "Normal Swing", powerMod: 0, contactMod: 0, outcomeMod: 0 },
  { name: "Contact Swing", powerMod: -2, contactMod: 2, outcomeMod: 0 },
  { name: "Power Swing", powerMod: 2, contactMod: -2, outcomeMod: 1 },
  { name: "Take Pitch", powerMod: 0, contactMod: 0, outcomeMod: -1 },
  { name: "Bunt", powerMod: 0, contactMod: 0, outcomeMod: 0 },
];

export const TEAM_IDS = Object.keys(TEAMS);