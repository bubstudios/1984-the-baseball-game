// 25 interactive Red Sox banner popups
// Each entry matches a banner text from broadcastAds.js (Red Sox-specific ads)

const ENTRIES = [
  // ── 1. Bobblehead Night (random rotation of 5 players) ──
  {
    id: 'sox_01',
    category: 'promo',
    icon: '🎯',
    color: '#bd3039',
    matchText: "The Red Sox continue their homestand tomorrow at Fenway Park.",
    title: 'Bobblehead Night at Fenway',
    isRotation: true,
    rotation: [
      {
        player: 'Wade Boggs',
        position: '3B',
        icon: '⚾',
        body: `Tonight's giveaway: the Wade Boggs Bobblehead!

Wade Boggs is hitting .351 this season, chasing another batting title. The chicken-eating, left-handed hitting machine has become a Fenway favorite.

The first 10,000 fans receive a limited-edition Boggs bobblehead, complete with his trademark crouch and mustache.

"I just try to hit line drives and let the chips fall where they may." — Wade Boggs

Fun Fact: Boggs eats chicken before every game and has a specific routine he follows religiously.`,
      },
      {
        player: 'Jim Rice',
        position: 'LF',
        icon: '💪',
        body: `Tonight's giveaway: the Jim Rice Bobblehead!

Jim "Ed" Rice is one of the most feared sluggers in the American League, driving in runs at a remarkable pace.

The first 10,000 fans receive a Jim Rice bobblehead, featuring his powerful left-handed stance and the famous #14.

Rice is on pace for another 100+ RBI season, anchoring the Red Sox lineup.

"He's the kind of hitter who makes pitchers nervous just stepping into the box." — Ned Martin`,
      },
      {
        player: 'Dennis Boyd',
        position: 'RHP',
        icon: '🔥',
        body: `Tonight's giveaway: the Dennis "Oil Can" Boyd Bobblehead!

Dennis Boyd, known as "Oil Can" for his smooth pitching style, is one of the most exciting arms in the Red Sox rotation.

The first 10,000 fans receive a Dennis Boyd bobblehead, complete with his signature delivery and intensity on the mound.

Boyd brings passion and fire to the Red Sox lineup, and the Fenway faithful love his competitive spirit.

"Oil Can is the future of Red Sox pitching." — Red Sox broadcaster`,
      },
      {
        player: 'Dwight Evans',
        position: 'RF',
        icon: '🧤',
        body: `Tonight's giveaway: the Dwight Evans Bobblehead!

"Dewey" Evans combines power at the plate with one of the best outfield arms in baseball.

The first 10,000 fans receive a Dwight Evans bobblehead, featuring his cannon arm and right-field stance.

Evans is a Gold Glove-caliber defender who can also hit 20+ home runs in a season.

"Nobody runs on Dewey. Nobody." — Fenway faithful`,
      },
      {
        player: 'Carlton Fisk',
        position: 'C',
        icon: '🧢',
        body: `Tonight's giveaway: the Carlton Fisk Bobblehead!

"Pudge" Fisk is a Red Sox icon, known for his leadership behind the plate and his famous home run wave.

The first 10,000 fans receive a Carlton Fisk bobblehead, complete with his catcher's gear and the iconic #27.

Fisk is one of the best catchers in baseball history, and Fenway fans will never forget his 1975 World Series heroics.

"He waved it fair. He waved it fair!" — One of the great calls in baseball history.`,
      },
    ],
    achievement: 'sox_bobblehead_collector',
  },
  // ── 2. Team Poster ──
  {
    id: 'sox_02',
    category: 'promo',
    icon: '🖼️',
    color: '#bd3039',
    matchText: "The first 15,000 fans receive a Red Sox team poster.",
    title: 'You Got Your Poster!',
    body: `Congratulations! You were one of the first 15,000 fans through the gates at Fenway Park today.

Your official 1984 Red Sox Team Poster features the full roster in their home whites, posed in front of the Green Monster.

The poster measures 24" x 36" and is suitable for framing. Hang it proudly in your bedroom, dorm room, or office.

Featured players include:
• Wade Boggs — 3B
• Jim Rice — LF
• Dwight Evans — RF
• Carlton Fisk — C
• Roger Clemens — RHP
• And the rest of the 1984 Red Sox!

"First 15,000 fans only. Limit one per person. No rain checks."`,
    achievement: 'sox_poster_collector',
  },
  // ── 3. Souvenir Stand ──
  {
    id: 'sox_03',
    category: 'promo',
    icon: '🛍️',
    color: '#bd3039',
    matchText: "Stop by the souvenir stands for official Red Sox merchandise.",
    title: 'Fenway Souvenir Stand',
    body: `Official Red Sox merchandise available at concession stands throughout the ballpark:

⚾ Official Red Sox Baseball Cap — $8.50
⚾ Red Sox Home Jersey (replica) — $32.00
⚾ Fenway Park Pennant — $3.50
⚾ 1984 Red Sox Yearbook — $3.00
⚾ Red Sox Bat (mini) — $2.50
⚾ Red Sox Bat (full-size Louisville Slugger) — $18.00
⚾ "Green Monster" T-Shirt — $9.00
⚾ Red Sox Bumper Sticker — $1.50
⚾ Foam Finger — $4.00
⚾ Red Sox Trading Cards (team set) — $2.00
⚾ Pennant (large) — $5.00
⚾ Red Sox Coffee Mug — $6.50

Oddball items:
⚾ "Curse of the Bambino" Voodoo Doll — $7.99 (we don't talk about this)
⚾ Pet Rock painted Red Sox red — $3.00 (yes, really)
⚾ "I Survived a Yankees Series at Fenway" T-Shirt — $11.00
⚾ Red Sox-branded Rubik's Cube — $5.50 (solve it and the Curse is lifted, allegedly)
⚾ Autographed baseball by the hot dog vendor — $0.25 (he's very proud)

Cash and checks accepted. No credit cards. Please form an orderly line.`,
  },
  // ── 4. Youth Baseball Clinics ──
  {
    id: 'sox_04',
    category: 'community',
    icon: '⚾',
    color: '#0c2340',
    matchText: "Youth baseball clinics continue across New England.",
    title: 'Red Sox Youth Baseball Clinics',
    body: `The Boston Red Sox sponsor youth baseball clinics throughout New England all summer long.

Clinics are open to boys and girls ages 8-16 and are led by former Red Sox players and local coaches.

Locations this summer:
• Boston Common (Saturdays, 9 AM)
• Franklin Park (Sundays, 10 AM)
• Cambridge Common (Wednesdays, 4 PM)
• Lynn Woods Reservation (Tuesdays, 4 PM)
• Worcester's Elm Park (Thursdays, 4 PM)
• Providence, RI — Roger Williams Park (Saturdays)
• Hartford, CT — Bushnell Park (Sundays)
• Portland, ME — Deering Oaks (Saturdays)
• Manchester, NH — Derryfield Park (Sundays)
• Burlington, VT — Waterfront Park (Saturdays)

New England Little League World Series History:
• 1976 — Belmont, MA reached the LLWS
• 1980 — Bristol, CT (Eastern Region champs)
• 1981 — Williston, VT (New England champs)
• 1982 — Worcester, MA (New England champs)
• 1983 — Bristol, CT (New England champs)

Registration is $15 per child and includes a Red Sox t-shirt and cap. Call the Red Sox Community Relations office for details.`,
  },
  // ── 5. Support Local Baseball ──
  {
    id: 'sox_05',
    category: 'community',
    icon: '🏟️',
    color: '#0c2340',
    matchText: "Support local baseball programs throughout Massachusetts.",
    title: 'Massachusetts Baseball Programs',
    body: `The Red Sox encourage fans to support local baseball programs throughout the Commonwealth of Massachusetts.

Little League Programs:
• District 4 (Greater Boston) — 47 leagues, 6,200+ players
• District 6 (North Shore) — 32 leagues
• District 8 (South Shore) — 28 leagues
• District 11 (Western MA) — 19 leagues
• District 14 (Cape Cod) — 15 leagues

Notable Massachusetts Little League programs:
• South Burlington LL (1976 New England champs)
• Worcester LL (1982 New England champs)
• Pittsfield LL (multiple state titles)
• Newton Southeast LL (perennial contender)
• Braintree American LL (strong tradition)

Babe Ruth Baseball (ages 13-15):
• Over 60 programs statewide
• State tournament held each July
• Winners advance to regional play

American Legion Baseball (ages 16-19):
• 40+ posts field teams
• State tournament in August
• Post 4 (Worcester) and Post 88 (Braintree) are perennial powers

To find a program near you or to volunteer as a coach, contact your local parks department or the Massachusetts Baseball Commission.

"Baseball begins at the grassroots. Support your local league."`,
  },
  // ── 6. Freedom Trail ──
  {
    id: 'sox_06',
    category: 'community',
    icon: '🚶',
    color: '#0c2340',
    matchText: "Take a walk along Boston's historic Freedom Trail.",
    title: "Boston's Freedom Trail",
    body: `The Freedom Trail is a 2.5-mile-long path through downtown Boston that passes by 16 locations significant to the history of the United States.

The trail begins at the Boston Common, America's oldest public park (established 1634), and winds its way through the North End to the Bunker Hill Monument in Charlestown.

Along the trail, you'll visit:

• Boston Common — where British troops camped during the occupation
• Massachusetts State House — with its golden dome
• Park Street Church — site of the first Sunday school
• Granary Burying Ground — final resting place of Paul Revere, John Hancock, and Samuel Adams
• King's Chapel — first Anglican church in Boston
• Boston Latin School site — America's oldest public school (1635)
• Old Corner Bookstore — where Emerson, Hawthorne, and Longfellow gathered
• Old South Meeting House — where the Boston Tea Party was planned
• Old State House — site of the Boston Massacre
• Faneuil Hall — "the Cradle of Liberty"
• Paul Revere's House — built around 1680
• Old North Church — "One if by land, two if by sea"
• Copp's Hill Burying Ground
• Bunker Hill Monument — site of the famous 1775 battle
• USS Constitution — "Old Ironsides"

The trail is marked by a red brick path and takes about 2-3 hours to walk at a leisurely pace. Free self-guided tours, or paid guided tours with costumed interpreters, are available.

"Walk the trail and walk through history."`,
  },
  // ── 7. Freedom Trail (explore America's past) ──
  {
    id: 'sox_07',
    category: 'community',
    icon: '🇺🇸',
    color: '#0c2340',
    matchText: "Visit the Freedom Trail and explore America's past.",
    title: 'Explore America\'s Past',
    body: `The Freedom Trail is more than a walking tour — it's a journey through the birth of a nation.

Boston was at the center of the American Revolution, and the Freedom Trail connects the places where history was made.

Key moments you can trace along the trail:

🔥 The Boston Massacre (1770) — Old State House site
🔥 The Boston Tea Party (1773) — planned at Old South Meeting House
🔥 Paul Revere's Midnight Ride (1775) — from his home in the North End
🔥 The Battle of Bunker Hill (1775) — commemorated by the monument
🔥 The Siege of Boston (1775-1776) — the British evacuation

The trail tells the story of ordinary citizens who did extraordinary things. Samuel Adams, John Hancock, Paul Revere, and Dr. Joseph Warren were not professional soldiers — they were businessmen, silversmiths, and doctors who risked everything for independence.

Guided tours are available daily, led by interpreters in 18th-century costume. Audio guides are also available in English, Spanish, French, German, and Japanese.

Admission to most sites is free, though some charge a small fee. The trail is open year-round, but spring and fall offer the most comfortable walking weather.

"To understand America, walk the Freedom Trail."`,
  },
  // ── 8. USS Constitution ──
  {
    id: 'sox_08',
    category: 'community',
    icon: '⚓',
    color: '#0c2340',
    matchText: "The USS Constitution remains one of Boston's most popular attractions.",
    title: 'USS Constitution — "Old Ironsides"',
    body: `The USS Constitution is the world's oldest commissioned naval vessel still afloat.

Launched in 1797, she is one of the original six frigates authorized by the Naval Act of 1794 and named by President George Washington.

The ship earned her famous nickname "Old Ironsides" during the War of 1812, when British cannonballs were seen bouncing off her hull. An American sailor reportedly shouted, "Huzzah! Her sides are made of iron!" — though they were actually made of live oak, a wood so dense it was said to be as hard as iron.

Key Facts:
• Length: 204 feet
• Beam: 43.5 feet
• Displacement: 2,200 tons
• Crew: 450-500 officers and enlisted
• Armament: 44 guns (originally)
• Home port: Charlestown Navy Yard, Boston

The Constitution fought in the Quasi-War with France, the First Barbary War, and the War of 1812. Her most famous engagement was against HMS Guerriere in August 1812, where she won a decisive victory.

The ship is still a commissioned Navy vessel, with an active-duty crew. She is open to the public for tours at the Charlestown Navy Yard, and she takes a "turnaround cruise" once a year into Boston Harbor.

Free admission. Open Tuesday-Sunday, 10 AM to 6 PM. Photo ID required for visitors 18 and older.`,
  },
  // ── 9. Boston Harbor ──
  {
    id: 'sox_09',
    category: 'community',
    icon: '⛵',
    color: '#0c2340',
    matchText: "Tour historic Boston Harbor this weekend.",
    title: 'Boston Harbor Tours',
    body: `Boston Harbor is one of America's most historic and scenic harbors.

The harbor has been a center of commerce, defense, and recreation for over 350 years. It was the site of the Boston Tea Party in 1773, when colonists dumped British tea into the water in protest of taxation without representation.

Today, Boston Harbor offers a variety of tours and activities:

🚢 Harbor Cruises — 90-minute narrated tours depart from Long Wharf and Rowes Wharf. See the harbor islands, the USS Constitution, and the Boston skyline from the water.

🚢 Whale Watches — Head out to Stellwagen Bank to see humpback, finback, and minke whales. Tours run April through October.

🚢 Ferry to the Boston Harbor Islands — Visit Georges Island (home of Fort Warren), Spectacle Island (beach and visitor center), and Bumpkin Island.

🚢 Sunset Dinner Cruises — Enjoy dinner and dancing on the water as the sun sets over the city.

🚢 Codzilla Speedboat — For thrill-seekers, a high-speed adventure ride around the harbor.

The Boston Tea Party Ships & Museum offers an interactive experience where you can participate in the famous protest. Located on the Fort Point Channel, the museum features authentically restored tea ships and a multi-sensory documentary.

Harbor cruises range from $15-$40 per person. Whale watches are $35-$45. The Harbor Islands ferry is $14 round-trip.

"See Boston the way the colonists saw it — from the water."`,
  },
  // ── 10. New England Aquarium ──
  {
    id: 'sox_10',
    category: 'community',
    icon: '🐠',
    color: '#0c2340',
    matchText: "The New England Aquarium welcomes visitors daily.",
    title: 'New England Aquarium',
    body: `The New England Aquarium, located on Central Wharf in Boston, is one of the premier aquariums in the United States.

Opened in 1969, the aquarium's centerpiece is the Giant Ocean Tank — a 200,000-gallon cylindrical tank that simulates a Caribbean coral reef. A spiral walkway winds around the tank, allowing visitors to view the reef from top to bottom.

The Giant Ocean Tank is home to:
• Sea turtles (Myrtle the green sea turtle is a resident favorite)
• Sharks (nurse, sand tiger, and blacktip)
• Rays (southern stingrays and cownose rays)
• Moray eels
• Hundreds of tropical fish
• Live coral

Other exhibits include:
🐧 Penguin Colony — African, rockhopper, and little blue penguins
🐙 Pacific Octopus — one of the most intelligent invertebrates
🦭 Seal and Sea Lion Exhibit — harbor seals and California sea lions
🦞 Northern Waters Gallery — featuring New England marine life
🪸 Edge of the Sea — a hands-on tide pool exhibit

The aquarium is also a leader in marine conservation and research. The New England Aquarium Whale Watch, departing from the aquarium, takes visitors to Stellwagen Bank to see whales in their natural habitat.

Hours: 9 AM to 5 PM daily (until 6 PM in summer)
Admission: $7.50 adults, $3.50 children (ages 2-15), under 2 free
Memberships available.

Located at Central Wharf, near Faneuil Hall and the waterfront.`,
  },
  // ── 11. New England Aquarium (wonders of the ocean) ──
  {
    id: 'sox_11',
    category: 'community',
    icon: '🐬',
    color: '#0c2340',
    matchText: "Explore the wonders of the ocean at the New England Aquarium.",
    title: 'Wonders of the Ocean',
    body: `The ocean covers 71% of our planet, yet we've explored less than 5% of it. The New England Aquarium brings the mysteries of the deep to downtown Boston.

Did you know?

🌊 The Giant Ocean Tank holds 200,000 gallons of seawater and houses over 600 animals.

🌊 A green sea turtle can live to be 80 years old. Myrtle, the aquarium's resident turtle, has been there since 1970.

🌊 Octopuses have three hearts and blue blood. They can solve puzzles, open jars, and recognize individual humans.

🌊 A group of penguins is called a "waddle" on land and a "raft" in the water.

🌊 Sharks have been on Earth for over 400 million years — longer than trees.

🌊 The largest animal on Earth, the blue whale, can weigh as much as 200 tons and has a heart the size of a small car.

🌊 Coral reefs cover less than 1% of the ocean floor but support 25% of all marine life.

🌊 Jellyfish are 95% water and have no brain, heart, or bones.

The aquarium's education programs reach over 100,000 students each year, inspiring the next generation of marine biologists and conservationists.

Visit the New England Aquarium and discover the wonders that lie beneath the waves.

"From the smallest plankton to the largest whale, every creature plays a role in the ocean's web of life."`,
  },
  // ── 12. Faneuil Hall Marketplace ──
  {
    id: 'sox_12',
    category: 'community',
    icon: '🏛️',
    color: '#0c2340',
    matchText: "Spend the afternoon at Faneuil Hall Marketplace.",
    title: 'Faneuil Hall Marketplace',
    body: `Faneuil Hall Marketplace is one of Boston's most popular destinations, combining history, shopping, and dining in a single location.

The marketplace consists of four buildings:

🏛️ Faneuil Hall — Built in 1742 and given to the city by merchant Peter Faneuil. Known as "the Cradle of Liberty," it was the site of speeches by Samuel Adams, James Otis, and other patriots. Today it houses a museum and visitor center.

🛍️ Quincy Market — Built in 1826, this Greek Revival building is the centerpiece of the marketplace. Inside, you'll find the Quincy Market Colonnade, a food hall with over 35 vendors offering everything from clam chowder to cannolis.

🛍️ North Market & South Market — Two 19th-century buildings flanking Quincy Market, now home to shops, restaurants, and pubs.

The marketplace is famous for its street performers — jugglers, magicians, musicians, and acrobats who entertain crowds on the cobblestone plaza outside Quincy Market.

Popular food vendors include:
• Boston Chowda Co. — award-winning clam chowder
• Boston Cream Pie Co. — the original Boston cream pie
• Durgin-Park — historic restaurant (since 1826)
• Sausage vendors, pizza, lobster rolls, and more

The marketplace attracts over 18 million visitors annually, making it one of the most visited tourist destinations in the United States.

Open daily. Shops 10 AM-9 PM, restaurants until 10 PM. Free admission.

"Where Boston shops, eats, and gathers."`,
  },
  // ── 13. Faneuil Hall (attracts visitors) ──
  {
    id: 'sox_13',
    category: 'community',
    icon: '🌍',
    color: '#0c2340',
    matchText: "Faneuil Hall continues to attract visitors from around the world.",
    title: 'A Global Destination',
    body: `Faneuil Hall Marketplace draws visitors from every corner of the globe, making it one of America's most beloved public spaces.

Over 18 million people visit each year — more than the population of many countries. They come for the history, the food, the shopping, and the unique atmosphere that can only be found in Boston.

What makes Faneuil Hall special:

🌍 History — The site has been a public gathering place since 1742. Peter Faneuil, a wealthy merchant, built the hall as a gift to the city. It quickly became a center for political debate and public discourse.

🌍 Architecture — The buildings represent some of the finest Greek Revival and Federal-style architecture in America. Quincy Market's colonnade, with its Doric columns, is a masterpiece of 19th-century design.

🌍 Street Performers — The cobblestone plaza outside Quincy Market is one of the best places in America to see street performers. Musicians, jugglers, magicians, and living statues perform daily.

🌍 Food — The Quincy Market Colonnade offers a global tour of cuisine: New England clam chowder, Italian cannolis, Greek gyros, Chinese dumplings, and more.

🌍 Shopping — Over 100 shops and pushcarts offer everything from Boston souvenirs to handcrafted jewelry.

The marketplace has been called "the soul of Boston" — a place where tourists and locals, history and modernity, all come together.

"From the Revolution to today, Faneuil Hall is where Boston gathers."`,
  },
  // ── 14. Museum of Fine Arts ──
  {
    id: 'sox_14',
    category: 'community',
    icon: '🎨',
    color: '#0c2340',
    matchText: "Visit the Museum of Fine Arts this weekend.",
    title: 'Museum of Fine Arts, Boston',
    body: `The Museum of Fine Arts, Boston (MFA) is one of the most comprehensive art museums in the world, with a collection of over 450,000 works.

Founded in 1870, the museum moved to its current location on Huntington Avenue in 1909. The building's neoclassical facade, designed by architect Guy Lowell, is a Boston landmark.

Highlights of the Collection:

🎨 Egyptian Art — One of the finest collections outside Egypt, including artifacts from the reign of Pharaohs and a complete tomb chapel.

🎨 Impressionist Paintings — Works by Monet, Renoir, Degas, Pissarro, and Cézanne. The MFA has one of the largest collections of Monet's work outside of Paris.

🎨 American Art — From colonial portraits by John Singleton Copley to works by John Singer Sargent, Winslow Homer, and Mary Cassatt.

🎨 Asian Art — Over 100,000 objects, including Japanese prints, Chinese paintings, and Indian sculpture.

🎨 European Masters — Rembrandt, El Greco, Velázquez, Rubens, and more.

🎨 Contemporary Art — Works by Picasso, Pollock, Warhol, and modern artists.

🎨 Musical Instruments — Over 1,100 instruments from around the world, dating from ancient times to the present.

Special Exhibitions:
• "The Art of the Silk Road" — through September
• "Boston Collects: 100 Years of Impressionism" — through October

Hours: Monday-Tuesday 10 AM-4:45 PM, Wednesday-Friday 10 AM-9:45 PM, Saturday-Sunday 10 AM-4:45 PM
Admission: $7.50 adults, $6.50 seniors, $2.50 students, children under 16 free on weekdays before 3 PM.

Located at 465 Huntington Avenue, accessible by the Green Line (MFA stop).`,
  },
  // ── 15. Discover history and culture ──
  {
    id: 'sox_15',
    category: 'community',
    icon: '📚',
    color: '#0c2340',
    matchText: "Discover history and culture throughout Boston.",
    title: 'History & Culture in Boston',
    body: `Boston is a city where every street corner tells a story. From colonial times to the present day, it has been a center of American history, education, and culture.

Historic Sites to Explore:

📚 The Paul Revere House — The oldest building in downtown Boston (built around 1680). Revere lived here from 1770 to 1800. It's now a museum open to the public.

📚 The Old North Church — Where the famous "one if by land, two if by sea" signal was sent. Still an active Episcopal church.

📚 The Bunker Hill Monument — A 221-foot granite obelisk commemorating the first major battle of the Revolutionary War. Climb the 294 steps to the top for a spectacular view.

📚 The Boston Tea Party Ships & Museum — An interactive experience where you can participate in the famous protest.

Cultural Institutions:

📚 The Boston Public Library — The first large free municipal library in the United States (1848). The Bates Hall reading room is one of the most beautiful spaces in the city.

📚 The Isabella Stewart Gardner Museum — A 15th-century Venetian-style palace filled with art. The site of the most famous unsolved art heist in history (1990).

📚 The Boston Symphony Orchestra — Founded in 1881, one of the "Big Five" American orchestras. Summer concerts at Tanglewood in the Berkshires.

📚 The Institute of Contemporary Art — Cutting-edge modern art in a stunning waterfront building.

Boston is also home to over 50 colleges and universities, including Harvard (1636), MIT (1861), Boston University, Boston College, and Northeastern — making it one of the most educated cities in the world.

"In Boston, history isn't something you read about — it's something you walk through."`,
  },
  // ── 16. Fenway Park beloved ballpark ──
  {
    id: 'sox_16',
    category: 'community',
    icon: '🏟️',
    color: '#bd3039',
    matchText: "Fenway Park remains one of baseball's most beloved ballparks.",
    title: 'Fenway Park — A Living Legend',
    body: `Fenway Park opened on April 20, 1912 — the same week the Titanic sank. Over 100 years later, it remains the oldest active ballpark in Major League Baseball.

Fenway Facts:

🏟️ The Green Monster — The 37-foot, 2-inch left field wall is the most famous feature in baseball. Originally just a plain wall, it was painted green in 1947 and has been known as the "Green Monster" ever since. The wall is only 310 feet from home plate.

🏟️ Pesky's Pole — The right field foul pole, named after Red Sox legend Johnny Pesky, is just 302 feet from home plate — the shortest right field line in baseball.

🏟️ The Triangle — The deepest part of center field, 420 feet from home plate, where the walls meet at an angle.

🏟️ The Williams Shift — Ted Williams was so feared that opposing teams shifted their entire defense to the right side. Williams refused to bunt and hit into the shift anyway.

🏟️ Capacity — 33,871 (smallest in MLB, making tickets hard to come by)

🏟️ Manual Scoreboard — The left field scoreboard is still operated by hand. A scorekeeper sits behind the wall and updates the scores during the game.

🏟️ The Lone Red Seat — In the right field bleachers, a single red seat marks the spot where Ted Williams hit the longest measured home run in Fenway history — 502 feet on June 9, 1946.

Fenway has hosted 11 World Series, including the Red Sox championships of 1912, 1915, 1916, 1918, and (fingers crossed) more to come.

"There's no place like Fenway. It's not just a ballpark — it's a cathedral."`,
  },
  // ── 17. Red Sox fans knowledgeable ──
  {
    id: 'sox_17',
    category: 'community',
    icon: '🧠',
    color: '#bd3039',
    matchText: "Red Sox fans are among the most knowledgeable in baseball.",
    title: 'The Fenway Faithful',
    body: `Red Sox fans are a different breed. They don't just watch baseball — they live it, breathe it, and pass it down through generations.

What makes Red Sox fans special:

🧠 Generational Knowledge — Many fans can trace their Red Sox fandom back three or four generations. Grandparents take grandchildren to Fenway, passing down stories of Ted Williams, Carl Yastrzemski, and the Impossible Dream of 1967.

🧠 Statistical Awareness — Red Sox fans know batting averages, ERAs, and on-base percentages. They debate lineup construction and bullpen management with the passion of general managers.

🧠 Historical Memory — They remember 1946, 1967, 1975, 1978 (Bucky Dent), and 1986 (Bill Buckner). Every heartbreak is cataloged and remembered.

🧠 The Rivalry — The Yankees-Red Sox rivalry is the oldest and most intense in American sports. Red Sox fans can recite every chapter of the 86-year history between 1918 and the future.

🧠 Fenway Atmosphere — Fenway is one of the few places where a 2-1 game in July feels like Game 7 of the World Series. The fans are loud, knowledgeable, and passionate.

🧠 The Writers — Boston's baseball writers (Peter Gammons, Will McDonough, Lesley Visser) are among the best in the business, and the fans hold them to high standards.

🧠 The Call — "The Red Sox are going to win the World Series!" — a phrase that has been said, hoped for, and believed every single year since 1919.

"Red Sox fans don't just root for a team. They carry a tradition."`,
  },
  // ── 18. Greetings to New England ──
  {
    id: 'sox_18',
    category: 'community',
    icon: '👋',
    color: '#0c2340',
    matchText: "Greetings to listeners throughout New England.",
    title: 'Greetings, New England',
    body: `Red Sox baseball reaches every corner of New England — six states, united by one team.

The Red Sox Nation spans:

👋 Massachusetts — From Boston to the Berkshires, from Cape Cod to the North Shore. The heart of Red Sox country.

👋 Maine — From Portland to Bangor, fans tune in on the Red Sox Radio Network. Summer nights in Maine are made for baseball on the radio.

👋 New Hampshire — The Granite State bleeds Red Sox red. Manchester, Concord, and the Lakes Region all tune in.

👋 Vermont — The Green Mountain State may be small, but its Red Sox fans are mighty. Burlington to Brattleboro.

👋 Connecticut — The Nutmeg State is divided between Yankees and Red Sox fans, but the eastern half (Hartford, New London) is solidly Red Sox territory.

👋 Rhode Island — The Ocean State is Red Sox through and through. Providence to Newport, they bleed red.

The Red Sox Radio Network covers all six states, with over 60 affiliate stations. Whether you're on a fishing boat in Maine, a farm in Vermont, or a beach in Rhode Island, you can hear the game.

"From the mountains to the sea, New England is Red Sox country."`,
  },
  // ── 19. Fine evening for baseball ──
  {
    id: 'sox_19',
    category: 'community',
    icon: '🌆',
    color: '#bd3039',
    matchText: "Another fine evening for baseball in Boston.",
    title: 'A Perfect Boston Evening',
    body: `There's something special about a summer evening at Fenway Park.

The sun sets behind the Green Monster, casting long shadows across the outfield. The lights come on, and the old ballpark glows like a jewel in the city.

The air is warm but not hot. A light breeze carries the smell of hot dogs and popcorn. The organist plays between innings. The crowd murmurs, then roars when a Red Sox hitter steps to the plate.

This is what summer in Boston is all about:

🌆 The sound of a fastball hitting the catcher's mitt
🌆 The crack of the bat on a warm evening
🌆 The Green Monster glowing in the twilight
🌆 The crowd rising as one for a big pitch
🌆 The organist playing "Take Me Out to the Ball Game"
🌆 The smell of sausages from the vendors outside the park
🌆 The walk back to the T after the game, win or lose
🌆 The sound of the crowd spilling out onto Lansdowne Street

It doesn't matter if the Red Sox are in first place or last — a summer evening at Fenway is one of life's simple pleasures.

"Baseball is the most perfect of games. It is the only game where the defense has the ball." — Red Sox fan wisdom

Enjoy the game. Enjoy the evening. Enjoy Boston.`,
  },
  // ── 20. Happy birthday Mrs. O'Leary ──
  {
    id: 'sox_20',
    category: 'community',
    icon: '🎂',
    color: '#bd3039',
    matchText: "Happy birthday to Mrs. O'Leary of Worcester.",
    title: 'Happy Birthday, Mrs. O\'Leary!',
    body: `🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂
🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂
🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂
🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂
🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂
🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂
🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂
🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂

Happy Birthday to Mrs. Helen O'Leary of Worcester, Massachusetts!

Mrs. O'Leary is celebrating her 94th birthday today, and she's been a Red Sox fan since 1918 — the last time the Red Sox won the World Series (so far).

Born in 1890, Mrs. O'Leary has seen it all:
• The last Red Sox World Series championship (1918)
• Babe Ruth sold to the Yankees (1919) — "the Curse"
• Ted Williams hit .406 (1941)
• The Impossible Dream (1967)
• Carlton Fisk's home run wave (1975)
• Bucky Dent (1978) — she still hasn't forgiven him

Mrs. O'Leary has attended over 1,000 games at Fenway Park. She remembers when the Green Monster was just a wall, before it was painted green. She remembers when hot dogs cost a nickel.

When asked about the Curse of the Bambino, she said: "I've been waiting 66 years. What's a few more?"

The Red Sox organization sends their warmest birthday wishes to Mrs. O'Leary, a true Fenway Faithful.

"Here's to many more birthdays, and maybe — just maybe — a World Series." 🎂`,
  },
  // ── 21. Congratulations to graduates ──
  {
    id: 'sox_21',
    category: 'community',
    icon: '🎓',
    color: '#0c2340',
    matchText: "Congratulations to graduates throughout Massachusetts.",
    title: 'Congratulations, Graduates!',
    body: `The Boston Red Sox extend their congratulations to the graduating class of 1984 across the Commonwealth of Massachusetts.

🎓 To the graduates of:
• Boston Latin School (founded 1635 — America's oldest public school)
• Boston English High School (founded 1821 — America's oldest public high school)
• Cambridge Rindge and Latin
• Brookline High School
• Newton North and Newton South
• Worcester's St. John's High School
• Springfield Central High School
• And every high school across Massachusetts

🎓 To the college graduates of:
• Harvard University (founded 1636)
• MIT (founded 1861)
• Boston University
• Boston College
• Northeastern University
• University of Massachusetts (Amherst, Boston, Lowell, Worcester)
• Tufts University
• Brandeis University
• Wellesley College
• And all the colleges and universities across the Commonwealth

The Class of 1984 enters a world of possibility. Some will go into business, some into teaching, some into science, and some — if they're lucky — into baseball.

As Ted Williams once said: "All I want out of life is to be a good ballplayer and to make the people who come out to see me happy."

Congratulations, graduates. The future is yours.

"Play ball — and play it well." ⚾🎓`,
  },
  // ── 22. Summer festivals ──
  {
    id: 'sox_22',
    category: 'community',
    icon: '🎪',
    color: '#0c2340',
    matchText: "Summer festivals continue across New England.",
    title: 'New England Summer Festivals',
    body: `Summer in New England means festivals — celebrating everything from seafood to music to the region's rich history.

Popular Summer Festivals:

🎪 Newport Folk Festival (Rhode Island) — Late July. One of the most famous folk festivals in the world. Bob Dylan went electric here in 1965.

🎪 Newport Jazz Festival (Rhode Island) — Early August. The granddaddy of jazz festivals, founded in 1954.

🎪 Tanglewood (Lenox, MA) — June through August. The summer home of the Boston Symphony Orchestra. Outdoor concerts on the lawn.

🎪 Boston Harborfest — July 4th weekend. The largest 4th of July celebration in the country, with fireworks over the Charles River (Boston Pops concert).

🎪 Maine Lobster Festival (Rockland, ME) — Early August. Celebrate Maine's most famous crustacean with lobster rolls, lobster dinners, and lobster everything.

🎪 Vermont Maple Festival (St. Albans, VT) — Late April. Celebrate the maple syrup harvest with sugarhouse tours and all-you-can-eat pancakes.

🎪 Big E (West Springfield, MA) — September. New England's largest fair, with all six states represented.

🎪 First Night Boston — December 31. America's first First Night celebration, with ice sculptures, music, and fireworks.

🎪 The Great Chowder Cook-Off (Newport, RI) — June. Chowder lovers from around the world compete for the title of best chowder.

And one we may have made up:

🎪 The Annual Moxie Festival (Lisbon Falls, ME) — July. Celebrating New England's most polarizing soda. "Moxie: It's an acquired taste, and we've acquired it." Features a Moxie chugging contest, Moxie ice cream, and the crowning of the Moxie Queen. (This one is actually real — but it sounds made up, doesn't it?)

🎪 The Great Boston Baked Bean-Off (Boston Common) — August. (Okay, this one we definitely made up. But wouldn't it be great?)

"Summer in New England: where every weekend is a celebration."`,
  },
  // ── 23. Thank Red Sox fans ──
  {
    id: 'sox_23',
    category: 'community',
    icon: '🙏',
    color: '#bd3039',
    matchText: "We thank Red Sox fans for their continued support.",
    title: 'Thank You, Red Sox Nation',
    body: `The Boston Red Sox organization extends its heartfelt thanks to the greatest fans in baseball.

Through the highs and the lows — and there have been plenty of both — Red Sox fans have stood by their team with unwavering loyalty.

🙏 Thank you to the season ticket holders who have been with us for decades. Some of you have had the same seats since the 1960s.

🙏 Thank you to the fans who listen on the radio — from fishing boats in Maine, from farms in Vermont, from porches in Rhode Island. You keep the Red Sox Radio Network alive.

🙏 Thank you to the fans who fill Fenway Park every game, rain or shine. Fenway has the smallest capacity in baseball, but the loudest fans.

🙏 Thank you to the families who pass down Red Sox fandom from generation to generation. Grandparents, parents, and children — all united by one team.

🙏 Thank you to the fans who remember 1946, 1967, 1975, and 1978. Your patience will be rewarded. (We hope.)

🙏 Thank you to the fans who believe, year after year, that "this is the year." That hope — stubborn, irrational, beautiful — is what makes Red Sox fans special.

🙏 Thank you to the fans who have never seen a World Series championship in your lifetime. Your loyalty is the foundation of this franchise.

The Red Sox are more than a baseball team. They are a community, a tradition, and a shared experience that binds New England together.

"Thank you, Red Sox Nation. We play for you." 🙏❤️`,
  },
  // ── 24. Nothing quite like Fenway ──
  {
    id: 'sox_24',
    category: 'community',
    icon: '❤️',
    color: '#bd3039',
    matchText: "There's nothing quite like baseball at Fenway Park.",
    title: 'Nothing Like Fenway',
    body: `There are ballparks, and then there's Fenway.

Fenway Park is not the biggest, not the newest, and not the most comfortable. But it is the most beloved.

❤️ The Green Monster — 37 feet of green-painted concrete that has broken the hearts of right-handed hitters and delighted left-handed ones for over 70 years.

❤️ The Manual Scoreboard — Still operated by hand, a relic of a bygone era. A scorekeeper sits behind the wall and updates the scores, just as they did in 1934.

❤️ The Seats — Some of the seats face the wrong direction. Some have obstructed views. Some are behind poles. And they're all sold out, every game.

❤️ The Crowd — 33,000 of the most passionate, knowledgeable fans in baseball. They know every player, every stat, and every heartbreak.

❤️ The Organist — Fenway's organist has been playing since the 1950s. Between innings, the organ fills the park with music.

❤️ The History — Babe Ruth pitched here. Ted Williams hit here. Carl Yastrzemski played here. Carlton Fisk waved one fair here. Every inch of Fenway has a story.

❤️ The Smell — Hot dogs, popcorn, and the unmistakable scent of old wood and fresh grass. It's the smell of summer.

❤️ The Light — On summer evenings, the sun sets behind the Green Monster, and the old park glows. There's no light quite like it.

❤️ The Feeling — You walk through the tunnel, see the green field, and feel like you've come home. That's Fenway.

"There's no place like Fenway. There never will be." ❤️`,
  },
  // ── 25. Enjoy the game and enjoy Boston ──
  {
    id: 'sox_25',
    category: 'community',
    icon: '🎉',
    color: '#bd3039',
    matchText: "Enjoy the game and enjoy Boston.",
    title: 'Enjoy Boston',
    body: `Whether you're a lifelong resident or a first-time visitor, Boston is a city to be enjoyed.

🎉 The Game — Sit back, grab a hot dog, and enjoy the greatest game ever invented. Baseball is slow, deliberate, and beautiful. It rewards patience and attention. Every pitch tells a story.

🎉 The City — Boston is a walking city. Stroll the Common, wander the North End, explore the Back Bay. Every neighborhood has its own character.

🎉 The Food — Clam chowder, lobster rolls, baked beans, cream pie, and Italian food in the North End. Boston's food scene is as rich as its history.

🎉 The History — Walk the Freedom Trail. Visit the Tea Party Ships. Stand where Paul Revere stood. Boston is where America began.

🎉 The People — Bostonians are tough, loyal, and passionate. They love their sports, their city, and their history. They'll give you directions, recommend a restaurant, and argue about the Red Sox — all in the same conversation.

🎉 The Seasons — Summer in Boston is warm and green. Fall brings spectacular foliage. Winter is cold and snowy. Spring is brief and beautiful. Every season has its charm.

🎉 The Music — From the Boston Pops to the clubs on Lansdowne Street, Boston is a music city. The Dropkick Murphys, the Cars, Aerosmith — they all came from here.

🎉 The Colleges — Harvard, MIT, BU, BC, Northeastern — Boston is a college town. The energy of 250,000 students gives the city its pulse.

So enjoy the game. Enjoy the city. Enjoy the summer.

"Boston: where history lives and baseball reigns." 🎉❤️`,
  },
];

// ── Lookup function ──
export function findRedSoxBannerEntry(bannerText) {
  if (!bannerText) return null;
  return ENTRIES.find(e => e.matchText === bannerText) || null;
}

// ── Track viewed banners for achievements ──
const VIEWED_KEY = 'bb84_sox_banner_views';

export function trackRedSoxBannerView(entryId) {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    const viewed = raw ? JSON.parse(raw) : {};
    viewed[entryId] = (viewed[entryId] || 0) + 1;
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
    return getNewlyUnlockedAchievements(viewed);
  } catch (e) {
    return [];
  }
}

export function getRedSoxBannerViewCount() {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

// ── Achievement thresholds ──
const ACHIEVEMENT_THRESHOLDS = [
  { count: 5, id: 'sox_banner_fan', name: 'Fenway Fan', desc: 'View 5 Red Sox banner exhibits', icon: '⚾', category: 'community' },
  { count: 15, id: 'sox_banner_enthusiast', name: 'Fenway Faithful', desc: 'View 15 Red Sox banner exhibits', icon: '❤️', category: 'community' },
  { count: 25, id: 'sox_banner_historian', name: 'Fenway Historian', desc: 'View all 25 Red Sox banner exhibits', icon: '🏛️', category: 'community' },
];

function getNewlyUnlockedAchievements(viewed) {
  const uniqueCount = Object.keys(viewed).length;
  const newlyUnlocked = [];
  for (const threshold of ACHIEVEMENT_THRESHOLDS) {
    if (uniqueCount >= threshold.count) {
      // Check if already unlocked via localStorage achievements
      try {
        const achRaw = localStorage.getItem('bb84_achievements');
        const achs = achRaw ? JSON.parse(achRaw) : {};
        if (!achs[threshold.id]) {
          achs[threshold.id] = Date.now();
          localStorage.setItem('bb84_achievements', JSON.stringify(achs));
          newlyUnlocked.push(threshold.id);
        }
      } catch (e) { /* ignore */ }
    }
  }
  // Special achievements
  try {
    const achRaw = localStorage.getItem('bb84_achievements');
    const achs = achRaw ? JSON.parse(achRaw) : {};
    // Bobblehead collector — viewed the bobblehead rotation
    if (viewed['sox_01'] && !achs['sox_bobblehead_collector']) {
      achs['sox_bobblehead_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      newlyUnlocked.push('sox_bobblehead_collector');
    }
    // Poster collector
    if (viewed['sox_02'] && !achs['sox_poster_collector']) {
      achs['sox_poster_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      newlyUnlocked.push('sox_poster_collector');
    }
  } catch (e) { /* ignore */ }
  return newlyUnlocked;
}

export const RED_SOX_BANNER_ACHIEVEMENTS = ACHIEVEMENT_THRESHOLDS;