// National 1984 Electronics & Computers Banner (#051–065)
// Single banner that opens ONE OF 15 random popup windows
// Structure: 13 real products + 2 culture windows, shuffled on each trigger

export const ELECTRONICS_COMPUTERS_BANNER = {
  id: 'electronbanner_051',
  title: '📺 "The future is now — step into the Electronics & Computer Center!"',
  subtitle: '(nostalgic "gee-whiz" tech ad meets retroactive wink)',
  icon: '💻',
  popups: [
    // ── WINDOW 01: COMMODORE 64 ──
    {
      num: 1,
      emoji: '🖥️',
      title: 'COMMODORE 64',
      price: '~$200 (down from $595 at its 1982 launch — the price war is ON)',
      specs: '1 MHz 6510 processor · 64 KB RAM · 16 colors · the legendary SID sound chip · plugs right into your TV.',
      howChanged: 'The Commodore 64 is the people\'s computer — cheap enough for a regular family, powerful enough for real games and programs. Kids are learning BASIC, dialing into bulletin boards, and trading games on cassette and floppy. It\'s selling by the millions and putting a real computer in the den.',
      howAged: 'It\'ll become the best-selling single computer model of all time — a genuine legend. That SID chip\'s music is still revered decades later.',
      craze: 'Type-in program listings from magazines (hours of typing for one game), the 1541 disk drive, and a software explosion.',
      achievement: '💾 "64K of Power"',
    },
    // ── WINDOW 02: APPLE IIe ──
    {
      num: 2,
      emoji: '🍎',
      title: 'APPLE IIe',
      price: '~$1,400 (a full setup with monitor and drive runs more)',
      specs: '1 MHz 6502 · 64 KB RAM (expandable) · full keyboard · the open-slot design programmers love.',
      howChanged: 'The IIe is the schoolhouse computer — if you learned on a computer in 1984, odds are it was an Apple in a classroom, teaching typing, math drills, and a certain wagon-trail game about dysentery. It made Apple a household name before the Mac arrived.',
      howAged: 'The Apple II line runs for years andcements Apple\'s foothold in education — a foundation the company never forgets.',
      craze: 'Educational software, the floppy-disk swap, and that distinctive startup beep.',
      achievement: '🏫 "Head of the Class"',
    },
    // ── WINDOW 03: APPLE MACINTOSH ──
    {
      num: 3,
      emoji: '🖱️',
      title: 'APPLE MACINTOSH',
      price: '~$2,495',
      specs: '8 MHz Motorola 68000 · 128 KB RAM · 9-inch black-and-white screen · 3.5-inch floppy · and the thing nobody else has — a **mouse** and a point-and-click desktop.',
      howChanged: 'Launched in January 1984 with a now-legendary single Super Bowl ad, the Mac introduced everyday people to the graphical interface — windows, icons, a mouse — instead of typing commands. It\'s expensive and underpowered for now, but it\'s a glimpse of how *everyone* will use computers. The mouse-and-windows idea it popularized becomes how the entire world computes. A genuine turning point.',
      howAged: 'The house and windows idea becomes the architecture the whole industry is built on. The mouse is still there, clicking away.',
      craze: 'That one Super Bowl ad and everybody\'s still talking about it; MacPaint doodles; the friendly smiling-computer startup.',
      achievement: '🖱️ "Point and Click"',
    },
    // ── WINDOW 04: RADIO SHACK TANDY 1000 ──
    {
      num: 4,
      emoji: '🖥️',
      title: 'RADIO SHACK TANDY 1000',
      price: '~$1,200',
      specs: 'Intel 8088 · 128 KB RAM · runs MS-DOS software · improved graphics and sound built in.',
      howChanged: 'How it changed life**: Brand new for late 1984, the Tandy 1000 makes IBM-PC computing affordable and brings it to every mall in America through Radio Shack\'s thousands of stores. For a lot of families, the local Radio Shack is where they meet their first "serious" computer.',
      howAged: 'Becomes a hugely popular home PC and a staple of late-\'80s computing, with its enhanced graphics ("Tandy graphics") supported by tons of games.',
      craze: 'The Radio Shack catalog as wish-book; the helpful (sometimes too helpful) store clerk.',
      achievement: '🏪 "Trust the Shack"',
    },
    // ── WINDOW 05: ATARI 800XL ──
    {
      num: 5,
      emoji: '🎮',
      title: 'ATARI 800XL',
      price: '~$200–$250',
      specs: '1.8 MHz 6502 · 64 KB RAM · superb-for-its-time graphics and sound chips · sleek new XL styling.',
      howChanged: 'How it changed life**: Atari\'s late entry into home computing pairs the company\'s arcade pedigree with a real keyboard, making it a favorite for gaming *and* learning to program. It\'s locked in the great home-computer price war with Commodore, and players win.',
      howAged: 'A beloved machine of the 8-bit era, fondly remembered by a generation of gamers and tinkerers — though Atari\'s fortunes are about to get rocky.',
      craze: 'Cartridge and cassette games, the joystick everyone recognizes, and arcade ports at home.',
      achievement: '🎮 "Have You Played Atari Today?"',
    },
    // ── WINDOW 06: THE VCR (HOME VIDEO) ──
    {
      num: 6,
      emoji: '📼',
      title: 'THE VCR (HOME VIDEO)',
      price: '~$400–$800 for a decent deck',
      specs: 'VHS (the format that\'s winning) vs. Betamax (the one losing) · records broadcast TV on tape · wired remote if you\'re lucky.',
      howChanged: 'The VCR rewires how America watches television — you can finally *time-shift*, recording a show to watch later, and the corner video-rental store is becoming a weekend ritual. Movie night moved into the living room.',
      howAged: '"Be kind, rewind" defines an era. The VHS-vs-Betamax format war becomes the textbook example of the better-marketed product winning over the (arguably) better tech.',
      craze: 'Blank-tape stockpiling, the blinking "12:00" nobody could set, and Friday-night trips to the rental shop.',
      achievement: '📼 "Be Kind, Rewind"',
    },
    // ── WINDOW 07: THE SONY WALKMAN ──
    {
      num: 7,
      emoji: '🎧',
      title: 'THE SONY WALKMAN',
      price: '~$50–$150 depending on model',
      specs: 'Pocket-ish portable cassette player · feather-light headphones · play your own mixtapes anywhere.',
      howChanged: 'The Walkman made music *personal and portable* for the first time — a private soundtrack for the walk, the jog, the bus. By 1984 it\'s a full-blown cultural phenomenon and the must-have accessory of the decade.',
      howAged: '"Walkman" becomes the generic word for personal music players, and the idea — music in your pocket, just for you — never goes away; it just keeps getting smaller.',
      craze: 'The mixtape as a love letter, hunting for the perfect headphones, and clipping it to your belt.',
      achievement: '🎵 "Press Play"',
    },
    // ── WINDOW 08: THE BOOMBOX ──
    {
      num: 8,
      emoji: '📻',
      title: 'THE BOOMBOX',
      price: '~$80–$300 (the bigger, the better)',
      specs: 'Dual cassette deck (for dubbing tapes!) · AM/FM · big speakers · D-batteries by the fistful.',
      howChanged: 'If the Walkman is music *for you*, the boombox is music *for everyone within a block*. Shoulder-mounted and proud, it\'s the soundtrack of the streets, the park, and the breakdancing circle — and dual decks mean you can copy your buddy\'s tape.',
      howAged: 'The boombox becomes a pure icon of \'80s street culture, forever tied to the era\'s music and style.',
      craze: 'Dubbing mixtapes, the breakdancing cardboard-and-boombox setup, and how many batteries it ate.',
      achievement: '📻 "Pump Up the Volume"',
    },
    // ── WINDOW 09: THE NINTENDO ARCADE & HOME-GAME WORLD ──
    {
      num: 9,
      emoji: '🕹️',
      title: 'VIDEO GAMES, 1984',
      price: 'Arcade: a quarter a play · home cartridges: ~$20–$40',
      specs: 'The arcade is king — but the home console market just *crashed* hard in 1983, leaving living rooms quiet. (Spoiler: a little Japanese company\'s new machine is about to revive the whole thing.)',
      howChanged: 'In 1984 the arcade is still the social hub — neighborhood kids feeding quarters into cabinets, chasing high scores with their initials. The home-console business, though, has collapsed after a flood of bad games, and nobody\'s sure if it\'ll come back. (Spoiler: a little Japanese company\'s new machine is about to revive the whole thing.)',
      howAged: 'The 1983 crash gives way to a massive home-console revival — the comeback is right around the corner, and gaming becomes one of the biggest entertainment industries on earth.',
      craze: 'High-score initials, the arcade as hangout, and the great "is home gaming dead?" panic of \'84.',
      achievement: '🕹️ "High Score"',
    },
    // ── WINDOW 10: THE COMPACT DISC (CD) ──
    {
      num: 10,
      emoji: '💿',
      title: 'THE COMPACT DISC (CD)',
      price: 'Players ~$700–$1,000 (early-adopter money); discs ~$15–$20',
      specs: 'A shiny 5-inch digital disc read by a laser · no hiss, no pops, no rewinding · skip to any track instantly.',
      howChanged: 'How it changed life**: Brand new to most American homes, the CD promises pristine digital sound that never wears out — a radical shift from scratchy records and stretchy tapes. In 1984 it\'s a pricey luxury for audiophiles, but the writing\'s on the wall for vinyl and cassette.',
      howAged: 'Within a few years the CD takes over the music world completely. (And yes — decades later, vinyl comes roaring back out of pure nostalgia. Nobody saw *that* coming in \'84.)',
      craze: 'Marveling that you could smear jam on one and it still play (please don\'t), and the thrill of instant track-skipping.',
      achievement: '💿 "Perfect Sound"',
    },
    // ── WINDOW 11: THE IBM PC & PCJr ──
    {
      num: 11,
      emoji: '🖥️',
      title: 'THE IBM PC & PCJr',
      price: 'IBM PC: ~$2,000–$4,000+ · PCJr (the home version): ~$1,300',
      specs: 'Intel 8088 · MS-DOS · the business-world standard — the PCJr tries (and stumbles) that keyboard!), but the PC standard it represents will dominate computing for decades.',
      howChanged: 'How it changed life**: The IBM PC is the serious computer — the one in offices, the one that made "PC compatible" the standard everyone else copies. IBM\'s 1984 try at the home market, the PCJr, stumbles (that keyboard!), but the PC standard it represents will dominate computing for decades.',
      howAged: '"IBM compatible" / "PC compatible" becomes the architecture the whole industry is built on. The PCJr, though, is a famous flop — a cautionary tale.',
      craze: 'Lotus 1-2-3 spreadsheets, the beige-box PC aesthetic, and that clacky keyboard everyone secretly loved (except the PCJr\'s).',
      achievement: '🖥️ "Means Business"',
    },
    // ── WINDOW 12: THE CAMCORDER ──
    {
      num: 12,
      emoji: '🎥',
      title: 'THE CAMCORDER',
      price: '~$1,000–$1,500 (a big-ticket splurge)',
      specs: 'Camera + recorder in one shoulder-hoisted unit · records straight to videotape · a battery that dies right before the birthday cake.',
      howChanged: 'For the first time, regular families can shoot their own movies — birthdays, recitals, vacations, the dog doing something dumb — and watch them on the TV that night. It turns everyone into a home-movie director (and a few into shaky cinematographers).',
      howAged: 'Home video becomes a permanent part of family life; the shoulder-cam shrinks year after year until it fits in a pocket — and then into a phone.',
      craze: 'Taping everything, the wobbly zoom, and the dreaded red "REC" light always on at the wrong moment.',
      achievement: '🎥 "Lights, Camera, Action"',
    },
    // ── WINDOW 13: THE DIGITAL & CALCULATOR WATCH ──
    {
      num: 13,
      emoji: '⌚',
      title: 'THE DIGITAL & CALCULATOR WATCH',
      price: '~$25–$70 (calculator models a bit more)',
      specs: 'LCD digital display · stopwatch · alarm · and on the fancy ones, a tiny calculator keypad you press with your fingernail.',
      howChanged: 'The digital watch made you feel like you were living in the future, and the calculator watch made you the most prepared kid in math class (if you could hit those microscopic buttons). Loaded with beeping features nobody fully used.',
      howAged: 'A pure \'80s gadget-nostalgia icon — the calculator watch is shorthand for the era\'s tech-on-everything optimism.',
      craze: 'Setting hourly beeps that drove teachers crazy, and the great fingernail-button struggle.',
      achievement: '⌚ "Future on Your Wrist"',
    },
    // ── WINDOW 14: HOME-TECH CULTURE (NON-PRODUCT) ──
    {
      num: 14,
      emoji: '🏡',
      title: 'THE WIRED-UP HOME, 1984',
      price: 'N/A (but your family electric bill just went up)',
      specs: 'N/A',
      howChanged: 'The American living room in 1984 is filling up with glowing boxes. There\'s the family computer humming in the den, the VCR blinking "12:00" under the TV, a Walkman on every teenager, a boombox on every stoop, and a tangle of cables behind everything. Personal technology has gone from science-fiction to suburban. The seeds of the whole connected, gadget-filled future are being planted right here, in dens and rec rooms across the country.',
      howAged: 'Everything in that 1984 living room eventually merges into a single device that fits in your pocket. But the *feeling* — wonder at what these machines can do — starts now.',
      craze: 'Welcome to the future.',
      achievement: '🏡 "Welcome to the Future"',
    },
    // ── WINDOW 15: THE BULLETIN BOARD & THE MODEM (NON-PRODUCT) ──
    {
      num: 15,
      emoji: '📞',
      title: 'THE BULLETIN BOARD & THE MODEM',
      price: 'A 300-baud modem ~$100–$300',
      specs: 'Plug a modem into your home computer, dial a local phone number with a screech of static, and slowly, one character at a time — you\'re connected to a "bulletin board system" run by some hobbyist in his basement across town. Post messages, swap files, play text games, tie up the family phone line for hours.',
      howChanged: 'Why it matters**: This is the ancestor of everything *talking to each other* — community, messages, and software shared over the phone lines. The whole connected world grows from this seed.',
      howAged: 'That screechy dial-up handshake and "please don\'t pick up the phone!" becomes a defining memory — and the BBS grows up into the global internet.',
      craze: 'Local BBS culture, ASCII art, and the agonies of a download dropping at 98%.',
      achievement: '📡 "Dialing In"',
    },
  ],
  achievementId: 'electronicsbanner_051',
};

// Category achievements:
// 💻 **[Product]** — tap the window for each product (13 achievements for products #1–13)
// 🏡 **Silicon Dreams** — discover all 15 Electronics & Computer windows
// 👨‍💼 **Early Adopter** — see any 5 windows
// 🔮 **Future Shock** (hidden) — find both non-product "culture" windows (#14 Wired-Up Home, #15 Modems/BBS)
// 📱 **Format War Veteran** — tap both the VCR (#06) and CD (#10) windows (the two great format battles)