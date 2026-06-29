// National Wrestling Popups #676-700 (1984 wrestling superstars & events)

const ENTRIES = [
  {
    id: 'wre_676',
    title: 'Hulk Hogan',
    icon: '💪',
    color: '#fbbf24',
    anim: 'pulse',
    matchText: 'Hulk Hogan demands you take your vitamins, brother!',
    body: `THE HULKSTER

Hulkamania is running wild, brother!

Terry "Hulk Hogan" Bollea has become the biggest name in professional wrestling, combining charisma, muscle, and an unstoppable attitude.

THE GIMMICK
Hulk Hogan's persona combines all-American heroism with raw power. His trademark bandana, mustache, and "Hulkamania" catchphrase have made him a household name.

THE MOVES
• Leg Drop of Doom - finishing move
• Big Boot
• Atomic Leg Drop
• Hulking Up

THE CATCHPHRASES
• "Whatcha gonna do when Hulkamania runs wild on you?!"
• "Take your vitamins, brother!"
• "Say your prayers and eat your vitamins"

THE FANBASE
Hulkamaniacs span all ages, from kids who idolize him to adults who appreciate his showmanship.

THE LEGACY
Hulk Hogan has transformed wrestling from regional attraction to national phenomenon.

"Whatcha gonna do, brother?!"`,
  },
  {
    id: 'wre_677',
    title: 'Rowdy Roddy Piper',
    icon: '🎤',
    color: '#dc2626',
    anim: 'pulse',
    matchText: 'Rowdy Roddy Piper has something to say!',
    body: `HOT ROD

Rowdy Roddy Piper is the most controversial figure in wrestling, known for his explosive temper and even more explosive mouth.

THE GIMMICK
Piper plays the villain with unmatched intensity. His "Piper's Pit" interview segment has become must-see television, where he provokes guests into confrontations.

THE BACKGROUND
Born in Canada, Piper's Scottish heritage informs his bagpipe entrance music and kilt-wearing persona.

THE RIVALRIES
Piper has feuded with every major babyface in wrestling, most notably Hulk Hogan. Their rivalry has defined an era.

THE MIC SKILLS
Considered one of the greatest talkers in wrestling history. Piper can generate heat with just a few words.

THE LEGACY
Piper's ability to make audiences hate him has made him invaluable to wrestling promoters.

"Just when you think you know the answers, I change the questions."`,
  },
  {
    id: 'wre_678',
    title: 'Andre the Giant',
    icon: '🗿',
    color: '#7c3aed',
    anim: 'pulse',
    matchText: 'Andre the Giant remains undefeated.',
    body: `THE EIGHTH WONDER OF THE WORLD

Andre the Giant stands nearly 7'4" and weighs over 500 pounds, making him the most physically imposing figure in wrestling history.

THE RECORD
Andre remained undefeated for nearly 15 years, an unprecedented streak that made him a living legend.

THE BACKGROUND
Born André René Roussimoff in France, Andre's size was the result of gigantism. His hands are so large he can palm a beer can like a coin.

THE FEUDS
Andre has battled every major star, from Hulk Hogan to Big John Studd. His matches are events, not just contests.

THE PERSONALITY
Despite his intimidating size, Andre is known for his gentle nature outside the ring and legendary capacity for food and drink.

THE LEGACY
Andre the Giant transcends wrestling, becoming a cultural icon recognized worldwide.

"The giant cannot be stopped."`,
  },
  {
    id: 'wre_679',
    title: 'The Iron Sheik',
    icon: '🇮🇷',
    color: '#059669',
    anim: 'pulse',
    matchText: 'The Iron Sheik threatens America.',
    body: `THE IRON SHEIK

The Iron Sheik is wrestling's premier foreign villain, using his Iranian heritage to generate massive heat from American audiences.

THE GIMMICK
The Sheik portrays an anti-American heel, waving the Iranian flag and denouncing American values. His timing during real-world tensions makes him especially effective.

THE BACKGROUND
Real name Hossein Khosrow Ali Vaziri, the Iron Sheik was actually an amateur wrestler who competed for Iran in the Olympics before turning professional.

THE MOVES
• Camel Clutch - devastating finishing hold
• Persian clubs
• Suplex variations

THE RIVALRIES
The Sheik has feuded with Hulk Hogan, Sgt. Slaughter, and every patriotic American wrestler. His matches are political theater.

THE LEGACY
The Iron Sheik proved that foreign heels could draw massive money during times of international tension.

"USA! USA! USA!"`,
  },
  {
    id: 'wre_680',
    title: 'Junkyard Dog',
    icon: '🐕',
    color: '#fbbf24',
    anim: 'bounce',
    matchText: 'Junkyard Dog is ready to bark.',
    body: `THE JYD

Sylvester "Junkyard Dog" Ritter brings energy and charisma to every arena, complete with his trademark dog collar and chain.

THE GIMMICK
JYD combines street credibility with crowd-pleasing showmanship. His entrance with the dog chain has become iconic.

THE MOVES
• Headbutt
• Powerslam
• Big splash

THE FANBASE
JYD is especially popular with younger fans who love his energetic style and crowd interaction.

THE APPEAL
His combination of power and charisma makes him a natural babyface who connects with audiences.

THE LEGACY
Junkyard Dog proved that charisma and connection with fans matter more than technical wrestling skill.

"Give 'em the dog, baby!"`,
  },
  {
    id: 'wre_681',
    title: 'Ricky Steamboat',
    icon: '🐉',
    color: '#dc2626',
    anim: 'pulse',
    matchText: 'Ricky Steamboat brings the dragon.',
    body: `THE DRAGON

Ricky "The Dragon" Steamboat is one of wrestling's most athletic and technically skilled performers, known for his high-flying style.

THE STYLE
Steamboat combines technical wrestling with aerial attacks, creating matches that are both beautiful and exciting.

THE RIVALRIES
His legendary feud with Randy "Macho Man" Savage produced some of the greatest matches in wrestling history.

THE MOVES
• Flying crossbody
• Arm drag combinations
• Top rope splash
• Multiple suplex variations

THE APPEAL
Steamboat's clean-cut image and incredible athleticism make him a fan favorite across demographics.

THE LEGACY
Ricky Steamboat set the standard for athletic wrestling that influenced generations of performers.

"The Dragon never sleeps."`,
  },
  {
    id: 'wre_682',
    title: 'Randy Savage',
    icon: '👑',
    color: '#fbbf24',
    anim: 'pulse',
    matchText: 'Macho Man Randy Savage is going crazy!',
    body: `THE MACHO MAN

Randy "Macho Man" Savage combines incredible athleticism with unmatched intensity and flamboyant style.

THE GIMMICK
Savage's persona features sequined robes, colorful headbands, and a raspy, intense speaking style. His manager Miss Elizabeth adds elegance to his chaos.

THE MOVES
• Diving Elbow Drop - finishing move
• Scoop slam
• Ax handle
• Top rope double axe handle

THE CATCHPHRASES
• "Oooh yeah!"
• "The cream of the crop!"
• "Snap into a Slim Jim!"

THE RIVALRIES
Savage has feuded with Ricky Steamboat, Hulk Hogan, and Tito Santana, producing classic matches.

THE INTENSITY
Savage's matches are characterized by his explosive energy and willingness to take risks.

"Oooh yeah, dig it!"`,
  },
  {
    id: 'wre_683',
    title: 'Tito Santana',
    icon: '🇲🇽',
    color: '#059669',
    anim: 'pulse',
    matchText: 'Tito Santana brings the Mexican style.',
    body: `TITO SANTANA

Tito Santana combines technical wrestling with high-flying lucha libre style, making him one of wrestling's most versatile performers.

THE BACKGROUND
Born in Mexico, Santana brings authentic lucha libre influences to American wrestling.

THE MOVES
• Flying forearm
• Arm drag combinations
• Multiple suplexes
• Figure four leglock

THE CHAMPIONSHIPS
Santana has held multiple championships, proving his credentials as a top-tier competitor.

THE APPEAL
Santana's combination of skill and charisma makes him popular with diverse audiences.

THE LEGACY
Tito Santana helped introduce lucha libre elements to mainstream American wrestling.

"Arriba!"`,
  },
  {
    id: 'wre_684',
    title: 'Greg Valentine',
    icon: '🔨',
    color: '#7c3aed',
    anim: 'pulse',
    matchText: 'Greg Valentine brings the hammer.',
    body: `THE HAMMER

Greg "The Hammer" Valentine is one of wrestling's most physical and brutal competitors, known for his stiff style and devastating moves.

THE GIMMICK
Valentine's "Hammer" nickname reflects his hard-hitting style and willingness to punish opponents.

THE MOVES
• Figure four leglock
• Elbow drop
• Suplex variations
• Stiff forearm shots

THE RIVALRIES
Valentine has feuded with every major star, using his physical style to create brutal matches.

THE CHAMPIONSHIPS
Multiple championship reigns prove Valentine's credentials as a top competitor.

THE LEGACY
Greg Valentine's physical style influenced generations of wrestlers who followed.

"The Hammer never rests."`,
  },
  {
    id: 'wre_685',
    title: 'Wendi Richter',
    icon: '👑',
    color: '#ec4899',
    anim: 'pulse',
    matchText: "Wendi Richter fights for women's wrestling.",
    body: `WENDI RICHTER

Wendi Richter is leading a revolution in women's wrestling, combining athleticism with mainstream appeal.

THE GIMMICK
Richter's all-American girl persona connects with young female fans while her in-ring skill earns respect from wrestling purists.

THE RIVALRIES
Her legendary feud with The Fabulous Moolah produced some of the most memorable women's matches in wrestling history.

THE MOVES
• Powerslam
• Dropkick
• Suplex variations
• Multiple pinning combinations

THE IMPACT
Richter's popularity helped bring women's wrestling to mainstream attention.

THE LEGACY
Wendi Richter proved that women's wrestling could draw money and capture audience imagination.

"Girls can wrestle too!"`,
  },
  {
    id: 'wre_686',
    title: 'Fabulous Moolah',
    icon: '👵',
    color: '#7c3aed',
    anim: 'pulse',
    matchText: 'The Fabulous Moolah defends her crown.',
    body: `THE FABULOUS MOOLAH

Mary "The Fabulous Moolah" Ellison has held the Women's Championship for decades, making her the most dominant female wrestler in history.

THE RECORD
Moolah's championship reign spanned nearly 30 years, an unprecedented record that may never be broken.

THE BACKGROUND
Moolah began wrestling in the 1950s and has trained countless female wrestlers, making her the matriarch of women's wrestling.

THE STYLE
Moolah combines technical wrestling with veteran savvy, using experience to overcome younger, more athletic opponents.

THE RIVALRIES
Her current feud with Wendi Richter represents a generational clash between old school and new school.

THE LEGACY
The Fabulous Moolah's influence on women's wrestling cannot be overstated.

"The queen never abdicates."`,
  },
  {
    id: 'wre_687',
    title: 'Big John Studd',
    icon: '🦣',
    color: '#1f2937',
    anim: 'pulse',
    matchText: 'Big John Studd challenges all comers.',
    body: `BIG JOHN STUDD

Big John Studd stands nearly 7 feet tall and weighs over 400 pounds, making him one of wrestling's most imposing figures.

THE GIMMICK
Studd's massive size and intimidating presence make him a natural heel who can bully smaller opponents.

THE RIVALRIES
His feud with Andre the Giant produced legendary battles between two of wrestling's largest competitors.

THE MOVES
• Big boot
• Powerslam
• Bear hug
• Multiple power moves

THE CHALLENGE
Studd has offered cash prizes to anyone who can bodyslam him, creating memorable moments.

THE LEGACY
Big John Studd proved that size alone could draw money in professional wrestling.

"Can you slam Studd?"`,
  },
  {
    id: 'wre_688',
    title: 'King Kong Bundy',
    icon: '🦍',
    color: '#1f2937',
    anim: 'pulse',
    matchText: 'King Kong Bundy demands a five-count.',
    body: `KING KONG BUNDY

King Kong Bundy weighs over 400 pounds and demands referees count to five instead of three when he pins opponents.

THE GIMMICK
Bundy's massive size and unique five-count demand make him a memorable heel who stands out from other big men.

THE MOVES
• Avalanche splash
• Big splash
• Powerslam
• Multiple power moves

THE RIVALRIES
Bundy has feuded with Hulk Hogan and other top babyfaces, using his size to create mismatches.

THE APPEAL
His combination of size and personality makes him a unique attraction in wrestling.

THE LEGACY
King Kong Bundy's five-count gimmick became one of wrestling's most memorable heel tactics.

"Five! Five! Five!"`,
  },
  {
    id: 'wre_689',
    title: 'Paul Orndorff',
    icon: '💪',
    color: '#dc2626',
    anim: 'pulse',
    matchText: 'Mr. Wonderful Paul Orndorff arrives.',
    body: `MR. WONDERFUL

Paul "Mr. Wonderful" Orndorff combines incredible physique with natural charisma, making him one of wrestling's most complete performers.

THE GIMMICK
Orndorff's "Mr. Wonderful" persona reflects his supreme confidence and impressive physical conditioning.

THE MOVES
• Piledriver
• Powerslam
• Suplex variations
• Multiple strength moves

THE RIVALRIES
Orndorff has feuded with Hulk Hogan, producing classic matches that drew huge houses.

THE PHYSIQUE
His muscular build and athletic ability make him one of wrestling's most physically impressive performers.

THE LEGACY
Paul Orndorff proved that complete packages-looks, skill, and charisma-could become top stars.

"Isn't that wonderful?"`,
  },
  {
    id: 'wre_690',
    title: 'Bob Orton',
    icon: '🤕',
    color: '#7c3aed',
    anim: 'pulse',
    matchText: 'Cowboy Bob Orton has his cast ready.',
    body: `COWBOY BOB ORTON

"Cowboy" Bob Orton is one of wrestling's most reliable heels, known for his technical skill and the cast he wears on his arm.

THE GIMMICK
Orton's cast, supposedly from an injury, becomes a weapon in matches, making him even more dangerous.

THE BACKGROUND
Orton comes from a wrestling family, with deep roots in the business that inform his technical style.

THE MOVES
• Superplex
• Cast shots
• Suplex variations
• Technical wrestling

THE RIVALRIES
Orton has aligned with Roddy Piper and Paul Orndorff, creating a formidable heel faction.

THE LEGACY
Bob Orton's technical skill and willingness to use weapons made him a valuable heel.

"The cast is loaded."`,
  },
  {
    id: 'wre_691',
    title: 'Jimmy Snuka',
    icon: '🤿',
    color: '#06b6d4',
    anim: 'bounce',
    matchText: 'Jimmy Superfly Snuka takes flight.',
    body: `SUPERFLY

Jimmy "Superfly" Snuka revolutionized wrestling with his high-flying style, bringing aerial attacks to mainstream audiences.

THE INNOVATION
Snuka's splash off the top of steel cages became iconic moments that influenced generations of high-flyers.

THE MOVES
• Superfly Splash - finishing move
• Top rope splash
• Multiple aerial attacks
• Headbutt

THE BACKGROUND
Snuka's Polynesian heritage informs his unique style and connection with nature.

THE RIVALRIES
His feud with Don Muraco produced legendary cage matches that are still discussed today.

THE LEGACY
Jimmy Snuka proved that high-flying wrestling could draw money and captivate audiences.

"Superfly is gonna fly!"`,
  },
  {
    id: 'wre_692',
    title: 'Don Muraco',
    icon: '🏝️',
    color: '#fbbf24',
    anim: 'pulse',
    matchText: 'Don Muraco brings the island style.',
    body: `THE MAGNIFICENT ONE

Don "The Magnificent" Muraco combines island charisma with brutal wrestling style, creating a unique heel persona.

THE GIMMICK
Muraco's Hawaiian persona and manager Captain Lou Albano create memorable heel chemistry.

THE MOVES
• Asian spike
• Powerslam
• Suplex variations
• Multiple power moves

THE RIVALRIES
His feud with Jimmy Snuka produced legendary cage matches that defined an era.

THE CHAMPIONSHIPS
Muraco has held multiple championships, proving his credentials as a top-tier competitor.

THE LEGACY
Don Muraco's combination of charisma and brutality made him a memorable heel.

"Magnificent, isn't it?"`,
  },
  {
    id: 'wre_693',
    title: 'Captain Lou Albano',
    icon: '🧢',
    color: '#1f2937',
    anim: 'pulse',
    matchText: 'Captain Lou Albano manages the madness.',
    body: `CAPTAIN LOU ALBANO

Captain Lou Albano is wrestling's most famous manager, known for his rubber band facial hair and loud personality.

THE ROLE
Albano manages multiple heel wrestlers, using interference and strategy to help his clients win.

THE LOOK
His trademark rubber bands hanging from his face and wild appearance make him instantly recognizable.

THE STRATEGY
Albano's interference and distractions have helped countless heels win championships.

THE CROSSOVER
His appearance in Cyndi Lauper's music videos brought wrestling to mainstream pop culture.

THE LEGACY
Captain Lou Albano defined the manager role in wrestling and helped bridge wrestling to mainstream entertainment.

"Captain's orders!"`,
  },
  {
    id: 'wre_694',
    title: 'Bobby Heenan',
    icon: '🧐',
    color: '#7c3aed',
    anim: 'pulse',
    matchText: 'Bobby Heenan has a new scheme.',
    body: `THE BRAIN

Bobby "The Brain" Heenan is considered the greatest manager in wrestling history, combining wit, strategy, and cowardice.

THE ROLE
Heenan manages multiple heels, using his intelligence and interference to help clients win.

THE WIT
Heenan's commentary and promos are legendary, combining humor with genuine heat-generating ability.

THE STABLE
The Heenan Family includes multiple top heels, creating a formidable faction that challenges top babyfaces.

THE RIVALRIES
Heenan has managed wrestlers against every major babyface, most notably Hulk Hogan.

THE LEGACY
Bobby Heenan set the standard for wrestling managers and influenced every manager who followed.

"The Brain always has a plan."`,
  },
  {
    id: 'wre_695',
    title: 'The War to Settle the Score',
    icon: '⚔️',
    color: '#dc2626',
    anim: 'pulse',
    matchText: 'The War to Settle the Score is coming!',
    body: `THE WAR TO SETTLE THE SCORE

The most anticipated wrestling event of the year is coming, featuring Hulk Hogan vs. Rowdy Roddy Piper.

THE BUILDUP
Months of tension between Hogan and Piper have led to this showdown, with the WWF Championship on the line.

THE STAKES
Hulk Hogan's championship and Hulkamania itself are on the line against Piper's relentless aggression.

THE UNDERCARD
Multiple championship matches and grudge matches round out the card, making it a complete wrestling event.

THE HYPE
Promotional buildup has been unprecedented, with Piper's Pit segments generating massive heat.

THE LEGACY
This event represents wrestling's evolution from regional attraction to national spectacle.

"Whatcha gonna do when Hulkamania runs wild on you?!"`,
  },
  {
    id: 'wre_696',
    title: 'WrestleMania',
    icon: '🏆',
    color: '#fbbf24',
    anim: 'pulse',
    matchText: 'WrestleMania is coming to a stadium near you!',
    body: `WRESTLEMANIA

The biggest event in wrestling history is coming, combining sports entertainment with celebrity spectacle.

THE CONCEPT
WrestleMania will combine wrestling matches with celebrity appearances, musical performances, and mainstream entertainment.

THE MAIN EVENT
Hulk Hogan and Mr. T will team up to face Roddy Piper and Paul Orndorff in the headline match.

THE CELEBRITIES
Mr. T, Cyndi Lauper, and other mainstream celebrities will participate, bridging wrestling to pop culture.

THE VENUE
Madison Square Garden will host the historic event, adding prestige to the spectacle.

THE STAKES
WrestleMania represents wrestling's bid to become mainstream entertainment, not just regional attraction.

THE LEGACY
If successful, WrestleMania could transform wrestling into a national phenomenon.

"The Showcase of the Immortals."`,
  },
  {
    id: 'wre_697',
    title: 'Saturday Night Main Event',
    icon: '📺',
    color: '#3b82f6',
    anim: 'pulse',
    matchText: 'Saturday Night Main Event brings wrestling to network TV.',
    body: `SATURDAY NIGHT'S MAIN EVENT

Wrestling comes to network television in prime time, bringing the spectacle to millions of homes.

THE FORMAT
Saturday Night's Main Event features championship matches, interviews, and storyline advancement in a network TV format.

THE IMPACT
Bringing wrestling to network television exposes the product to millions of new viewers.

THE STARS
Hulk Hogan, Roddy Piper, and other top stars appear in featured matches.

THE PRODUCTION
Network production values enhance wrestling's presentation, making it feel like major entertainment.

THE LEGACY
Saturday Night's Main Event proves wrestling can succeed on network television.

"Saturday night belongs to wrestling!"`,
  },
  {
    id: 'wre_698',
    title: 'WWF Championship',
    icon: '🥇',
    color: '#fbbf24',
    anim: 'pulse',
    matchText: 'The WWF Championship is on the line.',
    body: `THE WWF CHAMPIONSHIP

The most prestigious championship in wrestling, held by the biggest star in the business.

THE HISTORY
The WWF Championship has been held by legends including Bruno Sammartino, Bob Backlund, and now Hulk Hogan.

THE PRESTIGE
Holding the WWF Championship makes you the top star in wrestling, with all the responsibilities and rewards that brings.

THE DEFENSES
Championship defenses happen at major events, drawing huge crowds and generating massive revenue.

THE LINEAGE
Each champion adds to the title's prestige, creating a lineage that spans decades.

THE CURRENT CHAMPION
Hulk Hogan currently holds the title, defending it against all challengers.

THE LEGACY
The WWF Championship represents the pinnacle of professional wrestling achievement.

"And the NEWWWWW champion..."`,
  },
  {
    id: 'wre_699',
    title: 'The Wrestling Boom',
    icon: '💥',
    color: '#dc2626',
    anim: 'pulse',
    matchText: 'Professional wrestling is bigger than ever!',
    body: `THE WRESTLING BOOM

Professional wrestling is experiencing unprecedented popularity, with arenas selling out nationwide.

THE PHENOMENON
Wrestling has transcended its regional roots to become a national phenomenon, with stars becoming household names.

THE FACTORS
• Celebrity crossover appeal
• MTV music video appearances
• Saturday morning cartoons
• Merchandising explosion

THE STARS
Hulk Hogan, Roddy Piper, and Andre the Giant have become mainstream celebrities, not just wrestling stars.

THE MERCHANDISE
Wrestling merchandise-from action figures to t-shirts to posters-generates millions in revenue.

THE MAINSTREAM
Wrestling stars appear on talk shows, in movies, and in mainstream media.

THE FUTURE
The wrestling boom shows no signs of slowing, with bigger events and more mainstream crossover planned.

"Wrestling is everywhere!"`,
  },
  {
    id: 'wre_generic_family',
    title: 'Professional Wrestling Live',
    icon: '🎭',
    color: '#dc2626',
    anim: 'pulse',
    matchText: 'Bring the family out for an unforgettable evening.',
    body: `PROFESSIONAL WRESTLING LIVE - COMING TO YOUR AREA

Professional wrestling in 1984 is experiencing an unprecedented boom. Arenas that once hosted 3,000 fans are now selling out 15,000-seat buildings.

THE SHOW
A professional wrestling event is unlike anything else in sports entertainment. From the moment the first theme music hits, the crowd is transported into a world of heroes and villains, champions and challengers.

THE CARD
A typical 1984 card features:
• Opening matches with rising stars building their characters
• Mid-card title bouts for regional championships
• Grudge matches between long-running rivals
• The main event - often a championship match or blow-off to a major feud

THE ATMOSPHERE
Pyrotechnics, spotlight entrances, and elaborate ring gear make every appearance an event. The crowd noise at a peak moment - a hero making a comeback, a villain getting comeuppance - is electrifying.

THE STARS
In 1984, Hulk Hogan, Roddy Piper, Andre the Giant, Randy Savage, and Junkyard Dog are the biggest names. Seeing them live, larger than life, is a memory fans carry for decades.

THE FAMILY EXPERIENCE
Wrestling events attract families, teenagers, and adults of all ages. Children idolize the heroes; adults appreciate the athleticism; everyone goes home with a story to tell.

"You had to be there."`,
  },
  {
    id: 'wre_700',
    title: 'Cyndi Lauper & Wrestling',
    icon: '🎤',
    color: '#ec4899',
    anim: 'pulse',
    matchText: 'Cyndi Lauper brings rock and wrestling together.',
    body: `THE ROCK 'N' WRESTLING CONNECTION

Cyndi Lauper's involvement has brought wrestling to mainstream pop culture, creating the "Rock 'n' Wrestling Connection."

THE CROSSOVER
Lauper's music videos featuring wrestling stars have introduced wrestling to music fans nationwide.

THE STORYLINE
Lauper's feud with Captain Lou Albano, playing off his claims of managing her career, created mainstream interest.

THE IMPACT
The crossover has brought new fans to wrestling while giving wrestling stars mainstream exposure.

THE EVENTS
Wrestling events now feature musical performances, blending entertainment genres.

THE LEGACY
The Rock 'n' Wrestling Connection proved that wrestling could successfully crossover with mainstream entertainment.

"Girls just want to have fun... and wrestle!"`,
  },
];

const VIEWED_ENTRIES = new Set();

export function findNationalWrestlingEntry(adText) {
  return ENTRIES.find(e => e.matchText === adText) || null;
}

export function getNationalWrestlingEntry(id) {
  return ENTRIES.find(e => e.id === id) || null;
}

export function trackNationalWrestlingView(entryId) {
  VIEWED_ENTRIES.add(entryId);
  const unlocked = [];

  if (VIEWED_ENTRIES.size === 1) {
    unlocked.push('nat_wre_first');
  }
  if (VIEWED_ENTRIES.size === 5) {
    unlocked.push('nat_wre_5');
  }
  if (VIEWED_ENTRIES.size === 10) {
    unlocked.push('nat_wre_10');
  }
  if (VIEWED_ENTRIES.size === 25) {
    unlocked.push('nat_wre_all');
  }

  return unlocked;
}

export function getNationalWrestlingViewCount() {
  return VIEWED_ENTRIES.size;
}