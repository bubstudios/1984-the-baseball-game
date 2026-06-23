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
  return null;
}