// National Promos Popups (#501-600+)
// Failed TV shows, cartoons, arcade games, home computers, music, PSAs, and 1984 cultural phenomena

import { trackGrooverSighting } from './achievements';

// ── FAILED TV SHOWS (#501-510) ──
const FAILED_TV_SHOWS = [
  {
    id: 'tv_501',
    title: 'Hot Pursuit',
    icon: '🚨',
    color: '#ef4444',
    anim: 'pulse',
    matchText: 'Catch "Hot Pursuit" this Friday night. Action, excitement, and crime-fighting from coast to coast.',
    type: 'failed_tv',
    body: `A high-octane action series that premiered in 1984, "Hot Pursuit" follows a team of dedicated crime fighters racing across America to stop criminals before they strike.
    
CAST & CREW
Starring Ben Murphy as Detective Jim Wyatt, leading a specialized law enforcement task force dedicated to pursuing the nation's most dangerous criminals.

PLOT SUMMARY
Each episode features a different case—from stolen government secrets to organized crime operations—as the team pursues suspects across state lines in a desperate race against time.

WHY IT FAILED
Despite strong action sequences and competent writing, "Hot Pursuit" couldn't compete with established crime dramas like "Miami Vice" and "Hill Street Blues." The concept felt derivative and audiences preferred the style of newer shows.

CULTURAL NOTE
1984 was oversaturated with crime and action shows, making it difficult for new entries to establish an audience.`,
  },
  {
    id: 'tv_502',
    title: 'Legmen',
    icon: '🕵️',
    color: '#3b82f6',
    anim: 'pulse',
    matchText: 'Don\'t miss the new detective series "Legmen," premiering this week.',
    type: 'failed_tv',
    body: `An unconventional detective drama where a team of street-level investigators tackle cases that major police departments won't touch.

THE PREMISE
"Legmen" follows private investigators who work outside the traditional police system, handling sensitive cases that require discretion and creativity.

CHARACTERS
The ensemble cast includes seasoned veterans and hungry newcomers, each bringing their own street-smart problem-solving skills to cases ranging from missing persons to corporate espionage.

WHAT WENT WRONG
While the concept had potential, the show struggled with inconsistent writing and suffered from low ratings in its time slot. It lasted only a partial season before cancellation.

TRIVIA
The show attempted to blend procedural elements with character drama, a formula that worked better for established shows with loyal audiences.`,
  },
  {
    id: 'tv_503',
    title: 'E/R',
    icon: '⚕️',
    color: '#a855f7',
    anim: 'pulse',
    matchText: 'The comedy "E/R" returns Thursday evening.',
    type: 'failed_tv',
    body: `A sitcom centered on the chaos of an urban emergency room, "E/R" attempted to blend medical drama with laugh-track comedy.

THE SETTING
Set in Chicago's emergency room, the show follows the daily misadventures of doctors, nurses, and patients in one of the city's busiest hospitals.

CAST
Featuring a rotating ensemble of doctors dealing with everything from medical mysteries to romantic entanglements, all while maintaining comedic timing.

THE EXPERIMENT
"E/R" was an early attempt to mix the seriousness of medical situations with sitcom humor—a formula that wouldn't truly succeed until shows like "M.A.S.H." and later "Scrubs."

LEGACY NOTE
While short-lived, "E/R" paved the way for medical comedies that would eventually find success on television.`,
    easterEgg: 'E/R',
  },
  {
    id: 'tv_504',
    title: 'Jennifer Slept Here',
    icon: '👻',
    color: '#ec4899',
    anim: 'pulse',
    matchText: 'Jennifer and Bruce continue their adventures on "Jennifer Slept Here."',
    type: 'failed_tv',
    body: `A paranormal sitcom where a teenage girl befriends the ghost of a dead movie star haunting a Malibu beach house.

THE CONCEPT
Jennifer, a ghost of a 1950s starlet, bonds with a modern teenager who can see her. Together they navigate life, dating, and the humor of generational differences.

STARS
Starring Glynnis O'Connor as Jennifer and Jay Underwood as her teenage friend, the show capitalized on the ghost comedy trend of the 1980s.

WHY IT DIDN'T LAST
Despite the novelty concept, the show relied too heavily on fish-out-of-water humor and didn't develop strong character arcs or compelling storylines.

CULTURAL CONTEXT
Ghost comedies were trendy in the early 1980s, but audiences quickly tired of the supernatural gimmick without deeper storytelling.`,
  },
  {
    id: 'tv_505',
    title: 'Paper Dolls',
    icon: '👗',
    color: '#f97316',
    anim: 'pulse',
    matchText: 'Join us for another episode of "Paper Dolls."',
    type: 'failed_tv',
    body: `A nighttime soap opera following the lives of high-fashion models in New York City.

THE DRAMA
"Paper Dolls" centered on six women navigating the cutthroat modeling world—dealing with unrealistic beauty standards, romantic entanglements, and dangerous industry secrets.

SETTING
The show was filmed in glamorous New York locations, featuring the exclusive clubs, high-end restaurants, and modeling agencies of Manhattan's elite.

CAST & PRODUCTION
Created as a primetime soap opera in the tradition of "Dynasty" and "Falcon Crest," "Paper Dolls" attempted to appeal to viewers interested in fashion and drama.

THE PROBLEM
While it had moments of intrigue, the show couldn't sustain interest. The modeling industry backdrop felt shallow compared to the oil industry glamour of "Dallas."`,
  },
  {
    id: 'tv_506',
    title: 'The Yellow Rose',
    icon: '🌹',
    color: '#dc2626',
    anim: 'pulse',
    matchText: 'See what happens next on "The Yellow Rose."',
    type: 'failed_tv',
    body: `A primetime drama set on a sprawling Texas ranch, blending Western tradition with modern soap opera elements.

THE RANCH
The setting is a massive Texas property owned by the Craddock family, where oil, cattle, and family secrets collide.

CHARACTERS
The ensemble includes ranch hands, oil executives, and family members caught in various love triangles and business disputes.

SOAP OPERA ELEMENTS
"The Yellow Rose" attempted to cash in on the success of "Dallas" and "Dynasty" by offering Texas-sized drama with Western flavor.

WHAT FAILED
The show couldn't find its identity—it was too Western for soap opera fans and too soapy for Western fans. The writing was inconsistent, and the cast changes hurt continuity.`,
  },
  {
    id: 'tv_507',
    title: 'Partners in Crime',
    icon: '🕶️',
    color: '#06b6d4',
    anim: 'pulse',
    matchText: 'Don\'t miss "Partners in Crime" starring Loni Anderson and Lynda Carter.',
    type: 'failed_tv',
    body: `An action-comedy pairing two female leads as partners who solve crimes together using brains, beauty, and bravado.

THE STARS
Starring Lynda Carter (Wonder Woman) and Loni Anderson (WKRP in Cincinnati), two of television's most recognizable actresses of the early 1980s.

THE FORMULA
The show combined action sequences with comedic banter, attempting to appeal to fans of both drama and humor. The chemistry between the leads was the main selling point.

THE VIBE
"Partners in Crime" had a fun, lighthearted approach to crime-solving, more akin to "Charlie's Angels" than to serious detective dramas.

BOX OFFICE & RATINGS
Despite the star power and fun chemistry, the show struggled to find a consistent audience. Production issues and scheduling conflicts contributed to its short run.`,
  },
  {
    id: 'tv_508',
    title: 'Finder of Lost Loves',
    icon: '❤️',
    color: '#ec4899',
    anim: 'pulse',
    matchText: 'Tune in for "Finder of Lost Loves" this week.',
    type: 'failed_tv',
    body: `A romantic drama where a mysterious woman reunites lost loves, helping separated couples reconnect.

THE CONCEPT
Each episode features a different couple—high school sweethearts, wartime romances, or chance meetings—as the titular "Finder" tracks them down and orchestrates their reunion.

THE HOST
The central character, a woman with uncanny ability to locate lost loves, becomes involved in each couple's story, often discovering that time has changed them.

EMOTIONAL STAKES
The show banked on the audience's emotional investment in romantic reconnections, featuring real drama alongside happy endings.

THE PROBLEM
While the concept was charming, the execution became repetitive. Once audiences realized most episodes would end happily, tension evaporated. The show needed stronger character development between reunions.`,
  },
  {
    id: 'tv_509',
    title: 'Riptide',
    icon: '🌊',
    color: '#2563eb',
    anim: 'pulse',
    matchText: 'The drama continues on "Riptide."',
    type: 'failed_tv',
    body: `An action series set in Hawaii following a team of private investigators operating from a beach resort.

THE SETTING
Riptide Harbor is home to three detectives who solve mysteries while enjoying—and constantly interrupted by—the laid-back Hawaiian lifestyle.

THE TEAM
The crew includes Nick Ryder, a Vietnam veteran running the operation; Cody Allen, the tech expert; and Bozworth, the comic relief.

APPEAL
The show combined action, comedy, and beautiful Hawaiian locations, creating an escapist atmosphere that appealed to viewers seeking tropical adventure.

WHY IT LASTED
Unlike many shows on this list, "Riptide" actually found moderate success and enjoyed multiple seasons. It developed a cult following and demonstrated that the formula could work.`,
  },
  {
    id: 'tv_510',
    title: 'Hardcastle & McCormick',
    icon: '🏎️',
    color: '#8b5cf6',
    anim: 'pulse',
    matchText: 'Catch "Hardcastle and McCormick" following tonight\'s news.',
    altMatchTexts: ['Hardcastle and McCormick returns with another high-speed adventure.'],
    type: 'failed_tv',
    body: `A crime-fighting duo: a retired federal judge and a reformed car thief, using cunning and custom vehicles to solve cases outside the law.

THE PREMISE
Judge Hardcastle hires Mark McCormick, a street-smart ex-convict, to investigate cases where justice failed through proper legal channels. Together they bend rules to catch criminals the system released.

THE VEHICLE
The iconic Coyote X—a high-tech car designed by McCormick—becomes central to their investigations, featuring gadgets and modifications perfect for high-speed pursuits.

TONE
The show balances action, humor, and justice, with McCormick's one-liners and Hardcastle's gruff authority creating compelling chemistry.

SUCCESS STORY
Unlike most on this list, "Hardcastle & McCormick" actually became successful, lasting five seasons and creating a successful formula of retired authority figures and young rogues working together.`,
  },
  {
    id: 'tv_511',
    title: 'Clark & Behb Detective Agency',
    icon: '🕵️',
    color: '#22c55e',
    anim: 'pulse',
    matchText: 'Tune in for the premiere of "Clark & Behb Detective Agency" — the quirkiest investigators on television.',
    type: 'failed_tv',
    body: `CLARK & BEHB DETECTIVE AGENCY - The Odd Couple of Sleuthing

"Clark & Behb Detective Agency" premiered in the fall of 1984, following the misadventures of two wildly mismatched private detectives sharing a rundown office above a laundromat in a nameless coastal city.

THE PREMISE
Clark is a meticulous, by-the-book investigator who files everything in color-coded folders and insists on proper chain of evidence. Behb is his polar opposite — a chaotic, improvisational wild card who solves crimes on instinct, hunches, and the occasional tarot card reading. Together they form the most unlikely detective agency in television history.

THE DYNAMIC
Each episode typically begins with a routine case — a missing parrot, a stolen ceramic cat — that spirals into something far larger and more absurd. Clark's methodical approach clashes hilariously with Behb's gonzo tactics, yet their contrasting styles somehow complement each other when the stakes get high.

WHY IT FAILED
Critics were divided. Some praised the chemistry between the leads, but network executives couldn't decide whether the show was a comedy, a drama, or something entirely new. Frequent time-slot changes confused viewers, and the show's offbeat tone never found its audience.

CULT LEGACY
"Clark & Behb" developed a small but devoted cult following after cancellation. Fans still debate whether the show was ahead of its time or simply too weird for 1984. The episode where Behb attempts to interrogate a suspect using only mime remains a fan favorite.`,
  },
  {
    id: 'tv_512',
    title: 'Carmie',
    icon: '🎭',
    color: '#f59e0b',
    anim: 'pulse',
    matchText: 'Don\'t miss "Carmie" — the heartwarming new series everyone\'s talking about.',
    type: 'failed_tv',
    body: `CARMIE - The Spirit of the Neighborhood

"Carmie" premiered in mid-season 1984 as a half-hour comedy-drama about a larger-than-life character who becomes the unlikely heart and soul of a struggling urban neighborhood.

THE CHARACTER
Carmie is a lovable, gregarious fixture of the community — part philosopher, part gossip, part unofficial mayor of the block. Carmie knows everyone's secrets, everyone's dreams, and everyone's favorite recipes. With a warm smile and an endless supply of unsolicited advice, Carmie navigates the daily dramas of the neighborhood with charm and good humor.

THE PREMISE
Each episode centers around Carmie's attempts to solve a neighbor's problem — sometimes practical, sometimes deeply personal — through a combination of street smarts, heart-to-heart conversations, and the occasional well-intentioned scheme that inevitably goes sideways before somehow working out.

WHY IT FAILED
The show was initially well-received by critics who praised its warmth and the lead performance, but ratings declined steadily. The feel-good tone struggled to compete with flashier, action-oriented programming in the same time slot. Despite a loyal following, the network pulled the plug after one season.

TRIVIA
Fans of the show still reference Carmie's catchphrase, delivered with a knowing wink: "Honey, I've seen worse — and it turned out fine." The line became a minor cultural touchstone among devotees of short-lived 1980s television.`,
  },
];

// ── TV MOVIES (#511-515) ──
const TV_MOVIES = [
  {
    id: 'tvmov_511',
    title: 'Sunday Night Special',
    icon: '📺',
    color: '#8b5cf6',
    anim: 'pulse',
    matchText: 'Sunday night features a special made-for-television movie event.',
    type: 'tv_movie',
    body: `A network television event featuring an original movie premiere exclusively on television.

WHAT TO EXPECT
Sunday nights became "Family Movie Night" for millions of Americans, with networks premiering made-for-TV movies that couldn't secure theatrical distribution but featured recognizable stars and compelling stories.

THE FORMULA
These movies typically ran 90-120 minutes (with commercial breaks), featured name actors in secondary roles, and tackled emotional or sensational topics relevant to 1984 America.

TYPICAL THEMES
- True crime dramas
- Medical emergencies
- Family traumas
- Paranormal mysteries
- Historical recreations

CULTURAL SIGNIFICANCE
Made-for-TV movies represented a significant portion of American entertainment in 1984, often reaching audiences larger than theatrical releases. They were considered "event television."`,
  },
  {
    id: 'tvmov_512',
    title: 'The Burning Bed',
    icon: '🔥',
    color: '#dc2626',
    anim: 'pulse',
    matchText: 'Don\'t miss "The Burning Bed" starring Farrah Fawcett.',
    type: 'tv_movie',
    body: `A groundbreaking television movie starring Farrah Fawcett as Francine Hughes, a woman who sets fire to her abusive husband's bed in an act of desperation.

CULTURAL IMPACT
"The Burning Bed" brought domestic violence into mainstream American living rooms in 1984, sparking national conversations about spousal abuse, women's rights, and justice.

THE STORY
Based on true events, the film chronicles Francine's abusive marriage, her failed escape attempts, her children's suffering, and her ultimate act of desperation that leads to legal consequences.

CRITICAL RECEPTION
The film was praised for its unflinching portrayal of abuse and Fawcett's powerful dramatic performance. It won multiple Emmy Awards and is considered a landmark TV movie.

LASTING LEGACY
"The Burning Bed" remains a cultural touchstone for discussions of domestic violence and helped shift public perception of abused women as victims, not perpetrators.`,
  },
  {
    id: 'tvmov_513',
    title: 'A Special Television Presentation',
    icon: '🎭',
    color: '#06b6d4',
    anim: 'pulse',
    matchText: 'A special television presentation airs this weekend.',
    type: 'tv_movie',
    body: `A catch-all term for ABC's primetime movie presentations, these special broadcasts brought drama, comedy, and spectacle to living rooms nationwide.

THE PROGRAMMING
"Special Presentations" included everything from adaptations of stage plays to original screenplays, always featuring recognizable stars and production value designed to compete with theatrical releases.

ADVERTISING BLITZ
Networks promoted these specials heavily, creating "event" television that families planned to watch together, making them major cultural moments.

VARIETY OF CONTENT
From comedy specials to serious dramas, "Special Presentations" represented the full spectrum of television entertainment, showcasing variety and ambition.

VIEWING EXPERIENCE
In the pre-cable era, these specials represented major entertainment options, often dominating water cooler conversations at work and school the following day.`,
  },
  {
    id: 'tvmov_514',
    title: 'Evening Movie',
    icon: '🌙',
    color: '#1e293b',
    anim: 'pulse',
    matchText: 'Enjoy an evening movie from the comfort of home.',
    type: 'tv_movie',
    body: `The staple of primetime television—a feature-length film broadcast in the evening hours, designed for families to watch together.

THE TREND
By 1984, networks had invested heavily in acquiring movie rights and producing original content to air in evening slots, making theatrical releases available to viewers at home.

SCHEDULING
Movies in prime evening slots became appointment television, with families planning their week around major releases coming to their networks.

QUALITY RANGE
While some were recent theatrical releases, others were original productions made specifically for television, often featuring A-list talent seeking television exposure.

CONVENIENCE FACTOR
Home viewing of movies was revolutionary—no need to drive to a theater, pay for tickets, or worry about babysitters. Entertainment came directly to the living room.`,
  },
  {
    id: 'tvmov_515',
    title: 'World Premiere Television Movie',
    icon: '🌍',
    color: '#10b981',
    anim: 'pulse',
    matchText: 'Stay tuned for a world premiere television movie.',
    type: 'tv_movie',
    body: `A motion picture making its premiere exclusively on network television, never released theatrically anywhere in the world.

ORIGINAL CONTENT
Networks invested heavily in original movies, creating content that would premiere on television before any other medium. These represented major production budgets and creative ambitions.

STAR POWER
World premiere movies frequently attracted major television stars and secondary film actors, making them significant entertainment events.

PRODUCTION VALUES
The best of these matched theatrical quality in cinematography, writing, and direction, proving that television could produce serious, professional dramatic content.

CULTURAL SIGNIFICANCE
World premiere movies represented television's confidence in its ability to produce and premiere major entertainment, challenging the traditional film industry hierarchy.`,
  },
];

// ── CARTOONS (#516-525) ──
const CARTOONS = [
  {
    id: 'cartoon_516',
    title: 'Saturday Morning Cartoons',
    icon: '📺',
    color: '#f97316',
    anim: 'bounce',
    matchText: 'Saturday morning means cartoons for the whole family.',
    type: 'cartoon',
    body: `Saturday morning television represents an American institution—the weekly tradition of children waking early to watch animated adventures on network television.

THE TRADITION
For generations, Saturday mornings belonged to cartoons. Networks scheduled 2-3 hours of children's programming, attracting millions of young viewers to their stations.

PROGRAMMING
The typical Saturday morning schedule included action cartoons, comedies, educational shows, and game shows, all designed for school-age audiences.

CULTURAL TOUCHSTONE
Saturday morning cartoons shaped childhoods, created lifelong fan communities, and launched merchandising phenomena that made networks massive profits.

ADVERTISING & TOYS
Cartoons were vehicles for toy companies to market directly to children. A successful cartoon could launch action figures, lunch boxes, and games that became cultural phenomena.

THE EXPERIENCE
Waking up early on Saturday became an American childhood ritual—the reward for enduring school all week. Cereal, cartoons, and fun became inseparable in young minds.`,
  },
  {
    id: 'cartoon_517',
    title: 'Mister T',
    icon: '💪',
    color: '#fbbf24',
    anim: 'bounce',
    matchText: 'Catch "Mister T" Saturday morning.',
    type: 'cartoon',
    body: `An action-adventure cartoon featuring the real Mr. T (in voice and spirit) leading a team of gymnasts and athletes fighting crime and injustice.

THE STAR
Mr. T, the real person, contributed to the show's development, lending his name, persona, and catchphrases to the animated series.

THE TEAM
A diverse group of teenage athletes with real skills—gymnasts, wrestlers, martial artists—use their abilities to help people in danger and stop criminals.

THE FORMAT
Each episode combined action, humor, and positive messaging, with Mr. T often dropping wisdom about friendship, courage, and standing up for what's right.

THE LEGACY
The show capitalized on Mr. T's mainstream popularity in 1984, allowing him to extend his brand into children's entertainment while delivering positive role models and messages.`,
  },
  {
    id: 'cartoon_518',
    title: 'Alvin and the Chipmunks',
    icon: '🐿️',
    color: '#a855f7',
    anim: 'bounce',
    matchText: 'The adventures continue on "Alvin and the Chipmunks."',
    type: 'cartoon',
    body: `The beloved chipmunk trio—Alvin, Simon, and Theodore—return in animated adventures, bringing their music and mischief to Saturday mornings.

THE CHARACTERS
Alvin is the troublemaking leader, Simon is the brainy one, and Theodore is the sweet, innocent member of the trio. Their contrasting personalities drive the comedy.

THE FORMAT
Combining comedy, music, and adventure, each episode features the chipmunks getting into situations that require cleverness, teamwork, and their signature high-pitched singing voices.

MUSICAL ELEMENT
The Chipmunks' signature songs and covers of popular hits remained central to the show's appeal, giving musically-inclined children a fun alternative to straight dialogue.

LEGACY
The Chipmunks franchise proved enduring, repeatedly revived and reimagined because the characters' fundamental appeal transcended generations.`,
  },
  {
    id: 'cartoon_519',
    title: 'The Littles',
    icon: '👶',
    color: '#ec4899',
    anim: 'bounce',
    matchText: 'See "The Littles" this Saturday.',
    type: 'cartoon',
    body: `A charming animated series about a family of tiny people—The Littles—who live secretly within the walls and furniture of a human family's home.

THE PREMISE
The Littles, each only six inches tall, navigate the giant world of human homes, forming friendships with the human Bigg family while keeping their existence secret.

THE ADVENTURE
Adventures come from the Littles' daily life—evading discovery, dealing with household hazards that pose real danger at their size, and helping their human friends.

THE HEART
The show balanced comedy with genuine sweetness, exploring themes of friendship, kindness, and acceptance between the two families despite their size differences.

ANIMATION STYLE
The show featured charming, colorful animation that appealed to younger viewers, with designs emphasizing the Littles' adorable qualities.`,
  },
  {
    id: 'cartoon_520',
    title: 'Heathcliff',
    icon: '🐱',
    color: '#ef4444',
    anim: 'bounce',
    matchText: 'Join "Heathcliff" for more animated fun.',
    type: 'cartoon',
    body: `A mischievous orange tabby cat causes chaos wherever he goes, battling neighborhood rivals and frustrating his owner in daily comedic adventures.

THE STAR
Heathcliff is an independent, clever cat with more personality than any house pet should have, always scheming and rarely learning his lessons.

THE CAST
Heathcliff interacts with various characters—his owner Mort, the dog-catcher, neighboring cats, and various townspeople—all of whom become victims of his pranks.

THE HUMOR
The comedy comes from Heathcliff's elaborate schemes and the ironic consequences he faces, usually resulting in slapstick situations and wordplay.

THE APPEAL
The show capitalized on children's natural attraction to animal characters, particularly cats who embody cunning and independence in ways kids found amusing.`,
  },
  {
    id: 'cartoon_521',
    title: 'Inspector Gadget',
    icon: '🔍',
    color: '#3b82f6',
    anim: 'bounce',
    matchText: 'Don\'t miss "Inspector Gadget."',
    type: 'cartoon',
    body: `A bumbling detective with an incredible array of mechanical gadgets built into his body attempts to solve crimes, usually succeeding by accident.

THE CHARACTER
Inspector Gadget is a cyborg detective whose body contains dozens of retractable tools, weapons, and gadgets activated by voice command, most of which malfunction hilariously.

THE FORMULA
Gadget is perpetually a step behind the criminal organization M.A.D., but his niece Penny and her dog Brain outsmart the villains while Gadget stumbles toward victory.

THE APPEAL
The show balanced physical comedy, spy adventure, and gadget novelty, creating a unique animated style that influenced children's animation for decades.

CULTURAL IMPACT
Inspector Gadget became iconic, with catchphrases and gadget concepts becoming part of toy lines and merchandise, proving the character's staying power.`,
  },
  {
    id: 'cartoon_522',
    title: 'The Smurfs',
    icon: '💙',
    color: '#2563eb',
    anim: 'bounce',
    matchText: 'The Smurfs return Saturday morning.',
    type: 'cartoon',
    body: `Tiny blue creatures called Smurfs live in mushroom houses in a magical forest, navigating life under the benevolent guidance of Papa Smurf and constantly avoiding the evil Gargamel.

THE WORLD
Smurfs are a peaceful, joyful society living in the enchanted forest, where magic is real and danger often comes from the outside world.

THE CAST
Papa Smurf is the leader, Smurfette represents feminine energy, Brainy Smurf is intellectual, and dozens of other smurfs have unique personalities and skills.

THE CONFLICTS
The primary antagonist, the evil wizard Gargamel, constantly plots to capture Smurfs for nefarious purposes, though he rarely succeeds.

INTERNATIONAL APPEAL
The Smurfs became a global phenomenon, appealing across cultures and languages. The show's simple charm, moral lessons, and colorful world transcended boundaries.`,
  },
  {
    id: 'cartoon_523',
    title: 'Dungeons & Dragons',
    icon: '🐉',
    color: '#8b5cf6',
    anim: 'bounce',
    matchText: 'Kids everywhere are tuning in for "Dungeons & Dragons."',
    type: 'cartoon',
    body: `A group of teenage adventurers are transported to the magical world of the Realm, where they must master weapons, spells, and courage to survive and find their way home.

THE PREMISE
After a magical roller coaster ride, six teens find themselves in a medieval fantasy world with weapons and armor suited to their individual personalities and abilities.

THE WORLD
The Realm is filled with magic, monsters, and mystery. The kids encounter dragons, wizards, and various fantastical creatures as they search for a way home.

THE GROWTH
The series explores how ordinary teenagers develop courage, leadership, and friendship in extraordinary circumstances, mixing action with character development.

CULTURAL MOMENT
The show rode the wave of D&D's popularity among youth, translating tabletop gaming into animated adventure that introduced fantasy concepts to younger audiences.`,
  },
  {
    id: 'cartoon_524',
    title: 'Spider-Man and His Amazing Friends',
    icon: '🕷️',
    color: '#ef4444',
    anim: 'bounce',
    matchText: 'See Spider-Man and His Amazing Friends.',
    type: 'cartoon',
    body: `Spider-Man teams up with the X-Men's Iceman and Firestar, a new hero, to fight crime and injustice while attending college and managing secret identities.

THE TEAM
Peter Parker (Spider-Man), Bobby Drake (Iceman), and Angelica Jones (Firestar) are college students and superheroes, balancing civilian life with crime-fighting.

THE ADVENTURES
The trio takes on super-villains, criminal organizations, and mutant threats, their powers and chemistry creating unique solutions to impossible problems.

THE SETTING
College life provides contrast to superhero action, adding relationship drama and character depth beyond simple action-adventure.

THE APPEAL
Marvel superhero fans loved the animated series, which stayed relatively faithful to comic source material while creating original stories for the medium.`,
  },
  {
    id: 'cartoon_525',
    title: 'Pac-Man',
    icon: '👾',
    color: '#fbbf24',
    anim: 'bounce',
    matchText: 'The Pac-Man cartoon continues this weekend.',
    type: 'cartoon',
    body: `The beloved arcade character Pac-Man and his family navigate the Pac-Land, a colorful maze world filled with ghosts, power-ups, and adventure.

THE UNIVERSE
Pac-Land features Pac-Man, Mrs. Pac-Man, Junior, and various ghost characters as residents of a magical world where the rules of the arcade game extend into society.

THE FORMAT
Episodes combine action from the video game with character development and storytelling, exploring relationships and motivations beyond scoring points.

THE GHOSTS
Blinky, Pinky, Inky, and Clyde gain personalities and motivations beyond being obstacles, sometimes becoming allies and friends to Pac-Man.

THE PHENOMENON
The Pac-Man cartoon represented the animation industry's recognition that video games were cultural phenomena worthy of adaptation and expansion into other media.`,
  },
];

// Continue with ARCADE GAMES, COMPUTERS, TECHNOLOGY, PRODUCTS, MUSIC, and PSAs in next sections...
// Due to length, I'll structure this file to be extensible

// Import additional categories from popups2
import {
  ARCADE_GAMES,
  HOME_COMPUTERS,
  WEIRD_TECHNOLOGY,
  ODD_PRODUCTS,
  MUSIC,
  RANDOM_1984_LIFE,
  PSAs,
  ALL_ENTRIES as ENTRIES_FROM_POPUPS2,
} from './nationalPromosPopups2';

const ENTRIES = [
  ...FAILED_TV_SHOWS,
  ...TV_MOVIES,
  ...CARTOONS,
  ...ARCADE_GAMES,
  ...HOME_COMPUTERS,
  ...WEIRD_TECHNOLOGY,
  ...ODD_PRODUCTS,
  ...MUSIC,
  ...RANDOM_1984_LIFE,
  ...PSAs,
];

export function findNationalPromosEntry(adText) {
  return ENTRIES.find(e => e.matchText === adText || (e.altMatchTexts && e.altMatchTexts.includes(adText))) || null;
}

export function getNationalPromosEntry(id) {
  return ENTRIES.find(e => e.id === id) || null;
}

const VIEWED_PROMOS = new Set();

export function trackNationalPromosView(entryId) {
  VIEWED_PROMOS.add(entryId);
  const unlocked = [];

  if (VIEWED_PROMOS.size === 1) {
    unlocked.push('national_promo_first');
  }
  if (VIEWED_PROMOS.size >= 10) {
    unlocked.push('national_promo_10');
  }
  if (VIEWED_PROMOS.size >= 25) {
    unlocked.push('national_promo_25');
  }
  if (VIEWED_PROMOS.size >= 50) {
    unlocked.push('national_promos_completionist');
  }

  // ── The Groovers: track Clark & Behb and Carmie ──
  try {
    if (entryId === 'tv_511') trackGrooverSighting('tv_clark_behb');
    if (entryId === 'tv_512') trackGrooverSighting('tv_carmie');
  } catch (e) { /* ignore */ }

  return unlocked;
}

export function getNationalPromosViewCount() {
  return VIEWED_PROMOS.size;
}