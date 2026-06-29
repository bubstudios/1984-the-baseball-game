// National 1984 General Products & Americana Banner (#066–080)
// Single banner that opens ONE OF 15 random popup windows
// Structure: 13 real products + 2 culture windows, shuffled on each trigger

export const GENERAL_PRODUCTS_BANNER = {
  id: 'generalbanner_066',
  title: '🛍️ "Everyday Americana — take a stroll down memory lane!"',
  subtitle: '(warm nostalgia, "remember this?" wink)',
  icon: '🛍️',
  popups: [
    // ── WINDOW 01: KMART ──
    {
      num: 1,
        achievementId: 'nat_generalProducts_1',
      emoji: '🛒',
      title: 'KMART',
      tagline: '"Attention, shoppers..."',
      whatItWas: 'One of America\'s biggest retailers in 1984 — the discount-store giant where families bought everything from sneakers to lawn chairs to layaway Christmas gifts. The flashing "Blue Light Special" sent shoppers stampeding to a roped-off cart of markdowns announced over the PA.',
      howChanged: 'Kmart helped define modern American discount shopping — one big store, everything cheap, something for everyone. The Blue Light Special was retail theater, and "Attention, Kmart shoppers" entered the language.',
      howAged: 'The mighty Kmart eventually fades hard against newer discounters, shrinking from thousands of stores to a near-memory — a poignant symbol of how fast a retail giant can fall. In 1984, though, it\'s on top.',
      craze: 'The blue light itself, layaway, and the in-store café.',
      achievement: '🔵 "Blue Light Special"',
    },
    // ── WINDOW 02: SEARS & THE WISH BOOK ──
    {
      num: 2,
        achievementId: 'nat_generalProducts_2',
      emoji: '📖',
      title: 'SEARS & THE WISH BOOK',
      tagline: '"Where America shops"',
      whatItWas: 'The retail institution — Sears, Roebuck and Co., where generations bought their appliances, tools (Craftsman), linens, washing machines, and school clothes. And every fall came the enormous Christmas catalog ("the Wish Book"), the enormous Christmas catalog that kids dog-eared for months dreaming of toys.',
      howChanged: 'For a century Sears was the spine of American retail — you could once literally order a *house* from its catalog. In 1984 it\'s still a cornerstone of every mall and the Wish Book is a holiday ritual in millions of homes.',
      howAged: 'The catalog ends, the malls empty, and the once-unstoppable Sears dwindles to almost nothing — one of the great falls in American business history. But oh, that Wish Book.',
      craze: 'Circling toys in the Wish Book, the Craftsman lifetime warranty, and the in-store portrait studio.',
      achievement: '📖 "The Wish Book"',
    },
    // ── WINDOW 03: WOOLWORTH'S & THE FIVE-AND-DIME ──
    {
      num: 3,
        achievementId: 'nat_generalProducts_3',
      emoji: '🏪',
      title: 'WOOLWORTH\'S & THE FIVE-AND-DIME',
      tagline: '"The original five-and-dime"',
      whatItWas: 'The classic American variety store — Woolworth\'s lunch counter, candy by the scoop, parakeets and goldfish in the pet section, and a little bit of everything under one roof. The five-and-dime was a Main Street fixture for generations.',
      howChanged: 'Woolworths helped invent the idea of the affordable everything-store and the soda-fountain lunch counter where America met for a grilled cheese and a cherry Coke. By 1984 it\'s a nostalgic anchor of downtowns and malls alike.',
      howAged: 'The five-and-dime model dies out; Woolworth\'s closes its variety stores entirely within years, surviving only by reinventing itself as a sneaker company. The lunch counter becomes pure Americana.',
      craze: 'The lunch counter, the candy scoop, and the photo booth.',
      achievement: '☕ "Meet Me at the Counter"',
    },
    // ── WINDOW 04: McDONALD'S ──
    {
      num: 4,
        achievementId: 'nat_generalProducts_4',
      emoji: '🍔',
      title: 'McDONALD\'S',
      tagline: '"You deserve a break today"',
      whatItWas: 'The golden arches at the absolute peak of their cultural power — Big Macs, the Happy Meal (still a newish treat), the playland, and a Ronald McDonald cameo every kid knew on sight. In 1984 McDonald\'s even ran an Olympics promotion ("when the U.S. wins, you win") that became legendary.',
      howChanged: 'McDonald\'s standardized fast food for America and the world — fast, cheap, identical from coast to coast. By \'84 it\'s not just a restaurant, it\'s a landmark, a first job, and a birthday-party destination.',
      howAged: 'Only gets bigger, becoming one of the most recognized brands on the planet. The 1984 menu prices, though, will make you weep with nostalgia.',
      craze: 'The Happy Meal toy, the playland ball pit, and collecting the Olympic game pieces.',
      achievement: '🍔 "Two All-Beef Patties"',
    },
    // ── WINDOW 05: COCA-COLA (and the cola wars) ──
    {
      num: 5,
        achievementId: 'nat_generalProducts_5',
      emoji: '🥤',
      title: 'COCA-COLA (and the Cola Wars)',
      tagline: '"The choice of a new generation vs. the real thing"',
      whatItWas: 'THE COLA WARS — Coca-Cola and Pepsi battling for America\'s taste buds with massive ad campaigns and celebrity spokeseople. (Pepsi\'s megastar endorsement deals are the talk of the year.) The rivalry is a genuine cultural event. *(Note: the famous "New Coke" misfire is still a year away — in \'84, the classic formula reigns.)*',
      howChanged: 'The Cola Wars turned soft drinks into a lifestyle choice and pioneered the era of the blockbuster, celebrity-driven ad campaign. Picking Coke or Pepsi felt like picking a side.',
      howAged: 'The rivalry never ends — but 1985\'s "New Coke" disaster becomes the most famous marketing blunder in history, making the \'84 status quo look golden in hindsight.',
      craze: 'The taste-test challenge, the celebrity commercials, and the glass-bottle vending machine.',
      achievement: '🥤 "Pick a Side"',
    },
    // ── WINDOW 06: THE SHOPPING MALL ──
    {
      num: 6,
        achievementId: 'nat_generalProducts_6',
      emoji: '🏬',
      title: 'THE SHOPPING MALL',
      tagline: '"Meet you at the food court"',
      whatItWas: 'In 1984 the enclosed shopping mall is the absolute center of American social life — especially for teenagers. Anchor department stores at each end, a fountain in the middle, an arcade, a record store, a cookie stand, and the food court where everyone hung out. The mall **was** the hangout.',
      howChanged: 'The mall reshaped how Americans shopped and socialized — a climate-controlled town square where you spent your whole Saturday. "Mall culture" defined teen life in the \'80s.',
      howAged: 'The great American mall booms for another decade, then slowly empties out as shopping moves elsewhere — the "dead mall" becomes a melancholy symbol. In 1984, it\'s thriving and packed.',
      craze: 'The food court, the arcade, hanging out with no money, and the photo booth.',
      achievement: '🏬 "Meet at the Food Court"',
    },
    // ── WINDOW 07: CABBAGE PATCH KIDS ──
    {
      num: 7,
        achievementId: 'nat_generalProducts_7',
      emoji: '🧸',
      title: 'CABBAGE PATCH KIDS',
      tagline: '"Adopt one today (if you can find one)"',
      whatItWas: 'The toy craze that defined the 1983–84 holiday seasons — soft-sculpture dolls, each with its own name and "adoption papers" that parents fought over (sometimes literally) in toy aisles. Demand so wildly outstripped supply that the shortage made national news.',
      howChanged: 'The Cabbage Patch frenzy became the template for the modern holiday "must-have" toy panic — the empty shelves, the scalping, the parking-lot scuffles all became an annual tradition it pioneered.',
      howAged: 'The dolls stick around, but the "mania" of \'83–\'84 is remembered as one of the great toy crazes of all time — peak \'80s consumer fever.',
      craze: 'The adoption certificate, the unique name, and the great toy-aisle scramble.',
      achievement: '🧸 "Adoption Papers"',
    },
    // ── WINDOW 08: RUBIK'S CUBE & FAD TOYS ──
    {
      num: 8,
        achievementId: 'nat_generalProducts_8',
      emoji: '🧩',
      title: 'RUBIK\'S CUBE & FAD TOYS',
      tagline: '"Six sides, one solution, endless frustration"',
      whatItWas: 'The maddening little color-matching puzzle-cube that became a worldwide obsession in the early \'80s and is still rattling around every junk drawer, car console, and classroom in 1984. A few kids could solve it; everyone else peel the stickers.',
      howChanged: 'The Rubik\'s Cube was a global phenomenon — a simple object that became a genuine craze, spawning solution books, speed-cubing competitions, and a cartoon. It made "puzzle" a fad.',
      howAged: 'Becomes a timeless icon — instantly recognizable forever as shorthand for the early \'80s, and speed-cubing grows into a real competitive sport.',
      craze: 'Solution booklets, peeling the stickers to "win," and the kid who could do it behind his back.',
      achievement: '🧩 "Solve the Cube"',
    },
    // ── WINDOW 09: TRAPPER KEEPER & BACK-TO-SCHOOL ──
    {
      num: 9,
        achievementId: 'nat_generalProducts_9',
      emoji: '📁',
      title: 'TRAPPER KEEPER & BACK-TO-SCHOOL',
      tagline: '"Get it together"',
      whatItWas: 'The must-have back-to-school item — a colorful three-ring binder with a Velcro flap that "trapped" your folders so nothing fell out, decked in wild airbrushed designs (unicorns, race cars, geometric neon). Paired with mechanical pencils, scratch-and-sniff stickers, and a brand new pair of high-tops, it was back-to-school royalty.',
      howChanged: 'The Trapper Keeper organized a generation of students and became a genuine status symbol in the school hallway — your binder said something about you. Pure \'80s.',
      howAged: 'A pure nostalgia icon of \'80s and \'90s school days, fondly remembered (Velcro *rip* and all).',
      craze: 'The loudest possible design, the satisfying Velcro sound, and scratch-and-sniff stickers.',
      achievement: '📁 "Get It Together"',
    },
    // ── WINDOW 10: JELLY SHOES, PARACHUTE PANTS & '84 FASHION ──
    {
      num: 10,
        achievementId: 'nat_generalProducts_10',
      emoji: '👟',
      title: 'JELLY SHOES, PARACHUTE PANTS & \'84 FASHION',
      tagline: '"Totally rad, head to toe"',
      whatItWas: 'The look of 1984: parachute pants with a hundred zippers, jelly shoes, leg warmers, neon everything, fingerless gloves, popped collars, big hair, and a single sequined glove (you know the one). Fashion was loud, bright, and unapologetic.',
      howChanged: '\'80s fashion was a full-on cultural statement — bold, playful, and instantly dated in the best way. What you wore signaled your music, your scene, your whole vibe.',
      howAged: 'Endlessly mocked, then endlessly revived — \'80s style becomes one of the most recognizable (and recyclable) fashion eras ever. Neon never truly dies.',
      craze: 'Parachute pants, jelly shoes, leg warmers, and the one glove.',
      achievement: '👟 "Totally Rad"',
    },
    // ── WINDOW 11: TUPPERWARE & AVON (the home-party economy) ──
    {
      num: 11,
        achievementId: 'nat_generalProducts_11',
      emoji: '🍴',
      title: 'TUPPERWARE & AVON (the home-party economy)',
      tagline: '"Ding dong, the party\'s here"',
      whatItWas: 'Before online shopping, there was the home party. The Tupperware party (burp those airtight lids!) and the Avon lady ringing the doorbell with the lipstick samples were pillars of suburban life — a social event *and* a shopping trip, run largely by women building their own businesses.',
      howChanged: 'These direct-sales empires put products in homes and gave countless women an income and a social network, decades before "side hustle" was a phrase. The Tupperware party was a genuine institution.',
      howAged: 'The home-party model fades as shopping moves to stores and screens, but the brands and the memory of "the Avon lady" endure as pure suburban Americana.',
      craze: 'The burping lid, the catalog flip-through, and the hostess gift.',
      achievement: '🍴 "Burp the Lid"',
    },
    // ── WINDOW 12: THE POLAROID INSTANT CAMERA ──
    {
      num: 12,
        achievementId: 'nat_generalProducts_12',
      emoji: '📷',
      title: 'THE POLAROID INSTANT CAMERA',
      tagline: '"The picture develops before your eyes"',
      whatItWas: 'Point, click, and *whirr* — out slides a photo that develops in your hand while you shake it (you weren\'t supposed to shake it, but everyone did). Instant gratification in an age of waiting a week for the drugstore to develop your film.',
      howChanged: 'The Polaroid made photography immediate and social — pass it around the party the second it\'s taken. It was the closest thing to instant photos the world had, and it felt like magic.',
      howAged: 'Digital and then phone cameras make "instant" universal. Polaroid\'s distinctive white-bordered square becomes a beloved retro icon — and the cameras come roaring back on pure nostalgia.',
      craze: 'Shaking the photo (don\'t!), the white-frame look, and watching it appear.',
      achievement: '📷 "Shake It"',
    },
    // ── WINDOW 13: TV DINNERS & SUPERMARKET AMERICA ──
    {
      num: 13,
        achievementId: 'nat_generalProducts_13',
      emoji: '📺',
      title: 'TV DINNERS & SUPERMARKET AMERICA',
      tagline: '"Dinner in minutes"',
      whatItWas: 'The frozen TV dinner in its compartmentalized tray and the increasingly common microwave oven that zapped it hot in minutes — convenience food at its peak. Salisbury steak, a scoop of corn, mashed potatoes, and a sad little brownie, all eaten on a folding tray in front of the TV.',
      howChanged: 'Frozen convenience foods and the microwave transformed the American kitchen and the family dinner — fast, easy, no cooking required. The microwave went from luxury to near-standard in this era.',
      howAged: 'Convenience food only grows, for better and worse; the classic compartment tray becomes a nostalgic icon of \'80s suburban dinners.',
      craze: 'Peeling back the foil, the spinning microwave turntable, and eating in front of the TV.',
      achievement: '📺 "Dinner in Minutes"',
    },
    // ── WINDOW 14: THE VIDEO RENTAL STORE ──
    {
      num: 14,
        achievementId: 'nat_generalProducts_14',
      emoji: '📼',
      title: 'THE VIDEO RENTAL STORE',
      tagline: '"Friday night starts here"',
      whatItWas: 'The neighborhood video-rental shop, booming alongside the VCR — walls of VHS boxes, the new-releases section everyone crowded the aisles of, the candy rack at the counter, and the eternal hope that the one movie you wanted wasn\'t already checked out. "Be kind, rewind" or pay the fee.',
      howChanged: 'The video store made the whole history of movies available for a few bucks a night and turned "renting a movie" into a beloved weekend ritual — browsing the aisles was half the fun.',
      howAged: 'Streaming wipes out the video store almost entirely, making the Friday-night browse a fondly-mourned memory. In 1984 it\'s brand-new, thriving, and a cultural phenomenon.',
      craze: 'The new-releases wall, the rewind fee, and judging a movie by its box art.',
      achievement: '📼 "Friday Night Rental"',
    },
    // ── WINDOW 15: EVERYDAY AMERICANA, 1984 (non-product) ──
    {
      num: 15,
        achievementId: 'nat_generalProducts_15',
      emoji: '🇺🇸',
      title: 'THE TEXTURE OF 1984',
      tagline: '"The little things you\'ll miss"',
      whatItWas: '(No single product — a window about the culture) The scene: It\'s the small stuff that makes 1984 feel like 1984. The mailbox flag. The phone with a cord long enough to stretch into the next room. Saturday-morning cartoons you actually had to wake up for. The jingle of the ice-cream truck. Gas under a buck-thirty a gallon. Penny candy at the corner store. Drive-in movies hanging on. The TV with exactly the channels the antenna could pull in, and a kid assigned to be the "remote control." Why it matters: This is the everyday America of the 1984 ballgame lives inside — a slower, more analog world where you waited for things, called a time-and-temperature line, and ran to catch a show because there was no recording it. It\'s the warm, ordinary backdrop to a summer at the ballpark.',
      howChanged: 'N/A',
      howAged: 'Almost all of it swept away by the digital age — which is exactly why it glows so warm in the memory. Step back into it for nine innings.',
      craze: 'N/A',
      achievement: '🇺🇸 "The Good Old Days"',
    },
  ],
  achievementId: 'generalproductsbanner_066',
};

// Category achievements:
// 🛍️ **[Item]** — see each of the 15 windows (one achievement per window)
// 🛍️ **All-American** — discover all 15 General Products windows
// 🏪 **Mall Rat** — see any 5 windows
// 🏢 **Gone but Not Forgotten** (hidden) — find the three now-defunct-retail windows: Kmart (#01), Sears (#02), and Woolworth's (#03)
// 🇺🇸 **Time Capsule '84** — see the closing "Texture of 1984" culture window (#15)