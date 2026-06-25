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