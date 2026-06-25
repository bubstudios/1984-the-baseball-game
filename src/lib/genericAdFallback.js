// Auto-generates rich popup content for any banner ad that doesn't match a specific popup lib.
// Uses keyword detection on the ad text to produce thematic, detailed, era-accurate content.

const TV_SHOWS = {
  'Miami Vice': {
    icon: '🕶️', color: '#00b4d8',
    title: '🕶️ Miami Vice — NBC Thursday Nights',
    body: `MIAMI VICE — NBC, THURSDAYS 10/9 CENTRAL

The show that changed television. Don Johnson as Sonny Crockett. Philip Michael Thomas as Ricardo Tubbs. Pastels. No socks. Unshaven faces. Ferrari Testarossa. Synthesizers. Phil Collins.

THE PREMISE
Miami Metro Police's Organized Crime Bureau. Crockett and Tubbs go undercover — deep undercover — into Miami's cocaine cowboy world. The drug trade is everywhere. The music is always playing.

THE LOOK
Executive producer Michael Mann told the crew: no earth tones. No brown, no black — everything pastel. Coral jackets over white T-shirts. Ice-blue suits. The fashion industry took notes. Men's fashion has not been the same since.

THE MUSIC
Jan Hammer's synthesizer theme. Phil Collins' "In the Air Tonight." Glenn Frey's "You Belong to the City." The show treats music like a character. It works.

THE FERRARI
Crockett lives on a boat. He drives a white Ferrari Testarossa. These are the facts of the show. Nobody questions them.

THE IMPACT
Every police procedural you've watched since 1984 was influenced by Miami Vice. They just won't always admit it.

THURSDAYS 10/9 CENTRAL. NBC.
Dress accordingly.`
  },
  'Magnum P.I': {
    icon: '🔍', color: '#cc3300',
    title: '🔍 Magnum P.I. — CBS Thursdays',
    body: `MAGNUM P.I. — CBS, THURSDAYS 8/7 CENTRAL

Thomas Sullivan Magnum IV. Private investigator. Former Navy SEAL. Resident of a Hawaiian estate owned by the mysterious Robin Masters. Moustachioed. Charming. Drives a red Ferrari 308 GTS.

MAGNUM'S ARRANGEMENT
In exchange for security services at the Pineapple, Magnum gets to live rent-free, drive the Ferrari, and accept private investigation cases. Higgins disapproves of all of this. Magnum ignores Higgins. This is the show.

HIGGINS
Jonathan Quayle Higgins III. Played by John Hillerman. British. Proper. A man of principles, schedules, and considerable disapproval. Has two Doberman Pinschers named Zeus and Apollo who are trained to stop Magnum from doing whatever Magnum is about to do. They are very good at their jobs.

HAWAII
The show is shot on location in Oahu. It looks exactly like Hawaii because it is Hawaii. The ocean is that color. The sky is that blue. If you have never been to Hawaii, Magnum P.I. is a reasonable substitute.

TC AND RICK
T.C. (Theodore Calvin) flies a helicopter. Rick (Orville Wright) runs a club called the King Kamehameha Club. Both are Magnum's friends from Vietnam. Both get him into trouble. He gets them into trouble. This is friendship.

CBS. THURSDAYS.
The Ferrari is red. The mustache is real.`
  },
  'A-Team': {
    icon: '💥', color: '#cc0000',
    title: '💥 The A-Team — NBC Tuesdays',
    body: `THE A-TEAM — NBC, TUESDAYS 8/7 CENTRAL

In 1972, a crack commando unit was sent to prison by a military court for a crime they didn't commit. These men promptly escaped from a maximum security stockade to the Los Angeles underground. Today, still wanted by the government, they survive as soldiers of fortune. If you have a problem, if no one else can help, and if you can find them, maybe you can hire...

THE A-TEAM.

THE TEAM
Colonel John "Hannibal" Smith (George Peppard): The leader. Master of disguise. Always has a plan. Loves it when a plan comes together.

H.M. "Howling Mad" Murdock (Dwight Schultz): The pilot. Institutionalized. Possibly genuinely insane. Possibly not. Gets broken out of the psychiatric hospital every episode.

Templeton "Faceman" Peck (Dirk Benedict): The con man. Gets the supplies. Gets the girls. Has a plan B when Hannibal's plan A goes sideways.

B.A. Baracus (Mr. T): Drives the van. Fixes everything. Afraid of flying. Will not be getting on any plane. Pities the fool who suggests otherwise.

THE VAN
Black GMC Vandura. Red stripe. Custom interior. Indestructible. The most reliable vehicle in American television history.

THE RULE
Nobody ever actually dies on The A-Team. Bullets fly everywhere. Cars flip. Explosions happen. Everyone walks away. This is the contract with the audience. NBC holds to it.

NBC. TUESDAYS.
I pity the fool who misses it.`
  },
  'Cheers': {
    icon: '🍺', color: '#8B4513',
    title: '🍺 Cheers — NBC Thursday Nights',
    body: `CHEERS — NBC, THURSDAYS 9/8 CENTRAL

Making our way in the world today takes everything you've got. Taking a break from all your worries sure would help a lot. Wouldn't you like to get away?

Sometimes you want to go where everybody knows your name, and they're always glad you came. You want to be where you can see our troubles are all the same. You want to go where everybody knows your name.

THE BAR
Cheers. 112½ Beacon Street, Boston, Massachusetts. A bar in a basement. Dark wood. Pool table. Norm's barstool. The bar where everybody really does know your name.

THE CAST
Sam Malone (Ted Danson): Former Red Sox pitcher. Recovering alcoholic. Owns the bar. Perpetually attempting to win the affection of Diane Chambers.

Diane Chambers (Shelley Long): Intellectual. Graduate student. Waitress by circumstance. Sam's sparring partner, adversary, and complicated love interest.

Norm Peterson (George Wendt): Accountant. Regular. Always at the same stool. NORM! (This happens every single episode. The crowd always cheers. You always cheer with them.)

Cliff Clavin (John Ratzenberger): Postal worker. Know-it-all. A little sad. Completely endearing.

Carla Tortelli (Rhea Perlman): Waitress. Sharp tongue. Large family. Take no prisoners attitude toward Diane.

Coach Ernie Pantusso (Nicholas Colasanto): Bartender. Gentle. Confused. The heart of the show.

NBC. THURSDAYS.
Nobody is going to make you feel like you belong somewhere the way Cheers does.`
  },
  'Night Court': {
    icon: '⚖️', color: '#4a0080',
    title: '⚖️ Night Court — NBC Thursdays',
    body: `NIGHT COURT — NBC, THURSDAYS 9:30/8:30 CENTRAL

Manhattan Municipal Court, Part 2. The night shift. Judge Harold T. "Harry" Stone presides.

JUDGE STONE
Harry Anderson as Judge Harry Stone. 32 years old. Youngest judge in New York City history. Magic enthusiast. Mel Tormé fanatic. Wears a collection of hats. Genuinely kind beneath the eccentricity. Somehow maintains order in a courtroom that is constitutionally incapable of it.

THE CAST OF CHARACTERS WHO PASS THROUGH
Dan Fielding (John Larroquette): The prosecutor. Narcissistic. Libidinous. Hopelessly shallow. Somehow also sad and occasionally sympathetic. Larroquette won four consecutive Emmy Awards for this role. He deserved them.

Public Defender Christine Sullivan (Markie Post): Smart. Earnest. Decent. Perpetually confused about why she works in this building.

Bull Shannon (Richard Moll): Bailiff. Very large. Simple and sincere. Sometimes you wonder if Bull is secretly the wisest person in the room.

Roz Russell (Marsha Warfield): Court clerk. Deadpan. Tolerates nothing.

THE DEFENDANTS
Every episode brings new defendants through the courtroom. Prostitutes with philosophy degrees. Muggers with sob stories. Tourists who wandered in by accident. The variety is the point.

NBC. THURSDAYS.
The session is called to order.`
  },
  'Family Ties': {
    icon: '👨‍👩‍👧‍👦', color: '#2a6000',
    title: '👨‍👩‍👧‍👦 Family Ties — NBC Thursdays',
    body: `FAMILY TIES — NBC, THURSDAYS 8:30/7:30 CENTRAL

The Keatons of Columbus, Ohio. Steven and Elyse — former flower children, current adults. Their children: Alex, Mallory, Jennifer. A house. A family. A show about what happens when the idealism of the '60s collides with the ambition of the '80s, in one living room.

ALEX P. KEATON
Michael J. Fox. A teenage boy who idolizes Ronald Reagan and Richard Nixon, reads the Wall Street Journal, and argues economic theory at the breakfast table while his parents try to remember where they put their Grateful Dead albums. He is simultaneously the show's punchline and its secret heart. Fox is extraordinary.

ELYSE AND STEVEN
Meredith Baxter and Michael Gross. Parents who believe in community, in sharing, in the values of a generation that wanted to change the world. They haven't stopped wanting that. They just also now have a son who wants to make partner at a firm by 25.

MALLORY
Justine Bateman. Interested in fashion, boys, and not a great deal else. This is funnier than it sounds and more affectionate than it could be.

JENNIFER
Tina Yothers. The youngest. Smart. Observant. Watching everything.

THE ARGUMENT OF THE SHOW
Every generation has to figure out what to keep from the one before it and what to leave behind. The Keatons are figuring this out in real time.

NBC. THURSDAYS.
Some things are worth keeping.`
  },
  'Dynasty': {
    icon: '💎', color: '#8B008B',
    title: '💎 Dynasty — ABC Wednesdays',
    body: `DYNASTY — ABC, WEDNESDAYS 9/8 CENTRAL

Denver, Colorado. The Carrington family. Old money. New enemies. Shoulder pads.

THE CARRINGTONS
Blake Carrington (John Forsythe): Oil magnate. Patriarch. Has been married enough times to have opinions about it.

Alexis Carrington Colby (Joan Collins): Blake's ex-wife. The villain. The anti-hero. The reason 24 million Americans watch this show. Joan Collins arrived in Season 2 and immediately took control of the entire production.

Krystle (Linda Evans): Blake's current wife. Beautiful. Kind. Perpetually under assault from Alexis. Has not yet pushed Alexis into a pool, but it's coming.

THE FASHION
Nolan Miller designs the costumes. The shoulder pads are structural. The gowns are floor-length. Everything costs more than your car. This is aspirational television — not what life is, but what it looks like when someone decides money is no object.

THE CATFIGHTS
Technically "confrontations." Several of them take place in swimming pools, which raises questions about the logistics but not about the entertainment value.

THE COLBYS
There are so many Colbys. More arrive every season.

ABC. WEDNESDAYS.
The shoulder pads are load-bearing.`
  },
  'Dallas': {
    icon: '🤠', color: '#8B4513',
    title: '🤠 Dallas — CBS Fridays',
    body: `DALLAS — CBS, FRIDAYS 9/8 CENTRAL

Southfork Ranch. The Ewing family. Oil. Cattle. Air conditioning. Feuds that span generations. J.R. Ewing with a smile like a predator and the patience of a man who knows he's going to win eventually.

J.R. EWING
Larry Hagman. The greatest villain in American television. Charming. Ruthless. Scheming. Occasionally gets shot. Has been shot once definitively and the entire country spent an entire summer asking "Who shot J.R.?" and then found out it was Kristin, his sister-in-law, and spent another summer processing that.

The thing about J.R. is that he knows exactly who he is. No self-deception. No apologies. He wants what he wants and he will do what it takes.

This is not inspiring. But it is compelling.

BOBBY EWING
Patrick Duffy. The good one. Handsome. Decent. This makes him the target of literally everyone else on the show. Being the moral center of a show about the Ewings is its own kind of burden.

MISS ELLIE
Barbara Bel Geddes. The matriarch. Loves her sons. Knows exactly what they are. Loves them anyway.

SOUTHFORK
A real ranch in Parker, Texas. The house is on the National Register of Historic Places. People from all over the world drive out to see it.

CBS. FRIDAYS.
They're all going to stab each other.
That's the show.`
  },
  'Ghostbusters': {
    icon: '👻', color: '#00cc00',
    title: '👻 Ghostbusters — In Theaters Now',
    body: `GHOSTBUSTERS — COLUMBIA PICTURES
Now Playing at Theaters Nationwide

"Who ya gonna call?"

DR. PETER VENKMAN (Bill Murray): Parapsychologist. Possibly a fraud. Definitely charming. The one who talks while the other two do the actual thinking.

DR. EGON SPENGLER (Harold Ramis): The scientist. Collects spores, molds, and fungus. Designed the proton packs. Do not cross the streams.

DR. RAY STANTZ (Dan Aykroyd): The heart. The true believer. He actually loves ghosts. He's the one who would have become a ghost hunter even if it didn't pay.

ERNIE HUDSON as Winston Zeddemore: "If there's a steady paycheck in it, I'll believe anything you say." He becomes a Ghostbuster for the money and becomes one of the great movie companions.

THE TECHNOLOGY
Proton packs: unlicensed nuclear accelerators worn on the back. Containment unit: a grid in the basement that holds all captured ghosts. Ecto-1: a 1959 Cadillac ambulance converted into a ghost-chasing vehicle. None of this makes any scientific sense. This does not matter.

STAY PUFT MARSHMALLOW MAN
You will know him when you see him. Something that large and that white and that happy-looking approaching the city is not a good sign.

NOW PLAYING.
There is a ghost problem in New York City.
These three men are the solution.`
  },
  'Beverly Hills Cop': {
    icon: '🚨', color: '#cc8800',
    title: '🚨 Beverly Hills Cop — In Theaters',
    body: `BEVERLY HILLS COP — PARAMOUNT PICTURES
Starring Eddie Murphy — Now Playing Nationwide

AXEL FOLEY
Eddie Murphy. Detroit cop. No badge in California. No authority. No jurisdiction. No problem. Axel Foley has opinions about police procedure, and those opinions are: whatever works.

THE STORY
Axel's childhood friend is murdered in Detroit. The trail leads to Beverly Hills. Axel follows. Beverly Hills police — specifically Detective Taggart and Detective Rosewood — try to make him leave. He does not leave.

THE BANANA IN THE TAILPIPE
This happens in the first act. Axel puts a banana in a police car's tailpipe to prevent being followed. It works. The officers involved are embarrassed. The audience cheers.

THE LAUGH
Eddie Murphy has a laugh. You know the one. It happens in this movie approximately seven times. Each time feels like the first time.

THE MUSIC
Harold Faltermeyer's "Axel F." The synthesizer melody. If you hear it, you know exactly where you are and what year it is. You cannot unhear it. You wouldn't want to.

THE COMEDY
Axel Foley talks his way out of and into everything. He's faster than the situation. He's always two steps ahead. Murphy's improvisation is visible through the finished film and that's a gift, not a flaw.

NOW PLAYING.
One cop. Wrong city. Right attitude.`
  },
  'Karate Kid': {
    icon: '🥋', color: '#cc0000',
    title: '🥋 The Karate Kid — In Theaters',
    body: `THE KARATE KID — COLUMBIA PICTURES
Starring Ralph Macchio & Pat Morita — Now Playing

DANIEL LARUSSO
New Jersey. Moves to California. Immediately picked on by the Cobra Kai students. Learns karate from his apartment building's handyman. Enters the All Valley Karate Tournament. This is the movie.

MR. MIYAGI
Pat Morita. Handyman. War veteran. Karate master. Teaches Daniel through seemingly unrelated chores: wax on, wax off. Sand the floor. Paint the fence. These movements are the blocks and strikes of karate. Daniel realizes this. The audience realized it before Daniel did and spent that time feeling superior and also moved.

"First learn stand, then learn fly. Nature rule, Daniel-san, not mine."

THE CRANE KICK
The final move of the final match. One leg raised. Arms extended. The Cobra Kai student has a bad knee. Daniel has one good leg. The tournament referee counts the point. That's the movie.

THE COBRA KAI
"Strike first. Strike hard. No mercy." Their karate is real. Their ethos is wrong. They are bullies with good form. This is exactly the right kind of movie villain.

THE LESSON
Karate is not the lesson. Balance is the lesson. Life balance. In everything. "Wax on, wax off" means more than wax.

NOW PLAYING.
Daniel-san is ready.`
  },
  'Gremlins': {
    icon: '😈', color: '#2a8000',
    title: '😈 Gremlins — In Theaters Now',
    body: `GREMLINS — WARNER BROS.
Directed by Joe Dante, Produced by Steven Spielberg — Now Playing

THE THREE RULES
1. Keep them away from bright light. Bright light hurts them. Sunlight kills them. Do not take them outside.
2. Never get them wet. If they get wet, they multiply. If one gremlin is a problem — and it is — many gremlins are a catastrophe.
3. Never, ever feed them after midnight. No matter what they say. No matter how hungry they seem. No matter what time it "actually" is. Do not feed them after midnight.

These rules will be broken within the first forty minutes of the film. This is not a spoiler. This is the contract the movie makes with the audience.

GIZMO
The original Mogwai. Small. Furry. Enormous brown eyes. Sings little songs. Genuinely, innocently good. Does not want any of what is about to happen to happen. Gizmo is the purest being in any film released in 1984.

THE GREMLINS
What happens after the rules are broken. Multiple times. In a small town in Pennsylvania, at Christmas, they get into the movie theater, into the bar, into the shopping mall, into the kitchen, and into everything that can be destroyed.

THE KITCHEN SCENE
There is a scene involving a microwave. We will not describe it further. You will know it immediately. You will not forget it.

NOW PLAYING.
Bright light. No water. Don't feed after midnight.
You're going to forget one of these.`
  },
  'Indiana Jones': {
    icon: '🎩', color: '#8B4513',
    title: '🎩 Indiana Jones & the Temple of Doom',
    body: `INDIANA JONES AND THE TEMPLE OF DOOM — PARAMOUNT PICTURES
Directed by Steven Spielberg — Now Playing Nationwide

THE SETUP
India, 1935. Before Raiders. Henry Jones Jr. — Dr. Jones in the classroom, Indiana Jones everywhere else — finds himself in a small village that has lost its children and its sacred stone. He goes to get them back. The temple under the palace contains approximately everything he should not encounter.

INDIANA JONES
Harrison Ford. The character George Lucas described as "a 1930s pulp hero in the real world." Afraid of snakes. Excellent with a whip. Has a fedora that has survived more than any article of clothing in film history. A professor of archaeology who regards museum collections as secondary to the experience of finding the things.

SHORT ROUND
Jonathan Ke Quan as Short Round, Indy's companion. A 12-year-old who drives a car, plays poker, and keeps up with Indiana Jones through a sequence of events that should not be survivable by anyone. He is the most capable person in most rooms he enters.

WILLIE SCOTT
Kate Capshaw as Willie, a singer who did not sign up for any of this. Her commentary on the situation is accurate and appropriate throughout.

THE HEART-PULLING SCENE
There is a scene involving a chest and a heart. It has been discussed at length. You will not be prepared for it regardless.

NOW PLAYING.
Short Round says hold onto your hat.`
  },
  'Star Trek': {
    icon: '🖖', color: '#000080',
    title: '🖖 Star Trek III: The Search for Spock',
    body: `STAR TREK III: THE SEARCH FOR SPOCK — PARAMOUNT
Directed by Leonard Nimoy — Now Playing

THE SITUATION
Star Trek II ended with the death of Spock. This was a real death. Not a fake movie death — a death with weight and consequences that carried into the next film. The enterprise crew mourns. Except Dr. McCoy is acting strangely.

Because Spock, at the moment of his death, performed a mind meld with McCoy. His consciousness is in McCoy's mind. This is a problem for McCoy and the foundation of the entire film.

THE ENTERPRISE
James Kirk steals the Enterprise. Admiral James T. Kirk of Starfleet Command steals the most famous ship in the fleet with a skeleton crew in order to return to Genesis and find whatever Spock left there. This is an act of mutiny. Kirk does it anyway. This says everything about Kirk.

THE KLINGONS
Christopher Lloyd as the villain Kruge. Commander Kruge wants the Genesis device and will do anything to obtain it. Christopher Lloyd gives a performance that proves a great actor in Klingon makeup is still a great actor.

THE SACRIFICE
Kirk makes a choice in the final act that costs him more than most film heroes ever pay. The price is right for the story and it resonates.

NOW PLAYING.
The search continues.
The crew holds.`
  },
  'Footloose': {
    icon: '🎵', color: '#cc0000',
    title: '🎵 Footloose — Now in Theaters',
    body: `FOOTLOOSE — PARAMOUNT PICTURES
Starring Kevin Bacon — Now Playing

REN MCCORMACK
Kevin Bacon. Chicago kid moves to Bomont, a small town where dancing has been banned by law following a tragedy. He finds this regulation insane. He is correct. The movie follows him toward proving this through a town council meeting and a prom.

THE BAN
Bomont has banned public dancing. Specifically public dancing by minors. Reverend Shaw Moore (John Lithgow) is the primary architect and enforcer of this policy. He believes it sincerely. Lithgow plays him as a real person with real grief, not a cartoon villain. This is what elevates the film.

ARIEL MOORE
Lori Singer as Ariel, the reverend's daughter. Rebellious. Dating a local boy who doesn't deserve her. Drawn to Ren. Their dynamic is the emotional center of the film when the film isn't busy being a music video.

THE MUSIC
Kenny Loggins' "Footloose." Deniece Williams' "Let's Hear It for the Boy." Bonnie Tyler's "Holding Out for a Hero." The soundtrack is, independently of the film, excellent. The film agrees with you and insists on playing all of it.

THE WAREHOUSE SCENE
Kevin Bacon, alone, gymnastic-angry-dancing through an empty mill. This scene has no narrative justification and is 100% correct to be in the film.

NOW PLAYING.
Everybody cut. Everybody cut.
Everybody cut footloose.`
  },
};

const FAST_FOOD = {
  "McDonald's": {
    icon: '🍔', color: '#FFC72C',
    title: "🍔 McDonald's — You Deserve a Break Today",
    body: `McDONALD'S — AMERICA'S RESTAURANT

"You deserve a break today. So get up and get away — to McDonald's."

THE NUMBERS
McDonald's serves approximately 26 million customers every day in the United States. There are 6,600 locations. In 1984, you are statistically unlikely to be more than 5 miles from one at any moment in a major American city.

THE BIG MAC
Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun. Ray Kroc didn't invent it — a franchise operator in Pennsylvania named Jim Delligatti did, in 1967. Kroc saw it, understood it, and put it everywhere.

THE FRIES
McDonald's fries are made from Russet Burbank potatoes. They are cut, blanched, par-fried, frozen, shipped to the restaurant, and fried again in beef tallow. The result is one of the most consistent taste experiences in American life. If you've ever been hungry and smelled McDonald's fries, you understand.

THE PLAYPLACE
Many McDonald's locations now have outdoor playsets. These are primarily for children but also for adults who are small enough to fit.

RONALD McDONALD
The clown. Red hair. Yellow suit. Large shoes. Has been the face of McDonald's since 1966. Was the second-most recognizable fictional character in America after Santa Claus, according to a study from several years ago.

AFTER THE GAME
McDonald's is open late.
Quarter Pounder. Large Fries. Vanilla shake.
You deserve it.`
  },
  'Burger King': {
    icon: '👑', color: '#cc0000',
    title: '👑 Burger King — Have It Your Way',
    body: `BURGER KING — HAVE IT YOUR WAY

The year is 1984. The great American fast food debate is ongoing and will not be resolved here.

THE WHOPPER
Burger King's flagship sandwich. A quarter-pound beef patty, flame-broiled, on a sesame seed bun. Lettuce, tomato, onion, pickles, mayonnaise, ketchup. You can have it without any of these things. You can have it with extra. This is the point. You are having it your way.

FLAME-BROILED
The advertising is not lying. Burger King does cook its burgers over a flame. This produces a char flavor that McDonald's — which fries on a flat griddle — does not produce. Whether this is better is a matter of sincere personal conviction that divides Americans to this day.

"WHERE'S THE BEEF?"
That is Wendy's. Burger King has its own campaign. Please do not confuse them. They are paying for these commercials separately.

THE WHOPPER JUNIOR
For when a full Whopper is too much burger. It is never actually too much burger. But the Junior exists.

HAVE IT YOUR WAY
The slogan is a small declaration of independence. Hold the pickles, hold the lettuce. Special orders do not upset them. At McDonald's, you order what they have configured. At Burger King, you collaborate on your sandwich. This distinction matters enormously to people for whom it matters.

AFTER THE GAME
Flame-broiled. Your way.
That's Burger King.`
  },
  "Wendy's": {
    icon: '🍔', color: '#cc3300',
    title: "🍔 Wendy's — Where's the Beef?",
    body: `WENDY'S — WHERE'S THE BEEF?

Clara Peller. 81 years old. Former manicurist. In early 1984, she appeared in a Wendy's commercial squinting at a tiny hamburger patty on a massive bun and asking: "Where's the beef?"

America immediately understood.

THE LINE
"WHERE'S THE BEEF?" entered the national vocabulary within weeks. Walter Mondale used it against Gary Hart in the Democratic primary. It appeared on buttons, T-shirts, and bumper stickers. A fast food commercial became a cultural artifact.

Clara Peller became famous. She did other commercials. She appeared on talk shows. She was not expecting any of this. She is handling it well.

THE ACTUAL BEEF
Wendy's serves fresh, never-frozen hamburger patties. They are square. The corners stick out past the round bun. This is intentional. Dave Thomas, Wendy's founder, wanted customers to see that there was beef at every angle. The square patty is not an accident.

THE FROSTY
A chocolate frozen dairy dessert. Thick enough to hold a spoon upright. Some people dip their fries in it. These people are correct. Do not argue with them about this.

WHERE'S THE BEEF?
At Wendy's, apparently.
Always at the corners.`
  },
};

const COMPUTERS = {
  'Radio Shack': {
    icon: '💻', color: '#cc0000',
    title: '💻 Radio Shack — Tandy 1000',
    body: `RADIO SHACK — YOUR NEIGHBORHOOD COMPUTER STORE

There is a Radio Shack within 10 miles of 94% of all Americans. This is not an accident. Radio Shack went everywhere. They're in malls, in strip malls, in small towns, in cities. The selection ranges from 9-volt batteries to personal computers.

THE TANDY 1000
Retail price: $1,199.00 for the base model. It includes 128K of RAM (expandable to 640K), a 5.25-inch floppy drive, and enhanced PCjr-compatible graphics and sound. It is, in 1984, a very good personal computer at a reasonable price.

The Tandy 1000 runs PC-DOS and is compatible with IBM PC software, which matters because IBM PC software is what businesses use. Buying a Tandy 1000 means you can take work home and it will actually open.

THE STORE ITSELF
Red signage. A salesperson who knows more about electronics than you and will tell you about it. A glass case near the register with calculators, CB radios, and remote-controlled cars. A smell of electronics and new plastic. Batteries in a drawer. The parts drawer.

If you need a specific wire, a specific connector, a specific component for a project your father is trying to fix — Radio Shack has it. This is the function Radio Shack fills in American life that nobody else fills.

YOUR NEIGHBORHOOD RADIO SHACK.
Batteries. Computers. Everything in between.`
  },
  'Commodore 64': {
    icon: '🖥️', color: '#8B6914',
    title: '🖥️ Commodore 64 — The Computer for Everyone',
    body: `COMMODORE 64 — ONE MILLION SOLD AND COUNTING

The Commodore 64. Released in 1982. Currently the best-selling personal computer in history. Retail price: $200, down from $595 at launch. Sixty-four kilobytes of RAM. The SID chip for audio. An 8-bit MOS Technology 6510 processor running at 0.985 MHz.

WHY IT MATTERS
The C64 is affordable. Previous home computers — the Apple II, the TRS-80 — cost more than $1,000. The C64 brought personal computing to households that could not have otherwise participated.

THE GAMES
Over 10,000 programs available on cartridge and floppy disk. Games: Jumpman, Pitfall!, Beach-Head, Impossible Mission, International Soccer, The Bard's Tale. Games that have no business running this well on this hardware. Games that the programmers squeezed extraordinary performance out of by understanding the chip completely.

THE SID CHIP
The Sound Interface Device. Three oscillators. Filter. Ring modulation. It produces audio quality that surprises everyone who hears it from a $200 computer. Entire musical subcultures have grown around composing music specifically for the SID chip.

THE DEMO SCENE
Programmers writing programs whose entire purpose is to demonstrate what the hardware can do — scrolling text, plasma effects, music — sharing them at computer clubs across the country and in Europe.

AT YOUR LOCAL DEALER.
One million sold.
Ask why.`
  },
  'Apple': {
    icon: '🍎', color: '#555555',
    title: '🍎 Apple — The Future Is Now',
    body: `APPLE COMPUTER — CUPERTINO, CALIFORNIA

On January 24, 1984, Apple Computer introduced the Macintosh. During Super Bowl XVIII, they ran a single commercial directed by Ridley Scott. It cost $900,000 to produce and aired once during the Super Bowl and was not re-aired.

The commercial depicted a woman throwing a hammer at a screen showing a figure speaking to rows of mindless, gray people. The tagline: "On January 24th, Apple Computer will introduce Macintosh. And you'll see why 1984 won't be like '1984.'"

THE MACINTOSH
Price: $2,495. Includes: a 9-inch black-and-white display, 128K RAM, a 3.5-inch 400K floppy drive, and a mouse. The mouse is important.

Most computers in 1984 are operated by typing commands. The Macintosh is operated by moving a small device across a surface and clicking. Windows. Icons. Menus. Point and click. This interface will, within a decade, be how everyone uses computers.

THE APPLE II
Still available. Still excellent. Over a million Apple IIs are in schools and homes. Educational software — Oregon Trail, Number Munchers, Reader Rabbit — runs on the Apple II. Entire generations are learning computing on these machines.

THE APPLE IIe
The current model. Enhanced keyboard. 64K RAM standard. Expandable. Used in schools nationwide. The computer your children are learning on.

APPLE COMPUTER.
1984 was not like '1984.'
The hammer landed.`
  },
};

const CAR_ADS = {
  'Ford': {
    icon: '🚗', color: '#003087',
    title: '🚗 Ford — Built Tough',
    body: `FORD MOTOR COMPANY — DEARBORN, MICHIGAN

Henry Ford started this company in 1903. In 1908, he introduced the Model T. In 1913, he introduced the moving assembly line. In 1984, Ford has been making cars in America for 81 years. They know what they're doing.

THE FORD TEMPO
New for 1984. Front-wheel drive. Aerodynamic styling with a drag coefficient of 0.36 — better than most European cars. Available as a coupe or sedan. Base price: $7,552. The Tempo is Ford's answer to the fuel-efficient, import-competitive segment.

THE F-SERIES PICKUP
America's best-selling truck. Has been the best-selling truck in America for many years running. The F-150: half-ton payload, available with a 4.9-liter inline-6 or 5.0-liter V-8. "Built Ford Tough" is not marketing. The trucks bear it out.

THE MUSTANG
Twentieth anniversary of the original Mustang. Ford released a special 20th Anniversary edition GT350 convertible in 1984, built at the Indy 500 as pace cars. Oxford White with Canyon Red interior. 5.0-liter V-8. Limited edition.

THE FORD DEALER
Your local Ford dealer has the Tempo, the F-Series, the Mustang, the Escort, the LTD. Test drives available. You'll get coffee while you wait. The salesman will shake your hand whether you buy or not. Usually.

FORD.
Quality is Job 1.
They mean it.`
  },
  'Chevrolet': {
    icon: '🚗', color: '#cc0000',
    title: '🚗 Chevrolet — The Heartbeat of America',
    body: `CHEVROLET — GENERAL MOTORS — DETROIT, MICHIGAN

"Baseball, hot dogs, apple pie and Chevrolet." The song played in commercials for years. It worked because it was, for many Americans, simply accurate. Chevrolet has been woven into American life since 1911.

THE CHEVROLET CAVALIER
New for 1984. Compact. Front-wheel drive. Base price: $6,490 for the standard coupe. Available as coupe, hatchback, sedan, and wagon. The Cavalier is Chevy's answer to the fuel economy era — smaller, lighter, more efficient than the full-size cars that built Chevrolet's reputation, but still an American car.

THE CAMARO
The muscle car that survived the fuel crisis. 1984 Camaro Z28: 5.0-liter V-8, 190 horsepower. T-top option available. The Camaro is the reason some people buy Chevrolets and nothing else.

THE CORVETTE
America's sports car. 1984 Corvette: completely redesigned. New chassis, new body, new interior. 5.7-liter V-8, 205 horsepower. 0-60 in 6.7 seconds. Base price: $21,800. If you have to ask about the payments, you are not the target customer.

THE SUBURBAN
The full-size SUV that has been in production since 1935. The longest-running vehicle nameplate in American history. Seats up to nine. Tows anything.

CHEVROLET.
The Heartbeat of America.
It's been beating since 1911.`
  },
  'Chrysler': {
    icon: '🚐', color: '#8B0000',
    title: '🚐 Chrysler Minivan — America Reimagined',
    body: `CHRYSLER CORPORATION — THE MINIVAN ARRIVES

In November 1983, Chrysler introduced two vehicles simultaneously: the Dodge Caravan and the Plymouth Voyager. They called them "minivans." No one had ever called anything a minivan before.

THE IDEA
Lee Iacocca — who was fired from Ford and then hired to save Chrysler — remembered a concept he'd championed at Ford that was rejected. A van-sized vehicle with car-like handling, easy entry and exit, and room for the whole family. Ford said no. Chrysler said yes.

THE RESULT
Front-wheel drive. 112-inch wheelbase. Seven-passenger seating. Base price: $7,349 for the Caravan, $7,519 for the Voyager. A sliding side door on the driver's side. An optional fold-flat rear seat.

WHAT IT CHANGED
Station wagons were how families transported families before this. The minivan is better at being a station wagon than station wagons are. The market understood this immediately.

Sales in the first year: 210,000 units. The Caravan and Voyager together outsell every other Chrysler product.

THE COMPETITION
Ford is working on something. GM is working on something. Neither is ready yet. Chrysler has the market to itself.

LEE IACOCCA SAYS
"If you can find a better car, buy it." He has been saying this about Chrysler for several years. Chrysler has gotten better every year he's been saying it.

YOUR LOCAL CHRYSLER DEALER.
The minivan.
America wasn't sure it needed it.
America needed it.`
  },
  'Pontiac': {
    icon: '🚗', color: '#cc0000',
    title: '🚗 Pontiac Fiero — We Build Excitement',
    body: `PONTIAC FIERO — WE BUILD EXCITEMENT

The Pontiac Fiero. Mid-engine. Two-seat sports car. Built in Pontiac, Michigan. The first mass-market, mid-engine car produced in America since the 1914 Scripps-Booth.

THE ENGINEERING
Mid-engine layout means the engine sits behind the driver and in front of the rear axle. This is where Ferrari puts its engines. This is where Porsche puts some of its engines. The weight distribution and handling characteristics that result from a mid-engine layout are fundamentally different from a front-engine car.

Pontiac built this into a car that starts at $7,999.

THE BODY
Space frame construction with plastic body panels. The panels don't rust. If you scratch a Fiero, the affected panel can be unbolted and replaced individually. This was considered innovative in 1984. It was innovative in 1984.

THE ENGINE
A 2.5-liter four-cylinder producing 92 horsepower. Not fast. The Fiero GT version with a 2.8-liter V6 is coming. That one will be faster.

THE LOOK
It looks like a sports car because it is a sports car. Not a "sports-looking car." A sports car. Heads turn. This is documented.

PONTIAC.
We Build Excitement.
The Fiero is why.`
  },
};

const SODAS = {
  'Coca-Cola': {
    icon: '🥤', color: '#cc0000',
    title: '🥤 Coca-Cola — Coke Is It!',
    body: `COCA-COLA — ATLANTA, GEORGIA

"Coke Is It." Three words. Introduced in 1982 as Coca-Cola's primary advertising slogan. It replaced "Have a Coke and a Smile," which replaced "It's the Real Thing," which replaced previous slogans going back to 1886.

THE FORMULA
Coca-Cola was invented in 1886 by Dr. John Pemberton in Atlanta. The formula has been kept secret since 1891. It is allegedly written on a piece of paper in a vault at SunTrust Bank in Atlanta. Two Coca-Cola executives know the formula at any given time. They are not allowed to travel on the same airplane.

This is probably true. It might be marketing. It might be both.

THE CANS
In 1984, Coca-Cola cans come in the familiar red-and-white design with the Spencerian script logo. The cans are 12 ounces. A 12-pack at the grocery store costs around $2.49. A can from a vending machine costs 50 cents. A fountain Coke at a restaurant costs somewhere between 75 cents and $1.25 and is bottomless, which changes the economics entirely.

THE COMPETITION
Pepsi runs "The Pepsi Challenge" — blind taste tests in which participants reportedly prefer Pepsi. Coca-Cola disputes this. The research shows Pepsi is sweeter and wins in single-sip blind tests. Coca-Cola argues that nobody drinks a single sip and stops.

THE CLASSIC
In a few months, Coca-Cola will introduce "New Coke," reformulating the beverage. The public reaction will be immediate and severe. Classic Coke will return. Nobody will speak of this again.

COKE IS IT.`
  },
  'Pepsi': {
    icon: '🥤', color: '#003087',
    title: '🥤 Pepsi — The Choice of a New Generation',
    body: `PEPSI-COLA — PURCHASE, NEW YORK

"Pepsi: The Choice of a New Generation."

This slogan, introduced in 1984, is a declaration of war on Coca-Cola dressed up as demographic positioning. Coca-Cola is the establishment. Pepsi is what young people choose. This is the argument. It is also advertising.

THE PEPSI CHALLENGE
Since 1975, Pepsi has run blind taste tests in which participants, given unmarked cups of Pepsi and Coke, choose Pepsi more often. The ads show this happening. Coca-Cola disputes the methodology. The challenge continues.

THE SCIENCE
Pepsi is slightly sweeter than Coca-Cola. In a single-sip test, sweeter wins. In a full can or bottle, preferences are more complex. Brain imaging studies conducted years later will show that brand awareness changes how people experience the taste, independent of the actual beverage. This is fascinating and also slightly troubling.

MICHAEL JACKSON
In 1984, Pepsi signed Michael Jackson for a $5 million advertising campaign — the largest celebrity endorsement in history at that moment. Jackson's hair caught fire during the filming of a Pepsi commercial in January 1984. The commercial ran anyway. Michael Jackson used the settlement money to purchase the rights to the Beatles' catalog.

DIET PEPSI
Available now. One calorie. Same Pepsi. The diet soda market is growing every year.

THE CHOICE OF A NEW GENERATION.
Michael Jackson says so.`
  },
};

const GENERAL_PSA_CONTENT = {
  'seatbelt': {
    icon: '🚗', color: '#555555',
    title: '🚗 Buckle Up — National Safety Campaign',
    body: `BUCKLE UP — IT'S THE LAW AND IT WORKS

In 1984, New York became the first state in America to pass a mandatory seatbelt law. It went into effect January 1, 1985. Other states are watching.

THE DATA
Seatbelts reduce the risk of death in a car accident by 45% for front seat passengers. In a rollover, the reduction is 60%.

In 1983, 44,452 Americans died in motor vehicle accidents. Seatbelt use was approximately 14% nationally. If seatbelt use reached 70%, researchers estimate 12,000 fewer deaths per year.

THE PHYSICS
In a car traveling at 35 miles per hour that stops suddenly, an unbelted passenger continues moving forward at 35 mph. The dashboard, windshield, or the road stops them. The stop takes approximately 0.1 seconds and involves enormous force.

A seatbelt spreads that force across the strongest parts of the body over a longer time period. The car decelerates with you.

THE COMMON OBJECTIONS
"I might be trapped." — Seatbelts do not prevent you from exiting a vehicle. They prevent you from being ejected through a windshield.

"I'm just going a short distance." — Most accidents happen within 25 miles of home.

"I'll brace myself." — You cannot brace against 35 mph of momentum. Nobody can.

BUCKLE UP.
One second. Every time.
It's not optional.`
  },
};

// ── Miscellaneous 1984-era ad content ──
const MISC_ADS = {
  'vcr': {
    icon: '📼', color: '#2a2a2a',
    title: '📼 The VCR Revolution',
    body: `THE VCR — VIDEO CASSETTE RECORDER

In 1984, the VCR is the most transformative consumer electronics device since the television itself. Americans are programming their VCRs before leaving for work, recording shows to watch later — a concept so novel it has its own term: "time-shifting."

THE TECHNOLOGY
VHS (Video Home System) and Betamax are the two competing formats. VHS is winning. A blank VHS tape costs $8-12 and records up to 6 hours in EP mode. The picture quality in EP is acceptable. In SP mode, it's excellent but only fits 2 hours.

THE VIDEO STORE
There are over 7,000 video rental stores in America in 1984, growing fast. You walk in, browse plastic cases on shelves, pick a movie, show your membership card, pay $2-3 per night, and take it home. Late fees are strict. Everyone has paid late fees.

PROGRAMMING THE VCR
The clock blinks 12:00 because nobody has figured out how to set it. Programming a recording requires navigating a menu system with a remote that has 30 buttons. The manual is 40 pages. Your teenager can do it. You cannot.

THE IMPACT
For the first time, television is not something you have to be home for. You watch what you want, when you want. The entertainment industry will never be the same.

PROGRAM YOUR VCR.
Before you leave for work.
Before you miss another episode.`,
  },
  'future_tech': {
    icon: '🔮', color: '#4a0080',
    title: '🔮 The Future Is Coming',
    body: `THE FUTURE — IT'S CLOSER THAN YOU THINK

Some even predict a computer in every home. This sounds absurd. It is not absurd.

THE NUMBERS
In 1984, approximately 8% of American households own a personal computer. That number was 1% in 1981. It is doubling every two years. At this rate, a computer in every home is not a prediction — it is arithmetic.

WHAT CHANGES
A computer in the home means: word processing instead of typewriters. Spreadsheets instead of ledger paper. Games instead of board games (though board games will survive). Educational software instead of flash cards. The internet does not exist yet for consumers, but researchers at universities are already sending electronic mail to each other.

THE SKEPTICS
"This is a fad." — People said this about television in 1948. There were 4,000 televisions in America in 1948. There are 84 million in 1984. Fads don't do that.

THE OPTIMISTS
"This will change everything." — They are right. They don't know how yet. Nobody does. But the direction is clear.

THE COMPUTER
It sits on a desk. It has a screen. It has a keyboard. It does what you tell it to do, slowly, in a language that is not English. Your children will learn this language. You may not. That's okay. They'll help you.

SOME EVEN PREDICT A COMPUTER IN EVERY HOME.
They're probably right.`,
  },
  'telecom': {
    icon: '☎️', color: '#003087',
    title: '☎️ The Telephone Revolution',
    body: `THE TELEPHONE — AMERICA'S SYSTEM IS CHANGING

New services are becoming available nationwide. The telecommunications industry has been fundamentally restructured, and the effects are reaching your home.

THE BREAKUP OF AT&T
On January 1, 1984, AT&T was broken up into seven regional operating companies — the "Baby Bells." This is the largest corporate reorganization in American history. The Bell System that existed since 1885 no longer exists in the form your parents knew.

WHAT IT MEANS FOR YOU
Long-distance service is now competitive. AT&T, MCI, and Sprint are all competing for your long-distance calls. Rates are falling. The quality is improving. You can now choose your long-distance carrier, which is a sentence that would have been meaningless two years ago.

THE TECHNOLOGY
Touch-tone phones are replacing rotary phones. Cordless phones are arriving in stores. Fax machines are appearing in offices. The infrastructure for digital communication is being laid, quite literally, across the country — fiber optic cables being buried alongside highways.

THE FUTURE
Some researchers believe that someday, telephone lines will carry not just voice but data — pictures, documents, even video. This seems far-fetched. The bandwidth required is enormous. But the technology is improving faster than anyone predicted.

NEW SERVICES ARE BECOMING AVAILABLE NATIONWIDE.
The world is getting smaller.
One call at a time.`,
  },
  'ballpark_food': {
    icon: '🥨', color: '#b45309',
    title: '🥨 Ballpark Food — An American Tradition',
    body: `BALLPARK FOOD — A TRADITION AS OLD AS THE GAME

Take a break and enjoy a soft pretzel. Or a hot dog. Or peanuts. Or all three. This is the ballpark experience.

THE HOT DOG
The ballpark frank is not the same as the hot dog you eat at home. It is larger. It costs more. It tastes better. This is not a coincidence — the concession industry has spent decades perfecting the ballpark hot dog experience. The bun is softer. The mustard is brighter yellow. The whole thing costs $1.50, which is 50 cents more than it should be, and you will pay it without complaint.

THE PRETZEL
Soft. Warm. Coarse salt. Served in wax paper. Costs $1.00. Best consumed between the 3rd and 5th innings. The pretzel vendor walks up and down the aisles shouting "PRETZELS!" in a voice that carries over 40,000 people. This is a skill.

THE PEANUTS
Sold in a small bag. Salted. You shell them and drop the shells on the ground. This is the only place in America where dropping food debris on the floor is not just acceptable but expected. The shells crunch underfoot. By the 7th inning, the concrete is covered. This is tradition.

THE CRACKER JACK
"Candy-coated popcorn, peanuts, and a prize." The prize is a small sticker or a temporary tattoo. You will be disappointed by the prize. You will buy Cracker Jack again next time. This is also tradition.

THE BEER
If you're of age. $2.50 for a cup. Served in a paper cup that says "GO [TEAM]" on it. Do not throw it in the air when your team hits a home run. People do this. It does not end well.

TAKE A BREAK AND ENJOY A SOFT PRETZEL.
You're at the ballpark.
This is what it's for.`,
  },
  'fireworks': {
    icon: '🎆', color: '#cc0000',
    title: '🎆 Fireworks Night — Stick Around!',
    body: `FIREWORKS NIGHT — STICK AROUND AFTER THE GAME

Post-game fireworks are one of baseball's most beloved promotions. Tonight's show will be spectacular — set to music, choreographed to patriotic favorites and popular hits.

THE SHOW
The pyrotechnics team sets up along the warning track and beyond the outfield walls. Synchronized to music broadcast through the stadium PA system. The show typically runs 20-25 minutes. Visible throughout the surrounding neighborhoods.

THE MUSIC
The 1984 fireworks program features patriotic favorites (Stars and Stripes Forever, God Bless America), popular songs from the charts, and a few surprises. The finale is timed to coincide with the biggest burst of the evening. If you've never seen a fireworks finale at a ballpark, you are in for a treat.

THE TRADITION
Fireworks nights draw some of the largest crowds of the season. Families stay late. Kids who fell asleep during the 7th inning wake up for the show. The parking lot empties slowly afterward, and nobody minds.

TIPS
• Stay in your seat for the best view
• The show starts approximately 15 minutes after the final out
• Protect your ears if you're sensitive to loud noises
• Don't leave early — the finale is worth the wait

STICK AROUND.
You won't regret it.`,
  },
  'family_night': {
    icon: '👨‍👩‍👧‍👦', color: '#27ae60',
    title: '👨‍👩‍👧‍👦 Family Night — Tuesday Home Games',
    body: `FAMILY NIGHT — EVERY TUESDAY HOME GAME

Four tickets, four hot dogs, four sodas — one low price. Ask at the box office.

THE DEAL
Family Night is the best value in baseball. For one flat price — typically around $20-25 — a family of four gets: four general admission tickets, four hot dogs, four medium sodas. That's the entire evening for less than the cost of taking the family to a movie.

WHY TUESDAY
Tuesday is the slowest day for baseball attendance. Weekday games struggle to draw crowds. Family Night fills the stadium on a night that would otherwise be empty. It's good business and good community relations.

THE ATMOSPHERE
Tuesday Family Nights have a different feel than weekend games. Fewer corporate types. More kids. More strollers. More parents who are just trying to give their kids a good night out without spending $100. The crowd is more relaxed. The energy is family-friendly.

THE HOT DOGS
Included in the package. They are ballpark franks. Your children will eat them. You will eat one too. The mustard is bright yellow and comes in a packet that requires manual tearing.

ASK AT THE BOX OFFICE.
Tuesday night. Bring the family.
Make a memory.`,
  },
  'rubiks': {
    icon: '🟦', color: '#cc0000',
    title: '🟦 The Rubik\'s Cube Craze',
    body: `THE RUBIK'S CUBE — 1984'S BIGGEST PUZZLE

The Rubik's Cube shows no signs of slowing down. Over 100 million cubes have been sold worldwide since 1980. It is the best-selling puzzle toy in history.

THE CUBE
Six sides. Six colors. 43 quintillion possible combinations. One solution. You twist the rows and columns. The colors scramble. You try to get them back. You cannot.

THE HISTORY
Invented in 1974 by Ernő Rubik, a Hungarian architecture professor. He called it the "Magic Cube." It was released internationally in 1980 as the "Rubik's Cube." Within two years, one in every seven people on Earth had touched one.

THE SPEED CUBERS
There are people who can solve the cube in under 30 seconds. The world record in 1984 is 22 seconds. These people have memorized algorithms — sequences of moves that are applied based on the pattern of the cube. There are over 50 standard algorithms. Speed cubers know all of them.

THE FRUSTRATION
Most people get one side. Some people get two sides. Almost nobody gets all six without help. The cube sits on coffee tables, half-solved, mocking its owner. It has ended friendships.

THE SOLUTION BOOK
Patrick Bossert's "You Can Do the Cube" sold 1.5 million copies. It is the best-selling book of 1981. A book about how to solve a toy. This tells you something about 1981.

CAN YOU SOLVE ALL SIX SIDES?
Probably not.
But you'll keep trying.`,
  },
  'bowling': {
    icon: '🎳', color: '#1d4ed8',
    title: '🎳 Bowling Leagues Now Forming',
    body: `NEIGHBORHOOD BOWLING LEAGUES — NOW FORMING

Bowling is America's most participated sport. Over 60 million Americans bowl at least once a year. Leagues are forming at your local lanes right now.

THE LEAGUE
A bowling league meets weekly — usually Tuesday or Wednesday nights. Teams of four. Each team bowls three games. The atmosphere is social. There is beer. There is camaraderie. The stakes are low but the bragging rights are high.

THE SHOES
You must rent bowling shoes. They are ugly. They have two different colors. One sole slides, one grips. This is the only sport where the required footwear is worse than the sport itself. Nobody complains about the shoes. That's part of bowling.

THE BALL
House balls are free. They weigh between 6 and 16 pounds. The finger holes are drilled for average-sized hands. Your hand is not average-sized. You will adapt. Serious bowlers own their own balls, drilled specifically for their fingers. This costs $80-150. You do not need to do this. But you will eventually want to.

THE SCORE
Bowling is one of the few sports where you can mathematically measure your improvement. A beginner scores 80-100. An intermediate scores 120-140. A good league bowler scores 160-180. A perfect game is 300. Nobody you know has bowled a 300. Someone at your local lanes claims they have. They have not.

THE LANES
Your local bowling alley has 24-32 lanes, a snack bar, a bar, and a row of arcade games in the back. The smell is shoe leather, lane oil, and French fries. It is one of the most comforting smells in American life.

JOIN A LEAGUE.
Make friends. Drink beer.
Improve your average.`,
  },
  'board_games': {
    icon: '🎲', color: '#8B4513',
    title: '🎲 Family Game Night',
    body: `FAMILY GAME NIGHT — A GREAT AMERICAN TRADITION

Board games continue to bring families together. In an era of television, VCRs, and video games, the board game endures.

THE CLASSICS
Monopoly: The game that ends friendships. Two to eight players. Average game length: 2-4 hours. Someone always wants to be the banker. The banker always wins. This is suspicious.

Scrabble: The word game. Seven tiles per player. The dictionary is the final authority. Arguments about whether "QI" is a real word will occur. It is. So is "ZA." Nobody knows what they mean.

Risk: World domination. The game takes six hours. Alliances form and break. Betrayal is part of the game. By hour four, someone has flipped the board. This is also tradition.

THE NEW GAMES
Trivial Pursuit: Released in 1984. Six categories of trivia. The most popular party game in America. You will learn that you know less than you thought. Your friend knows more than you expected. This is humbling.

THE EXPERIENCE
Family game night means: the TV is off. The table is cleared. Snacks are served. Someone reads the rules. Nobody listens. Arguments about the rules follow. The rules are re-read. The game begins. It is louder than expected. It is more fun than expected.

BOARD GAMES CONTINUE TO BRING FAMILIES TOGETHER.
The TV can wait.
Roll the dice.`,
  },
  'drive_in': {
    icon: '🎬', color: '#2a2a2a',
    title: '🎬 The Drive-In Theater',
    body: `THE DRIVE-IN THEATER — AN AMERICAN ORIGINAL

Take the family out for an evening at the drive-in. There are fewer than 200 drive-in theaters left in America, down from over 4,000 in 1958. But the ones that remain are worth the trip.

THE EXPERIENCE
You drive in. You find a spot. You pull up to a metal pole that has a speaker on it. You hang the speaker on your car window. You adjust the volume. The sound quality is questionable. You roll down the windows. The kids are in their pajamas in the back seat. The trunk is full of snacks you brought from home.

THE MOVIES
Drive-ins typically show double features — two movies for the price of one. The first is family-friendly. The second is more adult. By the second movie, the kids are asleep. This is the system and it works.

THE CONCESSION STAND
The drive-in concession stand is a time capsule. Popcorn. Candy. Hot dogs. Soda. The prices are reasonable — lower than indoor theaters. The hot dogs are better than they should be.

THE DUSK
Movies start at dusk. In the summer, that's around 8:45 PM. The sky fades from blue to purple to black. The screen lights up. The speaker crackles. The movie begins. It's not the same as an indoor theater. It's better. Or at least, it's different. And different is the point.

WHY THEY'RE DISAPPEARING
Land is worth more as shopping malls and housing developments than as outdoor movie theaters. The drive-in is being paved over. See one while you can.

TAKE THE FAMILY TO THE DRIVE-IN.
Bring blankets.
Bring the kids in pajamas.`,
  },
  'cassette': {
    icon: '🎵', color: '#6a0dad',
    title: '🎵 Cassette Tapes & The Record Store',
    body: `CASSETTE TAPES — MUSIC ON THE GO

Cassette tapes remain a popular way to enjoy music. The record store is the center of musical discovery in 1984.

THE CASSETTE
A plastic shell containing magnetic tape. Two sides. 60 or 90 minutes. You flip it over halfway through. The sound quality is not as good as vinyl. It is better than nothing. It is portable. That is the point.

THE WALKMAN
Sony's Walkman, introduced in 1979, changed how Americans listen to music. A portable cassette player with headphones. You listen to your music, in your ears, while walking down the street. This was not possible before 1979. Now it is everywhere.

THE MIX TAPE
You record songs from the radio onto a blank cassette. You press "record" when the DJ stops talking. You try to avoid the DJ's voice at the beginning and end of songs. You fail. The DJ's voice is on your mix tape. You accept this. You make a cover for the tape with a marker. You give it to someone. This is a declaration of love.

THE RECORD STORE
Your neighborhood record store has bins of LPs, cassettes, and a small section of CDs. The walls are covered in posters. The staff knows more about music than you. They will recommend things. Listen to them.

THE ALBUMS OF 1984
Bruce Springsteen's "Born in the U.S.A." Prince's "Purple Soundtrack." Van Halen's "1984." Huey Lewis and the News. The Cars. Madonna. The soundtrack to Footloose. It is an extraordinary year for music.

DISCOVER THE LATEST MUSIC AT YOUR NEIGHBORHOOD RECORD STORE.
Bring a blank cassette.
Make a mix tape.`,
  },
  'library': {
    icon: '📚', color: '#2a6000',
    title: '📚 Visit Your Local Library',
    body: `YOUR LOCAL LIBRARY — KNOWLEDGE IS FREE

Visit your local library this week. The library card is the most powerful card in your wallet, and it is free.

THE LIBRARY CARD
Free to obtain. Requires proof of address. Gives you access to: books, magazines, newspapers, records, cassettes, and in some libraries, VHS tapes. One card. No fees. This is the best deal in America.

THE BOOKS
Your library has thousands of books. Fiction. Nonfiction. Biographies. Mysteries. Romance. Science fiction. Children's books. Reference materials. Encyclopedias. If they don't have a book, they can request it from another library through interlibrary loan. This takes two weeks. It is worth the wait.

THE ATMOSPHERE
The library is quiet. This is increasingly rare in American life. You can sit and read without interruption. The chairs are not comfortable, but they are not uncomfortable. The lighting is fluorescent. The air smells like paper and binding glue. It is one of the most peaceful places in any town.

THE CHILDREN'S SECTION
Bean bag chairs. Short shelves. Picture books. The librarian knows every book by heart. Story time is Wednesday morning at 10 AM. Your child will sit in a circle and listen. This is how readers are made.

THE LIBRARIAN
The librarian has a master's degree. They know where everything is. They know what you should read next. Ask them. They have been waiting for someone to ask. They will give you three recommendations. One will change your life.

READING CAN OPEN A WORLD OF POSSIBILITIES.
Get a card.
It's free.`,
  },
  'blood_donation': {
    icon: '🩸', color: '#c0392b',
    title: '🩸 Donate Blood — Save a Life',
    body: `DONATE BLOOD — SAVE UP TO THREE LIVES

One pint of blood can help up to three patients. The community blood supply depends on volunteer donors.

THE PROCESS
Registration. Brief health questionnaire. Mini-physical (blood pressure, pulse, iron check). The donation itself takes 8-10 minutes. You're in the chair for about 45 minutes total. Then: juice and cookies.

WHO CAN DONATE
You must be at least 17 years old, weigh at least 110 pounds, and be in good health. You can donate every 56 days. Only 5% of eligible Americans donate blood. The other 95% are needed.

WHY IT MATTERS
Blood cannot be manufactured. Every two seconds, someone in America needs blood. Accident victims. Surgery patients. Cancer patients. People with blood disorders. The blood on the shelf is the blood that saves a life — there is no time to donate after the emergency happens.

THE FEELING
After donating, you sit for 15 minutes. You eat cookies. You drink juice. You feel good — not just physically, but because you did something that matters. Someone you will never meet will receive your blood. They will live because you gave 45 minutes of your afternoon.

DONATE BLOOD.
It's the closest thing to being a superhero that an ordinary person can do.`,
  },
  'fire_dept': {
    icon: '🚒', color: '#cc0000',
    title: '🚒 Support Your Volunteer Fire Department',
    body: `YOUR LOCAL VOLUNTEER FIRE DEPARTMENT — NEIGHBORS HELPING NEIGHBORS

Over 80% of fire departments in America are volunteer or mostly volunteer. These are your neighbors — regular people with regular jobs who respond to emergencies in their spare time.

WHO THEY ARE
Your volunteer firefighter is the person who lives three houses down. They work at the hardware store, or the school, or the factory. When the pager goes off, they leave dinner on the table and go. They train for 100+ hours before they can respond to a fire. They train every month after that.

WHAT THEY DO
Fires. Car accidents. Medical emergencies. Hazardous material spills. Water rescues. Cat rescues (sometimes). They do all of this without pay. They do it because someone has to, and they decided it would be them.

THE COST
Volunteer fire departments operate on shoestring budgets. Fundraisers, bingo nights, and community donations keep the lights on and the trucks running. A new fire truck costs $200,000-400,000. The protective gear for one firefighter costs $3,000. Your support matters.

SUPPORT YOUR LOCAL VOLUNTEER FIRE DEPARTMENT.
They'll be there when you need them.
Be there for them now.`,
  },
  'youngster': {
    icon: '⚾', color: '#27ae60',
    title: '⚾ Take a Youngster to a Ballgame',
    body: 'TAKE A YOUNGSTER TO A BALLGAME THIS SUMMER\n\nBaseball. Hot dogs. Summer. It doesn\'t get much better than this.\n\nTHE FIRST GAME\nA child\'s first baseball game is a milestone. The scale of the stadium. The green of the field. The crack of the bat. The crowd noise. The smell of popcorn and mustard. It\'s overwhelming in the best possible way.\n\nTHE MEMORY\nThey will remember who took them. They will remember the score (approximately). They will remember the hot dog (definitely). They will remember the feeling of being in a crowd of thousands of people all watching the same thing. They will remember the seventh-inning stretch.\n\nTHE LESSON\nBaseball teaches patience. It teaches attention. It teaches that failure is part of the game — the best hitters fail 7 times out of 10. It teaches that summer has a rhythm, and the rhythm is measured in innings.\n\nTAKE A YOUNGSTER TO A BALLGAME.\nMake a memory that lasts a lifetime.\nPass it on.',
  },
  'keep_clean': {
    icon: '🗑️', color: '#27ae60',
    title: '🗑️ Keep America Beautiful',
    body: 'HELP KEEP AMERICA\'S HIGHWAYS CLEAN\n\nThe highway is everyone\'s responsibility. Don\'t litter.\n\nTHE PROBLEM\nAmericans generate 4.3 pounds of trash per person per day. Some of it ends up on the highway. The roadside is not a trash can.\n\nTHE IRONY\nThe "Crying Indian" commercial — Iron Eyes Cody paddling a canoe through a polluted river, a single tear rolling down his cheek — is the most famous public service announcement in American history. It worked. Littering decreased significantly after it aired. But the highways still need help.\n\nTHE SOLUTION\nDon\'t throw trash out the car window. Use the rest area trash cans. Adopt a highway. Report illegal dumping. Teach your kids that the world is not their garbage can.\n\nKEEP AMERICA BEAUTIFUL.\nDon\'t litter.',
  },
  'drunk_driving': {
    icon: '🚗', color: '#555555',
    title: '🚗 Never Drink and Drive',
    body: 'NEVER DRINK AND DRIVE\n\nIn 1984, over 24,000 Americans died in alcohol-related car accidents. This is preventable.\n\nTHE LAW\nThe drinking age is changing. The federal government has tied highway funding to a minimum drinking age of 21. States are complying. This will save lives.\n\nTHE REALITY\nIf you\'ve been drinking, your judgment is impaired. You think you can drive. You cannot. The difference between .08 and .10 blood alcohol content is the difference between a DUI and a vehicular manslaughter charge. The difference between getting home and not getting home.\n\nTHE SOLUTION\nDesignate a driver. Call a cab. Sleep on the couch. Call a friend. Walk. Take the bus. Do anything other than getting behind the wheel.\n\nNEVER DRINK AND DRIVE.\nIt\'s not worth it.\nIt\'s never worth it.',
  },
  'local_theater': {
    icon: '🎬', color: '#8B4513',
    title: '🎬 Support Your Local Movie Theater',
    body: 'SUPPORT YOUR LOCAL MOVIE THEATER\n\nThe neighborhood movie theater is a community institution. In 1984, it faces competition from VCRs and video rental stores. It needs your support.\n\nTHE EXPERIENCE\nThere is nothing like seeing a movie on the big screen. The sound. The darkness. The shared experience of laughing or gasping with 200 strangers. Your living room cannot replicate this.\n\nTHE PRICES\nA movie ticket costs $3.50 in 1984. A large popcorn costs $2.00. A large soda costs $1.75. For under $10, you can have a complete evening out. This is one of the best entertainment values in America.\n\nTHE MOVIES OF 1984\nGhostbusters. Beverly Hills Cop. The Karate Kid. Gremlins. Indiana Jones and the Temple of Doom. Footloose. The Natural. Splash. Romancing the Stone. Star Trek III. It is one of the greatest movie years in recent memory.\n\nSUPPORT YOUR LOCAL MOVIE THEATER.\nGo this weekend.\nThe big screen is better.',
  },
};

// Map of keyword patterns to popup generators
const KEYWORD_PATTERNS = [
  // TV Shows
  { keywords: ['Miami Vice', 'Crockett', 'Tubbs'], data: TV_SHOWS['Miami Vice'] },
  { keywords: ['Magnum P.I', 'Magnum,'], data: TV_SHOWS['Magnum P.I'] },
  { keywords: ['A-Team', 'Mr. T', 'Hannibal'], data: TV_SHOWS['A-Team'] },
  { keywords: ['Cheers', 'everybody knows your name', "Sam"], data: TV_SHOWS['Cheers'] },
  { keywords: ['Night Court', 'Judge Harry', 'Manhattan Criminal Court'], data: TV_SHOWS['Night Court'] },
  { keywords: ['Family Ties', 'Alex', 'Keaton'], data: TV_SHOWS['Family Ties'] },
  { keywords: ['Dynasty', 'Alexis', 'Carrington'], data: TV_SHOWS['Dynasty'] },
  { keywords: ['Dallas', 'Ewing', 'Southfork'], data: TV_SHOWS['Dallas'] },
  // Movies
  { keywords: ['Ghostbusters', "Who ya gonna call"], data: TV_SHOWS['Ghostbusters'] },
  { keywords: ['Beverly Hills Cop', 'Eddie Murphy', 'Axel Foley'], data: TV_SHOWS['Beverly Hills Cop'] },
  { keywords: ['Karate Kid', 'Daniel-san', 'Mr. Miyagi'], data: TV_SHOWS['Karate Kid'] },
  { keywords: ['Gremlins', 'Gizmo', 'feed them after midnight'], data: TV_SHOWS['Gremlins'] },
  { keywords: ['Indiana Jones', 'Temple of Doom'], data: TV_SHOWS['Indiana Jones'] },
  { keywords: ['Star Trek III', 'Search for Spock', 'Spock'], data: TV_SHOWS['Star Trek'] },
  { keywords: ['Footloose', 'Kevin Bacon', 'Everybody cut'], data: TV_SHOWS['Footloose'] },
  // Food
  { keywords: ["McDonald's", 'Quarter Pounder', 'break today', 'Ronald'], data: FAST_FOOD["McDonald's"] },
  { keywords: ['Burger King', 'flame-broiled', 'Whopper', 'have it your way'], data: FAST_FOOD['Burger King'] },
  { keywords: ["Wendy's", "Where's the beef", 'Clara'], data: FAST_FOOD["Wendy's"] },
  // Electronics/Computers
  { keywords: ['Radio Shack', 'Tandy 1000', 'Tandy'], data: COMPUTERS['Radio Shack'] },
  { keywords: ['Commodore 64', 'Commodore'], data: COMPUTERS['Commodore 64'] },
  { keywords: ['Apple IIe', 'Apple II', 'Macintosh'], data: COMPUTERS['Apple'] },
  // Cars
  { keywords: ['Ford Tempo', 'Ford dealer', 'Ford Mustang'], data: CAR_ADS['Ford'] },
  { keywords: ['Chevrolet Cavalier', 'Camaro', 'Corvette', 'Chevrolet invites'], data: CAR_ADS['Chevrolet'] },
  { keywords: ['Chrysler', 'Dodge Caravan', 'Caravan', 'minivan'], data: CAR_ADS['Chrysler'] },
  { keywords: ['Pontiac Fiero', 'Pontiac'], data: CAR_ADS['Pontiac'] },
  // Sodas
  { keywords: ['Coca-Cola', 'Coke is it', 'ice-cold Coca'], data: SODAS['Coca-Cola'] },
  { keywords: ['Pepsi', 'choice of a new generation'], data: SODAS['Pepsi'] },
  // PSA
  { keywords: ['seatbelt', 'buckle', 'wear your seat'], data: GENERAL_PSA_CONTENT['seatbelt'] },
  // VCR / Video Rental
  { keywords: ['vcr', 'video rental', 'renting movies', 'video store'], data: MISC_ADS['vcr'] },
  // Future tech / Computers in every home
  { keywords: ['computer in every home', 'some even predict', 'secretaries', 'learning new technology'], data: MISC_ADS['future_tech'] },
  // Telecommunications / New services
  { keywords: ['new services', 'becoming nationwide', 'nationwide', 'telephone system is changing', 'telecommunications'], data: MISC_ADS['telecom'] },
  // Ballpark food / Pretzel
  { keywords: ['soft pretzel', 'pretzel', 'take a break and enjoy'], data: MISC_ADS['ballpark_food'] },
  // Fireworks Night (generic, not Tiger Stadium)
  { keywords: ['fireworks night', 'fireworks', 'spectacular show set to music'], data: MISC_ADS['fireworks'] },
  // Family Night / Ballpark promotions
  { keywords: ['family night', 'four tickets', 'four hot dogs', 'four sodas'], data: MISC_ADS['family_night'] },
  // Rubik's Cube
  { keywords: ["rubik's cube", 'rubik', 'six sides'], data: MISC_ADS['rubiks'] },
  // Bowling
  { keywords: ['bowling league', 'bowling'], data: MISC_ADS['bowling'] },
  // Board games / Family game night
  { keywords: ['board game', 'family game night', 'games continue to bring families'], data: MISC_ADS['board_games'] },
  // Drive-in theater
  { keywords: ['drive-in', 'drive in'], data: MISC_ADS['drive_in'] },
  // Cassette tapes / Music
  { keywords: ['cassette tape', 'cassette', 'record store', 'neighborhood record'], data: MISC_ADS['cassette'] },
  // Library
  { keywords: ['library', 'reading can open'], data: MISC_ADS['library'] },
  // Blood donation
  { keywords: ['donate blood', 'blood drive'], data: MISC_ADS['blood_donation'] },
  // Volunteer fire department
  { keywords: ['volunteer fire', 'fire department'], data: MISC_ADS['fire_dept'] },
  // Take a youngster to a ballgame
  { keywords: ['youngster', 'take a youngster', "america's pastime"], data: MISC_ADS['youngster'] },
  // Neighborhood / community
  { keywords: ['keep america', 'highways clean', 'litter'], data: MISC_ADS['keep_clean'] },
  // Never drink and drive
  { keywords: ['drink and drive', 'never drink'], data: MISC_ADS['drunk_driving'] },
  // Support local movie theater
  { keywords: ['local movie theater', 'support your local movie'], data: MISC_ADS['local_theater'] },
  // Phil Rizzuto / broadcaster greeting from New Jersey
  { keywords: ['phil says hello', 'listening from new jersey', 'says hello to everyone'], data: {
    icon: '🎙️', color: '#003087',
    title: '🎙️ Phil Says Hello',
    body: `PHIL RIZZUTO — HELLO FROM THE BOOTH

"Phil says hello to everyone listening from New Jersey."

THE SCOOTER
Phil Rizzuto. Yankees shortstop, 1941-1956. American League MVP, 1950. Hall of Famer. And since 1957, the voice of the Yankees — the most beloved, most chaotic, most endearing broadcaster in the history of baseball.

THE BROADCAST
Phil doesn't just call the game. He talks to the audience. He wishes people happy birthday. He mentions listeners by name — "Hello to everyone in Paramus!" He talks about what he had for dinner. He worries about the traffic on the George Washington Bridge. He gets excited about a good play and forgets what inning it is.

THE NEW JERSEY CONNECTION
A huge portion of the Yankees' radio audience lives in New Jersey. They tune in from Newark, from Paramus, from Cherry Hill, from Trenton. They listen on the drive home. They listen on the back porch. They listen with their fathers and their grandfathers. The radio is on. Phil is talking. Baseball is being played. This is summer.

THE CATCHPHRASE
"Holy cow!" — Phil's exclamation for everything. A home run? Holy cow! A great play? Holy cow! A dropped pop-up? Holy cow! It is the most versatile phrase in broadcasting.

PHIL SAYS HELLO.
To everyone listening from New Jersey.
To everyone listening everywhere.
Holy cow, what a game.`,
  }},
  // Salvation Army / charity donation
  { keywords: ['salvation army', 'thanks you for your continued support', 'donations help families'], data: {
    icon: '🔔', color: '#cc0000',
    title: '🔔 The Salvation Army',
    body: `THE SALVATION ARMY — THANK YOU

"The Salvation Army thanks you for your continued support. Your donations help families in need in our community."

THE ORGANIZATION
The Salvation Army. Founded in London in 1865 by William Booth. Arrived in America in 1880. By 1984, it is one of the largest charitable organizations in the United States, serving over 3 million people annually through thrift stores, shelters, food pantries, and disaster relief.

THE RED KETTLE
The iconic red kettle and bell ringer. You see them outside every grocery store and department store during the holidays. The kettles collect millions of dollars in spare change every year. That spare change funds soup kitchens, homeless shelters, and after-school programs.

THE THRIFT STORES
Salvation Army thrift stores sell donated clothing, furniture, and household goods at affordable prices. The proceeds fund adult rehabilitation centers. The stores also provide affordable goods to families who need them. Your donations — the coat you outgrew, the toaster you replaced — become someone else's necessity.

THE COMMUNITY
In 1984, the Salvation Army operates in every major American city. They run homeless shelters. They run food pantries. They run summer camps for underprivileged kids. They show up after natural disasters. They don't ask questions. They help.

THE THANK YOU
Your continued support matters. The coat you donate keeps someone warm. The dollar you drop in the kettle becomes a meal. The furniture you give furnishes an apartment for a family starting over.

THE SALVATION ARMY THANKS YOU.
Your donations help families in need.
In our community.`,
  }},
  // Free concerts in city parks
  { keywords: ['free concerts', 'city parks', 'concerts in city parks', 'free concerts in city'], data: {
    icon: '🎵', color: '#27ae60',
    title: '🎵 Free Concerts in City Parks',
    body: `FREE CONCERTS IN CITY PARKS — ALL SUMMER LONG

"Enjoy free concerts in city parks throughout the summer."

THE SERIES
Every summer, cities across America transform their parks into concert venues. Free. Open to all. Bring a blanket. Bring a picnic. Bring the family. The music starts at dusk.

THE MUSIC
The 1984 summer concert series features a little of everything: jazz ensembles, concert bands, string quartets, folk singers, brass quintets. The city parks department hires local musicians and touring acts alike. Some nights it's a big band playing Glenn Miller arrangements. Some nights it's a folk singer with a guitar. Every night is different. Every night is free.

THE PARK
The park becomes a different place at concert time. The lawn fills with blankets and folding chairs. Kids run around the edges. The ice cream truck does exceptional business. The sun sets behind the trees. The stage lights come up. The music begins.

THE TRADITION
Free concerts in parks are an American tradition dating back to the bandshell era of the early 1900s. John Philip Sousa toured the country playing free concerts in parks. Cities built bandshells. Communities gathered. The tradition continues. The music is different now, but the feeling is the same.

THE PRICE
Free. That's the best price in entertainment. No tickets. No lines. No reserved seating. First come, first served on the best blanket spots. The only cost is showing up.

ENJOY FREE CONCERTS IN CITY PARKS.
Throughout the summer.
Bring a blanket.`,
  }},
  // Hayden Planetarium
  { keywords: ['hayden planetarium', 'learn about the universe', 'planetarium'], data: {
    icon: '🔭', color: '#4a0080',
    title: '🔭 The Hayden Planetarium',
    body: `THE HAYDEN PLANETARIUM — NEW YORK CITY

"Learn about the universe at the Hayden Planetarium."

THE PLANETARIUM
The Hayden Planetarium. Part of the American Museum of Natural History. Central Park West at 81st Street, New York City. Opened in 1935. By 1984, it has introduced millions of New Yorkers to the wonders of the cosmos.

THE DOME
The planetarium's dome is 75 feet in diameter. When the lights go down, the dome becomes the night sky. Stars. Planets. Constellations. Galaxies. The Milky Way stretches overhead. The universe, projected onto a plaster ceiling.

THE SHOW
You sit in a reclining seat. The lights dim. The star projector — a massive dumbbell-shaped instrument in the center of the room — begins to spin. The sky appears. A narrator guides you through the cosmos. You learn about Orion. About Polaris. About the phases of the moon. About light-years and parsecs and the scale of the universe.

THE UNIVERSE
The universe is large. The planetarium helps you understand how large. The closest star is 4.3 light-years away. The closest galaxy is 2.2 million light-years away. The observable universe is 13 billion light-years across. These numbers are meaningless until you see them projected on a 75-foot dome. Then they are awe-inspiring.

THE MISSION
The Hayden Planetarium exists to educate. To inspire. To remind you that the Earth is a small planet orbiting an average star in an ordinary galaxy in an unimaginably vast universe. This is humbling. It is also thrilling.

LEARN ABOUT THE UNIVERSE.
At the Hayden Planetarium.
Central Park West at 81st Street.`,
  }},
  // Kiwanis charity golf tournament
  { keywords: ['kiwanis', 'charity golf', 'golf tournament'], data: {
    icon: '⛳', color: '#27ae60',
    title: '⛳ Kiwanis Charity Golf Tournament',
    body: `KIWANIS CHARITY GOLF TOURNAMENT

"Kiwanis Charity Golf Tournament — supporting local youth programs."

THE ORGANIZATION
Kiwanis International. Founded in 1915 in Detroit. A service organization of volunteers dedicated to improving the world, one child and one community at a time. By 1984, there are over 8,000 Kiwanis clubs in 70+ countries. They meet weekly. They eat breakfast or lunch. They raise money. They help kids.

THE TOURNAMENT
The charity golf tournament is a Kiwanis staple. Local business leaders, civic figures, and community members form foursomes. They pay an entry fee. They play 18 holes. The entry fees and sponsorships fund youth programs — Little League, Boys & Girls Clubs, scout troops, scholarship funds.

THE GOLF
It's not the PGA Tour. The golf is... varied. Some players are excellent. Some players are there for the buffet. Foursomes compete for prizes — longest drive, closest to the pin, lowest score. The real competition is usually for the worst score, which comes with a trophy and a gentle ribbing.

THE FORMAT
Typically a scramble format: all four players tee off, the team picks the best shot, everyone plays from there. This means even the worst golfer on your team can contribute. This is the entire point of the scramble.

THE CAUSE
The money raised stays in the community. It sends kids to camp. It buys uniforms for youth sports. It funds college scholarships. It buys playground equipment. It helps local families in need.

THE BREAKFAST
Kiwanis meetings start with breakfast. Pancakes, eggs, sausage, coffee. The golf tournament includes lunch at the turn and dinner afterward. The food is always good. The company is always better.

KIWANIS CHARITY GOLF TOURNAMENT.
Supporting local youth programs.
Fore!`,
  }},
  // Souvenir yearbook / Royals yearbook
  { keywords: ['souvenir stands', 'official 1984', 'yearbook', 'royals yearbook'], data: {
    icon: '📖', color: '#004687',
    title: '📖 Official 1984 Yearbook',
    body: `OFFICIAL 1984 TEAM YEARBOOK

"Stop by souvenir stands for your official 1984 Royals yearbook."

THE YEARBOOK
The official team yearbook. A staple of the ballpark souvenir stand. Full color. 64 pages. Roster profiles. Action photos. Stadium history. Manager's column. Schedule. Stats. It is the definitive guide to this year's team.

THE CONTENTS
Player profiles: Every player on the roster gets a page. Photo, biographical info, career stats, and a quote from the player or manager. "George Brett: 'I just want to hit .300 and drive in 100 runs. The rest takes care of itself.'"

The manager's column: A short essay by the skipper about the season so far. It is always optimistic. Even when the team is in last place.

The stadium section: A guide to the ballpark — how to get there, where to park, where to eat, where the restrooms are. Useful for first-timers.

The prospect report: A look at the minor league system. "Coming soon to a ballpark near you." Sometimes these prospects pan out. Sometimes they don't. The yearbook is always optimistic.

THE PRICE
$3.00-$5.00 depending on the team. A bargain. It will sit on your coffee table all season. You will flip through it during rain delays. You will show it to friends. Years from now, you'll find it in a box in the attic and remember this season.

THE SOUVENIR STAND
Located on the concourse. Caps, jerseys, pennants, foam fingers, programs, and the yearbook. The souvenir stand is the most dangerous place in the ballpark for your wallet. Everything looks better when you're at the game.

STOP BY THE SOUVENIR STANDS.
Get your official 1984 yearbook.
A souvenir that lasts.`,
  }},
  // Starlight Theatre
  { keywords: ['starlight theatre', 'summer evening', 'starlight'], data: {
    icon: '🎭', color: '#4a0080',
    title: '🎭 Starlight Theatre',
    body: `STARLIGHT THEATRE — KANSAS CITY

"Spend a summer evening at Starlight Theatre."

THE VENUE
Starlight Theatre. Swope Park, Kansas City, Missouri. The largest outdoor theatre in the United States. Opened in 1951. By 1984, it is a Kansas City institution — a place where the stars come out both on stage and overhead.

THE EXPERIENCE
Outdoor theatre is a different experience. The sky is your ceiling. The breeze is your air conditioning. The stars come out as the sun goes down. You bring a light jacket. You sit in the open-air auditorium. The show begins at 8:30 PM. By intermission, it's dark and the stage lights illuminate the performers against the night sky.

THE SHOWS
Starlight Theatre hosts touring Broadway productions, concerts, and special events. In 1984, the season might include a touring production of "A Chorus Line," a Kenny Rogers concert, or a night of the Kansas City Symphony. The variety is the point.

THE PICNIC
Many patrons tailgate before the show. This is a Starlight tradition. You arrive early. You set up a spread in the parking lot. Wine, cheese, sandwiches, fruit. The tailgate is half the experience. The show is the other half.

THE SOUND
The acoustics of an outdoor theatre are unique. The sound carries differently in open air. On a still night, the music floats. On a breezy night, you sit closer. Rain is always a possibility. The show goes on unless it's a downpour.

SPEND A SUMMER EVENING AT STARLIGHT THEATRE.
Swope Park, Kansas City.
Under the stars.`,
  }},
  // Youth baseball heartland
  { keywords: ['youth baseball strong', 'heartland', 'baseball strong'], data: {
    icon: '⚾', color: '#27ae60',
    title: '⚾ Keep Youth Baseball Strong',
    body: `KEEP YOUTH BASEBALL STRONG — IN THE HEARTLAND

"Help keep youth baseball strong in the heartland."

THE HEARTLAND
The American heartland. The Midwest. The Great Plains. Where baseball isn't just a sport — it's a way of life. In small towns across Kansas, Missouri, Iowa, Nebraska, and the surrounding states, baseball is played on diamonds carved from farmland. The lights come on at dusk. The kids take the field. The community watches.

THE PROGRAMS
Youth baseball in the heartland depends on community support. Little Leagues. American Legion teams. Babe Ruth leagues. High school programs. None of them survive on ticket sales. They survive on volunteers. On sponsorships from local businesses. On the $20 registration fee and the parent who volunteers to coach.

THE DIAMOND
Every small town has a baseball diamond. Sometimes it's the best-maintained piece of property in town. The infield is raked. The grass is cut. The backstop is patched. The bleachers are old but sturdy. The concession stand sells popcorn and soda for fifty cents. This is where kids learn the game.

THE COACHES
The coaches are volunteers. Dads. Moms. Grandpas. Former players. People who love the game and want to pass it on. They show up at 5 PM for practice. They hit ground balls until their arms hurt. They teach kids how to catch, how to throw, how to hit, how to lose with dignity and win with grace. They do this for free.

THE LESSON
Baseball teaches things you can't learn in a classroom. Teamwork. Patience. How to fail and try again. How to support a teammate. How to shake hands after a loss. These lessons carry into adulthood.

HELP KEEP YOUTH BASEBALL STRONG.
In the heartland.
In every town with a diamond and a dream.`,
  }},
  // Mall food court
  { keywords: ['food court', 'hungry shoppers', 'open and waiting for hungry'], data: {
    icon: '🍴', color: '#cc8800',
    title: '🍴 The Food Court',
    body: `THE FOOD COURT — OPEN AND WAITING

"The food court is open and waiting for hungry shoppers."

THE MALL
In 1984, the shopping mall is the center of American suburban life. It is where teenagers hang out. Where families spend Saturday. Where you go to buy clothes, electronics, books, records, and food. So much food.

THE FOOD COURT
The food court is the heart of the mall. A central seating area surrounded by a dozen different food vendors. Orange Julius. Sbarro. Panda Express. Chick-fil-A. Taco Bell. McDonald's. Auntie Anne's. Orange Julius. (You go to Orange Julius twice. This is normal.)

THE OPTIONS
Pizza by the slice. Egg rolls. Tacos. Burgers. Pretzels. Smoothies. Ice cream. Chinese food. Italian food. Mexican food. American food. The food court has it all. The quality ranges from "surprisingly good" to "I've made a mistake." The price is always right.

THE SMELL
The food court smells like everything at once. Grease. Cinnamon. Coffee. Teriyaki. It is overwhelming. It is wonderful. Your stomach growls before you've even decided what to eat.

THE STRATEGY
The food court requires strategy. Do you commit to one vendor, or do you graze? A slice of Sbarro here. A pretzel from Auntie Anne's there. An Orange Julius to wash it down. The grazer's approach is superior. This is a hill worth dying on.

THE SOCIAL ASPECT
The food court is where you meet your friends. You sit at a table. You share fries. You talk. You people-watch. The food court is the mall's living room. It is where the social fabric of suburban America is woven, one tray at a time.

THE FOOD COURT IS OPEN.
And waiting for hungry shoppers.
Grab a tray.`,
  }},
  // Tourism / Global visitors
  { keywords: ['visitors continue to arrive', 'every corner of the globe', 'corner of the globe', 'visitors from every'], data: {
    icon: '🌍', color: '#003087',
    title: '🌍 Visitors From Every Corner of the Globe',
    body: `VISITORS FROM EVERY CORNER OF THE GLOBE

"Visitors continue to arrive from every corner of the globe."

THE WORLD IN 1984
It is 1984, and the world is shrinking. Jumbo jets crisscross the oceans. The Summer Olympics in Los Angeles brought athletes from 140 nations. The World's Fair in New Orleans celebrates international commerce. And baseball — America's game — draws visitors from Tokyo, from Toronto, from Santo Domingo, from Seoul.

THE BALLPARK AS MELTING POT
Walk through the turnstiles at any major league park and you'll hear a dozen languages. Japanese tourists with cameras. Canadian families on holiday. Dominican fans cheering for their compatriots. European visitors discovering a sport they've only read about.

THE OLYMPICS EFFECT
The '84 Olympics proved that Los Angeles — and America — could welcome the world. The Games were a commercial success, a sporting success, and a cultural exchange. Visitors who came for the Olympics stayed to see the country. Many found their way to a baseball game.

THE UNIVERSAL LANGUAGE
Baseball doesn't need translation. The crack of the bat. The roar of the crowd. The seventh-inning stretch. These are understood in every language.

VISITORS CONTINUE TO ARRIVE.
From every corner of the globe.
To watch the great American pastime.`,
  }},
  // Atari / Home video games
  { keywords: ['atari', 'atari baseball', 'play anytime', 'bring home atari'], data: {
    icon: '🎮', color: '#cc0000',
    title: '🎮 Atari — Bring the Arcade Home',
    body: `ATARI — BRING THE ARCADE HOME

"Bring home Atari baseball and play anytime."

THE COMPANY
Atari. The name that launched the video game industry. Founded in 1972 by Nolan Bushnell. Pong — the first commercially successful arcade game — was just the beginning. By 1984, Atari is a cultural force, a household name, and the reason "video game" is in the dictionary.

ATARI BASEBALL
Atari Baseball. Released in 1983 for the Atari 2600. Two players. Nine innings. Stick figures on a green field. The pitcher selects pitch type and location. The batter swings. The ball flies — sometimes fair, sometimes foul. It is rudimentary. It is revolutionary. It is baseball in your living room.

THE 2600
The Atari 2600, released in 1977, put arcade-quality gaming in the home for the first time. The console cost $199. Games came on cartridges. You collected them. By 1984, over 30 million 2600s are in American homes.

THE INTELLIVISION RIVALRY
Atari's chief rival is Mattel's Intellivision, launched in 1979. Intellivision Baseball features more detailed graphics and statistics than Atari's version. The debate over which system has the better baseball game is fierce and unresolved.

THE LEGACY
Atari showed America that sports could be simulated at home. Every baseball video game since — from RBI Baseball to MLB The Show — traces its lineage back to those blocky stick figures on a green field in 1983.

BRING HOME ATARI.
Play anytime.
The arcade is in your living room.`,
  }},
  // Little League / Youth baseball registration
  { keywords: ['little league', 'sign up now for little league', 'camps across', 'sign up now for'], data: {
    icon: '⚾', color: '#27ae60',
    title: '⚾ Little League — Sign Up Today',
    body: `LITTLE LEAGUE BASEBALL — SIGN UP TODAY

"Sign up now for Little League camps across the metropolitan area."

THE ORGANIZATION
Little League Baseball. Founded in 1939 by Carl Stotz in Williamsport, Pennsylvania. Three teams. A small diamond in a vacant lot. By 1984, Little League has grown to over 2.5 million participants in more than 30 countries.

THE WORLD SERIES
The Little League World Series, held every August in Williamsport, is broadcast on national television. Kids from around the world compete on the same field where it all began. The championship game draws millions of viewers. These are 12-year-olds.

THE SIGN-UP
Registration opens in spring. Boys and girls, ages 8-12, are eligible. Tryouts determine team placement. The fee is nominal — typically $20-30 — and covers a uniform, a cap, and a spot on a roster.

THE METROPOLITAN AREA
Across New York, New Jersey, and Connecticut, dozens of Little League chapters are accepting registrations. Check with your local parks department. Bring a birth certificate. Bring a glove. Bring your kid.

THE LESSON
Little League teaches more than baseball. It teaches teamwork. It teaches how to lose with dignity and win with grace. It teaches that the best part of the game is the post-game snack.

SIGN UP NOW.
Camps are forming across the metropolitan area.
Your child will thank you.`,
  }},
  // Broadcast return / "Back to baseball"
  { keywords: ['back to baseball', 'back to baseball from new york', 'now, back to baseball'], data: {
    icon: '📺', color: '#d4a373',
    title: '📺 And Now, Back to Baseball',
    body: `AND NOW, BACK TO BASEBALL

"And now, back to baseball from New York City."

THE BROADCAST
It's the 1980s. The commercial break is over. The voice of the announcer returns. The picture fades up from black. The ballpark. The green field. The crack of the bat. You're back.

THE VOICES
In New York, the voices are legendary. Phil Rizzuto — "Holy cow!" — calling the game with enthusiasm that borders on chaos. Bill White — steady, professional, the perfect foil. Frank Messer — the third man in the booth, keeping things on track.

Across the country, every team has its voice. Vin Scully in Los Angeles. Harry Caray in Chicago. Jack Buck in St. Louis. Ernie Harwell in Detroit. These men are not just announcers. They are the sound of summer.

THE SPONSOR
"And now, back to baseball..." is more than a transition. It's a promise. The sponsor paid for the broadcast. In exchange, they get your attention during the breaks. And when the breaks end, you get the game. This is the deal.

THE GAME
The pitcher checks the runner. The batter digs in. The crowd hums. The first pitch after the break is always the best pitch — you've been waiting for it.

AND NOW, BACK TO BASEBALL.
From New York City.
From wherever the game is being played.
To your living room.`,
  }},
  // Youth baseball clinics
  { keywords: ['youth baseball clinics', 'baseball clinics', 'clinics continue', 'clinics throughout'], data: {
    icon: '⚾', color: '#27ae60',
    title: '⚾ Youth Baseball Clinics',
    body: `YOUTH BASEBALL CLINICS — CONTINUING THIS SUMMER

"Youth baseball clinics continue throughout New York this summer."

THE CLINICS
All across the New York metropolitan area, youth baseball clinics are in full swing. Former players. College coaches. Local legends. They're teaching the fundamentals to the next generation.

WHAT THEY TEACH
Hitting: The stance. The grip. The stride. The swing. "Keep your eye on the ball" is easy to say and hard to do. The instructors know the difference.

Fielding: The ready position. The two-hand approach. The footwork around the bag. "Catch the ball first, then worry about the runner."

Pitching: The windup. The stretch. The follow-through. "Throw, don't aim." The clinics teach mechanics that prevent injuries — something that wasn't understood a generation ago.

Baseball IQ: When to steal. When to take a pitch. When to swing away. The mental game is half the battle.

THE INSTRUCTORS
Many clinics feature appearances by current or former major leaguers. Imagine learning to hit from someone who hit .300 in the big leagues. The kids don't fully understand how rare that is. The parents do.

THE COST
Most clinics are affordable — $25-50 for a full day, or $100-150 for a week-long session. Some are free, sponsored by local businesses or the teams themselves.

THE IMPACT
A kid who attends a baseball clinic in 1984 might become a high school star. Might play in college. Might make the majors. Or might just carry the memory of a summer afternoon on a baseball diamond for the rest of their life.

CLINICS CONTINUE THROUGHOUT THE SUMMER.
Sign up at your local park district.
The next great ballplayer is out there.`,
  }},
  // Technology never stops
  { keywords: ['technology never stops', 'technology never stops advancing', 'never stops advancing'], data: {
    icon: '💡', color: '#4a0080',
    title: '💡 Technology Never Stops Advancing',
    body: `TECHNOLOGY NEVER STOPS ADVANCING

"Technology never stops advancing."

THE STATE OF THE ART
It is 1984, and technology is everywhere. The personal computer. The VCR. The compact disc. The cellular phone. The microwave. The fax machine. Each one has changed how Americans live, work, and play.

THE PERSONAL COMPUTER
8% of American households own a personal computer. The Apple Macintosh was introduced in January 1984 with a single Super Bowl commercial. IBM PCs dominate the office. The Commodore 64 is the best-selling computer in the world. And every one of them has less computing power than the calculator in your desk drawer.

THE VCR
The VCR has transformed television. Time-shifting — recording a show to watch later — was impossible five years ago. Now it's a way of life. 15% of American households own a VCR. The number is growing rapidly.

THE COMPACT DISC
The CD was introduced in 1982. By 1984, CD players are in hi-fi stores, and the sound quality is unmistakable — no hiss, no pops, no wear. A CD holds 74 minutes of music on a disc the size of a coaster. Audiophiles are ecstatic.

THE CELLULAR PHONE
The Motorola DynaTAC. It weighs 2.5 pounds. It costs $3,995. It provides 30 minutes of talk time. It is the size of a brick. And it is the future.

THE FAX MACHINE
The fax machine is appearing in offices across America. A document placed in one machine comes out of another machine across the country in minutes. This seems like magic. It is not magic. It is telephone lines and thermal paper.

TECHNOLOGY NEVER STOPS ADVANCING.
Neither should you.
The future is arriving daily.`,
  }},
  // Guggenheim Museum
  { keywords: ['guggenheim', 'guggenheim museum', 'unique architecture'], data: {
    icon: '🏛️', color: '#8B4513',
    title: '🏛️ The Guggenheim Museum',
    body: `THE GUGGENHEIM MUSEUM — NEW YORK CITY

"Visit the Guggenheim Museum and enjoy its unique architecture."

THE BUILDING
The Solomon R. Guggenheim Museum. 1071 Fifth Avenue, New York City. Designed by Frank Lloyd Wright. Completed in 1959, six months after Wright's death. It is the only Frank Lloyd Wright building in New York City, and it is his masterpiece.

THE SHAPE
The Guggenheim is a spiral. You enter at the bottom. You take the elevator to the top. You walk down. The ramp curves gently downward, and the art is displayed along the way. There are no separate rooms. There is no floor plan. There is only the spiral.

THE CONTROVERSY
When Wright's design was unveiled, critics were divided. Some called it a masterpiece. Others called it a washing machine. The residents of Fifth Avenue sued to stop construction. They lost. The building went up anyway. It has been a landmark ever since.

THE ART
The Guggenheim's collection includes works by Kandinsky, Picasso, Chagall, Mondrian, and Van Gogh. The rotating exhibitions bring art from around the world. The building is as much an attraction as the art inside it.

THE EXPERIENCE
Walking the spiral is unlike any other museum visit. The curve of the wall, the natural light from the skylight above, the gradual descent — it is an experience that cannot be replicated. Wright designed it this way intentionally. He wanted you to feel the space before you looked at the art.

VISIT THE GUGGENHEIM MUSEUM.
1071 Fifth Avenue, New York City.
Frank Lloyd Wright's gift to the city.`,
  }},
  // Fire department open house
  { keywords: ['fire department', 'fire safety', 'see the trucks', 'meet the firefighters', 'open house this sunday'], data: {
    icon: '🚒', color: '#cc3300',
    title: '🚒 Fire Department Open House',
    body: `FIRE DEPARTMENT OPEN HOUSE — THIS SUNDAY

"The local fire department is hosting an open house this Sunday. Bring the kids to see the trucks, meet the firefighters, and learn about fire safety."

THE FIREHOUSE
The firehouse is the heart of every neighborhood. The big red doors. The pole. The trucks gleaming in the bay. The boots lined up beneath the coats. The smell of diesel and coffee. This Sunday, those doors are open to you.

THE TRUCKS
The fire engine. The ladder truck. The ambulance. Kids can sit in the driver's seat. They can honk the horn. They can see the lights flash. The hose. The axes. The jaws of life. The equipment that firefighters carry into burning buildings. It is impressive. It is heavy. It is real.

THE FIREFIGHTERS
The men and women who run into buildings that everyone else is running out of. They'll shake your hand. They'll put a helmet on your kid's head. They'll let them hold the hose (with help). They'll answer every question. "How fast does the truck go?" "Have you ever been in a fire?" "Is it scary?" Yes. It's scary. They go anyway.

THE SAFETY LESSON
Stop, drop, and roll. That's the first thing every kid learns. Then: don't play with matches. Then: have a meeting place outside if there's a fire. Then: check your smoke detector batteries. These lessons save lives. The fire department teaches them because they'd rather prevent fires than fight them.

THE DIAL
9-1-1. Three numbers. Every kid should know them. Every adult should know them. The open house is a chance to reinforce it: if there's an emergency, call 9-1-1. The firefighters will come.

BRING THE KIDS.
This Sunday.
The firehouse doors are open.`,
  }},
  // Royals Baseball Camp
  { keywords: ['baseball camp', 'registration is now open', 'royals baseball camp', 'ages 8 through 14', 'baseball camp registration'], data: {
    icon: '⚾', color: '#004687',
    title: '⚾ Royals Baseball Camp',
    body: `ROYALS BASEBALL CAMP — REGISTRATION NOW OPEN

"Royals Baseball Camp registration is now open for ages 8 through 14."

THE CAMP
Royals Baseball Camp. One week. Every morning. At the stadium or at a local diamond. Kids ages 8-14 learn the game from instructors who know it — minor league coaches, former players, Royals organization staff. The registration fee includes a camp t-shirt, a Royals hat, and a ticket to a game.

THE INSTRUCTION
Hitting: stance, grip, swing mechanics, timing. The tee work. The soft toss. The batting cage. Every kid gets swings.
Fielding: ground balls, fly balls, footwork, the proper way to receive and transfer. Infield play. Outfield play.
Pitching: mechanics, balance, follow-through. NOT velocity — mechanics. Kids shouldn't be throwing curves at 12.
Baserunning: how to take a lead, how to slide, how to read the pitcher.

THE PHILOSOPHY
The camp isn't about producing major leaguers. It's about teaching fundamentals, fostering a love of the game, and making sure kids have fun. The instructors know that most of these kids will never play past high school. That's fine. Baseball is a game for life — you can play catch at 50.

THE GUEST
Sometimes a Royals player stops by. It's not guaranteed, but it happens. A kid gets to meet George Brett or Frank White. They sign an autograph. They say "work hard." The kid remembers it forever.

THE COST
$75-$125 for the week. Financial assistance is available. No kid is turned away for inability to pay. The Royals organization sponsors this. It's an investment in the community.

REGISTRATION IS NOW OPEN.
Ages 8-14.
Play ball.`,
  }},
  // United Way
  { keywords: ['united way', 'contributions make a difference', "haven't given yet", "there's still time", 'united way reminds'], data: {
    icon: '🤝', color: '#1a5276',
    title: '🤝 United Way',
    body: `UNITED WAY — YOUR CONTRIBUTIONS MAKE A DIFFERENCE

"United Way reminds you that your contributions make a difference in our community. If you haven't given yet, there's still time."

THE ORGANIZATION
United Way. Founded in 1887 in Denver. By 1984, it is the largest private charity in America, raising over $1 billion annually through workplace campaigns. You know the campaign — the envelope in your mailbox at work. The pledge card. The payroll deduction. The option to give a little from each paycheck. It adds up.

THE MODEL
United Way doesn't run programs directly. It raises money and distributes it to local partner agencies — the YMCA, the Boy Scouts, the Girl Scouts, the Salvation Army, local shelters, food banks, after-school programs, crisis hotlines. One donation helps dozens of organizations. This is the efficiency of the model.

THE WORKPLACE CAMPAIGN
The United Way campaign at your office. Your manager hands out pledge cards. There's a presentation. Someone from a partner agency speaks about how United Way funding helped a family. Then you decide: give $5 a paycheck? $10? $20? It comes out before taxes. You don't miss it. It helps someone you'll never meet.

THE IMPACT
Your contribution becomes a hot meal for a senior. A safe place for a kid after school. A bed for a homeless family. Counseling for someone in crisis. Job training for someone trying to get back on their feet. The money stays in your community. It helps your neighbors.

THE TIME
"If you haven't given yet, there's still time." The campaign runs through the end of the month. The pledge card is on your desk. Fill it out. Return it. It takes two minutes. Those two minutes change lives.

YOUR CONTRIBUTIONS MAKE A DIFFERENCE.
In our community.
There's still time.`,
  }},
  // Union Station (Kansas City)
  { keywords: ['union station', 'beaux-arts', 'grand architecture', 'historic union station'], data: {
    icon: '🏛️', color: '#8B4513',
    title: '🏛️ Union Station',
    body: `UNION STATION — KANSAS CITY

"Visit historic Union Station and experience the grand Beaux-Arts architecture."

THE BUILDING
Union Station. Kansas City, Missouri. Opened in 1914. Beaux-Arts style. The grandest building in Kansas City. When it opened, it was the second-busiest train station in the United States, behind only Grand Central Terminal in New York.

THE ARCHITECTURE
Beaux-Arts. The style of the École des Beaux-Arts in Paris. Symmetrical. Ornate. Grand. You see it in the soaring ceilings, the arched windows, the carved stone, the chandeliers. The Grand Hall is 95 feet high. The waiting room could hold 10,000 people. This was a building designed to impress. It does.

THE ERA
In 1914, the train was how America traveled. Kansas City was a rail hub — the intersection of twelve rail lines. Millions of passengers passed through Union Station every year. Soldiers going to war. Families on vacation. Businessmen heading to meetings. The train was the artery of the nation, and Union Station was the heart.

THE DECLINE
By the 1970s, the automobile and the airplane had killed the passenger train. Union Station was empty. The paint peeled. The chandeliers gathered dust. The grand hall echoed. There was talk of demolition. Kansas City wouldn't allow it. The building was too important. Too beautiful.

THE REVIVAL
In 1984, Union Station stands as a monument to a bygone era. The building is aging but intact. Plans are being discussed — restoration, a science museum, a new life. The trains still stop here, though far fewer than before. The grandeur remains.

VISIT HISTORIC UNION STATION.
Experience the grand Beaux-Arts architecture.
30 West Pershing Road, Kansas City.`,
  }},
  // Record stores
  { keywords: ['record stores', 'record store', 'special promotions', 'vinyl', 'lp records'], data: {
    icon: '🎵', color: '#9b59b6',
    title: '🎵 Record Stores',
    body: `RECORD STORES — SPECIAL PROMOTIONS THIS WEEK

"Record stores are featuring special promotions this week."

THE RECORD STORE
In 1984, the record store is a cultural institution. It's where you go to buy music. It's where you go to DISCOVER music. The fluorescent lights. The bins of vinyl. The posters on the wall. The headphones at the listening station. The clerk who knows every album ever made. The record store is a place of worship for music fans.

THE FORMAT
The LP. 12 inches. 33 ⅓ RPM. Cardboard sleeve. Gatefold cover. Liner notes. Lyrics printed on the inner sleeve. The LP is an object. You hold it. You look at the cover art. You read the credits. You place it on the turntable. You lower the needle. The crackle. The music. This is an experience that cannot be replicated.

THE PROMOTIONS
This week: select LPs at reduced prices. Buy 2, get 1 free. Import pressings on sale. Cassette tapes discounted. The cutout bin — records with a notch cut in the corner, marked down to $3.99. The cutout bin is where you find the hidden gems. The albums you've never heard of. The albums that change your life.

THE DISCOVERY
The record store is about discovery. You came in for the new Springsteen. You leave with Springsteen AND a Talking Heads album you've never heard AND a jazz record the clerk recommended AND something from the cutout bin that looked interesting. The record store is an adventure.

THE CLERK
The record store clerk. A music encyclopedia in a denim jacket. Ask them anything. "What's the best Bowie album?" "Who sounds like The Police?" "What did this band do before this record?" They know. They have opinions. They will tell you. You should listen.

THE FUTURE
The compact disc is here. CD players are in the store. The sound is cleaner. But the LP persists. The format has weight, warmth, character. The record store will survive — for now.

VISIT YOUR LOCAL RECORD STORE.
Special promotions this week.
Support the music.`,
  }},
  // Sony electronics
  { keywords: ['sony electronics', 'sony', 'lead the way in innovation', 'electronics continue to lead'], data: {
    icon: '📻', color: '#1a1a2e',
    title: '📻 Sony Electronics',
    body: `SONY — LEADING THE WAY IN INNOVATION

"Sony electronics continue to lead the way in innovation."

THE COMPANY
Sony. Founded in 1946 in Tokyo by Masaru Ibuka and Akio Morita. Originally called Tokyo Telecommunications Engineering Corporation. The name "Sony" comes from "sonus" (Latin for sound) and "sonny" (American slang for a bright young man). By 1984, Sony is the most respected electronics brand in the world.

THE WALKMAN
The Sony Walkman. Introduced in 1979. It changed everything. For the first time, you could take your music with you — anywhere. The original Walkman was blue and silver. It weighed 14 ounces. It cost $150. It came with headphones that were light and comfortable — a radical departure from the heavy studio headphones of the era. By 1984, the Walkman is everywhere. Joggers, commuters, students — everyone has one.

THE TRINITRON
The Sony Trinitron television. Introduced in 1968. The picture quality is unmatched. The colors are vivid. The screen is flat. In 1984, a Trinitron is the television to own. It costs more than the competition. It's worth it. The picture is better. Everyone knows it.

THE BETAMAX
The Betamax VCR. Introduced in 1975. The first home video recorder. Sony pioneered the format. The picture quality is superior to VHS. But VHS won the format war — longer recording time, cheaper machines, more manufacturers. Betamax is losing. But Sony's engineering is unquestioned. They built the better machine. The market chose otherwise.

THE DISCMAN
In 1984, Sony releases the D-50 — the first portable CD player. It's called the Discman. It's the size of a CD case. It runs on batteries. It's expensive. It's the future. The CD will replace the cassette. The Discman will replace the Walkman. This won't happen overnight, but it will happen.

THE PHILOSOPHY
Sony's philosophy: "We will create products that didn't exist before." Ibuka and Morita built a company on innovation, not imitation. They didn't copy. They invented. The transistor radio. The Walkman. The Trinitron. The Betamax. The Discman. Each one changed how people lived with technology.

SONY ELECTRONICS.
Leading the way in innovation.
Since 1946.`,
  }},
  // SEAWORLD — unique San Diego marine park
  { keywords: ['seaworld', 'marine life', 'killer whale', 'shamu', 'killer whales'], data: {
    icon: '🐳', color: '#0070c9',
    title: '🐳 SeaWorld San Diego — Marine Life Park',
    body: `SEAWORLD SAN DIEGO — WHERE MARINE LIFE COMES TO LIFE

  Home to killer whales, dolphins, sea lions, and ocean adventures.

  THE PARK
  SeaWorld San Diego. Mission Bay. Opened in 1964. By 1984, it is one of the most popular theme parks on the West Coast — a place where you encounter marine life up close.

  SHAMU — THE KILLER WHALE
  Shamu. The iconic orca. When Shamu breaches — all 7,000 pounds clearing the water — the crowd roars. The splash soaks the first ten rows. This is the experience people come for.

  THE SHOWS
  The Shamu Show plays multiple times daily. Shamu leaps through hoops. Shamu jumps over trainers. Shamu splashes the crowd intentionally. Other shows feature dolphins, sea lions, walruses. Each showcases the intelligence and athleticism of marine mammals.

  THE EDUCATIONAL MISSION
  SeaWorld positions itself as educational. Visitors learn about marine ecology, conservation, and animal behavior. Trainers explain what you just saw. The animals are ambassadors for their species.

  THE ATTRACTIONS
  The Shamu Show: the main event. Dolphin Discovery: watching dolphins interact. Sea Lion High: comedy and athleticism. Multiple shows daily ensure you never miss the spectacle.

  THE TECHNOLOGY
  The park features state-of-the-art pools and habitats. The Shamu Stadium holds 3,000 gallons of water. The tanks are climate-controlled. The care of these massive animals is an engineering feat.

  THE EMOTION
  Watching a 7,000-pound killer whale breach is transcendent. The power. The grace. The intelligence. Visitors range from awe to tears. This is why people come.

  SEAWORLD SAN DIEGO.
  Where marine life comes to life.
  Shamu awaits.`,
  }},
  // Kansas City Zoo
  { keywords: ['kansas city zoo', 'zoo and see animals', 'animals from around the world', 'visit the zoo'], data: {
    icon: '🦁', color: '#27ae60',
    title: '🦁 Kansas City Zoo',
    body: `THE KANSAS CITY ZOO — ANIMALS FROM AROUND THE WORLD

"Visit the Kansas City Zoo and see animals from around the world."

THE ZOO
The Kansas City Zoo. Swope Park. Established in 1909. By 1984, it spans 202 acres and houses over 1,000 animals. It is a place where the wild meets the heartland. Where the plains of Africa and the rainforests of South America are a short drive from your living room.

THE ANIMALS
The lions. The tigers. The elephants. The giraffes. The zebras. The monkeys. The polar bears. The penguins. The reptiles. The birds. Each animal is a ambassador from a different part of the world. Each one has a story. Each one teaches you something about the planet we share.

THE EXPERIENCE
A day at the zoo. You arrive in the morning. You get a map. You plan your route. You see the big cats first — they're most active in the morning. Then the primates — always entertaining. Then the elephants — always impressive. Then the aquarium — always cool and dark. You eat lunch at the concession stand. You buy a souvenir in the gift shop. You go home tired and happy.

THE MISSION
The zoo exists for three reasons: education, conservation, and recreation. Education: kids learn about animals they've only seen in books. Conservation: the zoo participates in species survival programs, breeding endangered animals to preserve genetic diversity. Recreation: it's fun. It's a day outside. It's time with family.

THE SOUNDS
The roar of a lion. The chatter of monkeys. The trumpeting of elephants. The squawk of tropical birds. The zoo is a symphony of the natural world, played in the middle of Kansas City.

THE MEMORY
Every adult remembers their first trip to the zoo. The smell of the animals. The heat of the reptile house. The cold of the penguin exhibit. The amazement of seeing a giraffe up close — taller than you imagined. These memories last a lifetime. You'll bring your kids. They'll bring theirs.

VISIT THE KANSAS CITY ZOO.
See animals from around the world.
Swope Park.`,
  }},
  // "Life moves quickly" — Kodak / photography theme
  { keywords: ['life moves quickly', 'life moves fast', 'capture the moment', 'kodak moment'], data: {
    icon: '📸', color: '#e74c3c',
    title: '📸 Life Moves Quickly',
    body: `LIFE MOVES QUICKLY

"Life moves quickly."

THE MOMENT
Life moves quickly. The pitch. The swing. The catch. The cheer. The moment is here and then it's gone. In 1984, the only way to hold onto it is a photograph.

THE CAMERA
The Kodak camera. In 1984, it's everywhere. The Instamatic. The Disc camera. The 35mm point-and-shoot. Film in a yellow box. Flash cubes. Flash bars. The camera is how you stop time. You point. You click. The moment is frozen. Forever.

THE PHOTOGRAPH
The photograph is a physical object. You hold it. You pass it around. You put it in an album. You put it on the refrigerator. Years from now, you'll find it in a box and remember. The photograph outlasts the moment. The photograph outlasts the season. The photograph outlasts the decade.

THE KODAK MOMENT
Kodak's slogan: "The Kodak Moment." It's not just a marketing phrase — it's a cultural concept. A Kodak Moment is a moment worth preserving. A birthday. A vacation. A ballgame. A child's first steps. The sunset over the ballpark. The smile of someone you love.

THE FILM
In 1984, film is finite. You get 24 exposures. Or 36. Each one matters. You can't see the photo immediately. You take the roll to the drugstore. You wait three days. You pick up the envelope. You open it. Some are blurry. Some are perfect. The anticipation is part of the experience.

LIFE MOVES QUICKLY.
Capture the moment.
Before it's gone.`,
  }},
  // Electronics sale (generic)
  { keywords: ['save on electronics', 'electronics this weekend', 'electronics sale', 'save on electronics this weekend'], data: {
    icon: '🔌', color: '#2c3e50',
    title: '🔌 Save on Electronics',
    body: `SAVE ON ELECTRONICS — THIS WEEKEND

"Save on electronics this weekend."

THE SALE
This weekend only. The electronics store. The one with the big windows and the fluorescent lights. The one that smells like new plastic and solder. Everything is on sale. The televisions. The stereos. The radios. The calculators. The clock radios. The walkie-talkies. If it runs on electricity, it's marked down.

THE STORE
In 1984, the electronics store is a wonderland. Rows of televisions, all tuned to the same channel. The stereo section — turntables, receivers, speakers as tall as you. The radio wall — AM, FM, shortwave. The personal electronics counter — calculators, digital watches, handheld games. The back wall — VCRs and Betamax decks, still expensive but getting cheaper.

THE DEALS
A 19-inch color television: $299 (was $399). A AM/FM cassette boombox: $89 (was $129). A personal calculator with solar panel: $12 (was $19). A clock radio with dual alarm: $24 (was $34). The prices are 1984 prices. The technology is 1984 technology. The excitement is real.

THE FUTURE
In the electronics store of 1984, you can see the future. The CD player. The personal computer. The cellular phone. The VCR. Each one is a revolution. Each one will change how you live. And they're all on sale. This weekend only.

THE ADVICE
Measure your space before you buy a TV. Bring a cassette tape to test the boombox. Don't buy the extended warranty (it's not worth it). Do buy the surge protector (it is). And if you're thinking about a computer — wait. The prices are dropping fast. By next year, you'll get twice the computer for half the price.

SAVE ON ELECTRONICS.
This weekend only.
The future is on sale.`,
  }},
  // Take a Kid to the Ballgame (alternate phrasing)
  { keywords: ['take a kid', 'take a kid to the ballgame', "take a youngster", 'take a child'], data: MISC_ADS['youngster'] },
  // Computer in every home (alternate phrasing)
  { keywords: ['every home may one day have a computer', 'some experts believe', 'one day have a computer'], data: MISC_ADS['future_tech'] },
  // Don Mattingly autograph signing
  { keywords: ['don mattingly', 'mattingly will be signing', 'signing autographs'], data: {
    icon: '✍️', color: '#003087',
    title: '✍️ Don Mattingly — Autograph Signing',
    body: `DON MATTINGLY — AUTOGRAPH SIGNING

  "Don Mattingly will be signing autographs Saturday afternoon in White Plains."

  THE PLAYER
  Don Mattingly. First baseman. New York Yankees. Number 23. In 1984, he is 23 years old and in his first full season. He hits for average. He hits for power. He plays defense. He is, by every measure, a ballplayer.

  THE RISE
  Mattingly was called up in 1982. By 1984, he's fighting for the batting title. In a few years, he'll win the American League MVP. He'll hit .352. He'll hit 53 doubles. He'll be the best hitter in baseball for a stretch. But right now, in 1984, he's just getting started.

  THE AUTOGRAPH
  Saturday afternoon. White Plains, New York. A shopping center or a card shop or a sporting goods store. Mattingly sits behind a table. There's a line. You wait. You bring a baseball. You bring a card. You bring a program. He signs it. He looks up. He says "thanks." You say "thanks." The moment lasts three seconds. The signature lasts forever.

  THE EXPERIENCE
  Meeting a ballplayer in person is different from watching on television. They're taller. Or shorter. They're human. They sign your item and hand it back, and for a moment, you and Don Mattingly have a connection — however brief — that nobody else in the world has.

  THE ADVICE
  Get there early. The line will be long. Bring a Sharpie. Don't ask him to sign your forehead. Do say thank you. He's giving up his Saturday afternoon to sit at a table in White Plains.

  DON MATTINGLY.
  Saturday afternoon.
  White Plains.
  Bring a baseball.`,
  }},
  // DISNEYLAND — unique dedicated entry
  { keywords: ['disneyland', 'thousands of visitors are enjoying'], data: {
    icon: '🏰', color: '#8B0000',
    title: '🏰 Disneyland — The Happiest Place on Earth',
    body: `DISNEYLAND — THOUSANDS OF VISITORS ENJOYING THIS SUMMER

  The magic of Disneyland continues to welcome visitors from around the world.

  THE PARK
  Disneyland. Anaheim, California. Walt Disney's dream. Opened in 1955. By 1984, it stands as the ultimate American theme park — a place where imagination and engineering merge to create something truly magical.

  THE SUMMER EXPERIENCE
  Summer at Disneyland means extended hours. The park glows as the California sun sets. The night brings relief from the heat. Fantasyland becomes enchanted. Tomorrowland gleams with possibility. Frontierland feels like another century. The night crowds thin. The magic deepens.

  THE ATTRACTIONS
  Jungle Cruise: Skippers guide boats through exotic landscapes, their commentary dry and hilarious.
  Haunted Mansion: 999 happy haunts in a Gothic estate that feels more wonderful than scary.
  Space Mountain: A rocket ship through the cosmos, inside Tomorrowland's iconic dome.
  Pirates of the Caribbean: A dark ride through pirate lore, a technical marvel from 1967 that still captivates.
  Matterhorn Bobsleds: A wooden mountain housing a roller coaster, the first tubular steel coaster in the world.

  THE MAIN STREET U.S.A.
  Nostalgia by design. A recreation of early-20th-century small-town America. Horse-drawn trolleys. Gas lamps. Victorian storefronts. Disneyland Castle rising at the end. You step onto Main Street and surrender to the illusion. It works.

  THE TECHNOLOGY
  Disneyland pioneered new entertainment technology. Animatronics. Immersive environments. Storytelling through landscape design. Walt didn't just build a park. He invented a new form of entertainment.

  THE COMMITMENT
  A day at Disneyland is a full commitment. You must arrive early. You must stay late. Your feet will hurt. Your wallet will be lighter. Your wonder will be restored. This is the trade, and it's a fair one.

  THE THOUSANDS
  Thousands arrive every day. From Japan. From Europe. From across America. They wait in lines. They spend their money. They take their photos. They leave different than they arrived. They carry the magic home.

  DISNEYLAND.
  The Happiest Place on Earth.
  Summer is the perfect time.`,
  }},
  // SAN DIEGO SURF/SUNSHINE — unique dedicated entry
  { keywords: ['enjoy a day of surfing, swimming, and sunshine'], data: {
    icon: '🌊', color: '#00b4d8',
    title: '🌊 San Diego — Sun, Surf & Pacific Waves',
    body: `ENJOY A DAY OF SURFING, SWIMMING, AND SUNSHINE IN SAN DIEGO

  The Pacific coast welcomes you to a day of ocean and sun.

  BALBOA PARK — SAN DIEGO'S CULTURAL OASIS
  Home to museums, gardens, and cultural institutions that define San Diego.

  THE LOCATION
  Balboa Park. 1,200 acres in the heart of San Diego. Built for the Panama-California Exposition of 1915. By 1984, it is one of the finest cultural parks in America—15 museums, Spanish-Colonial architecture, gardens containing every plant species California can grow.

  THE MUSEUMS
  The San Diego Museum of Art. The Fleet Science Center. The Natural History Museum. The Automotive Museum. The Aerospace Museum. World-class exhibits. Free admission on rotating Tuesdays.

  THE GARDENS
  Japanese Friendship Garden. Botanical Building. Desert Garden. Rose Garden. Palm Canyon. Each has character and season. Summer colors are intense. The smell is intoxicating.

  SAN DIEGO ZOO — THE WORLD'S GREATEST ZOO
  Home to 3,000 animals representing 650+ species—giant pandas, African lions, Bengal tigers, polar bears, gorillas, primates from every continent.

  THE ANIMALS
  The Gorilla Forest is the most famous exhibit. A silverback gorilla—powerful, intelligent, human-like—changes how you think about the natural world.

  THE TECHNIQUE
  Cageless exhibits. Naturalistic habitats separated by moats you can't see. Animals have space. They behave naturally. A completely different zoo experience.

  THE MISSION
  Education. Conservation. The San Diego Zoo breeds endangered species. It funds conservation worldwide. Every ticket supports these efforts.

  BALBOA PARK AND THE SAN DIEGO ZOO.
  Culture, nature, and wonder. A day in either changes your perspective. A day in both is San Diego at its finest.

  THE LOCATION
  San Diego, California. The southern edge of Southern California. Where the Pacific Ocean meets the continent. The waves roll in from distant storms. The sun shows up 260+ days a year. This is America's surfing capital and one of its finest beach destinations.

  SURF CULTURE
  San Diego IS surf culture. The legendary beaches—Mission Beach, Pacific Beach, Coronado, La Jolla—produce swells that draw surfers worldwide. The local scene is real, passionate, and authentic. Surfers paddle out at dawn. They wait for the set. They ride. They return to shore grinning, salt-soaked, already thinking about the next swell.

  THE OCEAN EXPERIENCE
  The Pacific in summer is approachable—70°F water, manageable waves, warm sunshine. You wade in without a wetsuit. The water is clear. The sandy bottom drops gradually. You float. You swim. The ocean surrounds you completely. This is the ocean experience most Americans dream of but rarely experience.

  THE WAVES
  The swells that reach San Diego are born in distant storms—tropical systems, North Pacific lows—hundreds of miles away. By the time they arrive at Southern California, they've mellowed into perfect teaching waves. Not too big. Not too small. Just right.

  THE BEACH CULTURE
  San Diego beach life is casual. No pretension. No velvet rope. People of every age and background. Families with kids. Lifeguards in wooden towers. Street vendors selling fresh ceviche and grilled corn. Musicians playing guitars as the sun sets.

  THE LIFESTYLE
  An afternoon at a San Diego beach: arrive mid-morning, swim before lunch, grab a fish taco from a vendor, read or nap in the afternoon, catch the sunset, maybe grab dinner at a beachside restaurant. The Pacific is the backdrop to everything. The sun is reliable. The mood is peaceful.

  LOCALS KNOW
  If you ask a San Diegan the best way to spend a summer day, they'll tell you: get to the ocean before 10 AM, stay until the sun is low, leave the day better than you found it. This is San Diego.

  SURFS, SWIMS, SUNSHINE.
  San Diego.
  This is California at its best.`,
  }},
  ];

/**
 * Given ad text, try to find a matching keyword pattern and return a rich popup entry.
 * Returns null if no match found.
 */
export function generateFallbackEntry(adText) {
  if (!adText) return null;
  const text = adText.toLowerCase();
  for (const pattern of KEYWORD_PATTERNS) {
    if (pattern.keywords.some(kw => text.includes(kw.toLowerCase()))) {
      return {
        matchText: adText,
        ...pattern.data,
      };
    }
  }
  // Universal fallback — always returns rich, era-appropriate content for ANY banner text
  return {
    matchText: adText,
    icon: '📻',
    color: '#d4a373',
    title: '📻 Sponsor Message',
    body: `${adText}\n\nThis message comes to you from the broadcast booth, 1984.\n\nTHE SPONSOR\nIn the golden age of baseball broadcasting, sponsor messages were woven seamlessly into the game. Between pitches. Between innings. Between moments of drama. The sponsors spoke, and America listened.\n\nTHE ERA\nIt is 1984. Ronald Reagan is president. The Olympics lit up Los Angeles. Apple Computer aired its legendary "1984" commercial during the Super Bowl. Bruce Springsteen released "Born in the U.S.A." The world was changing, and baseball was right there in the middle of it.\n\nTHE GAME\nTwenty-six teams. No wild cards. No instant replay. No pitch clocks. Just nine innings, three outs, and the crack of the bat. The way it was meant to be.\n\nThe sponsor asks you to enjoy the game.\n\nWe now return to the action on the field.`,
  };
}