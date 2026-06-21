// General Products interactive popups for the 1984 game experience
// 25 entries matching the General Products banner ads in broadcastAds.js

const ENTRIES = [
  {
    id: 'mcd_1',
    brand: "MCDONALD'S",
    icon: '🍔',
    color: '#ffc72c',
    anim: 'fries',
    matchText: "McDonald's reminds you that you deserve a break today.",
    title: 'You Deserve a Break Today',
    body: `McDonald's invites America to take a break.

Whether you're heading home from work, taking the family out after Little League, or grabbing lunch between errands, McDonald's has become America's favorite stop.

Try a Big Mac®, Quarter Pounder® with Cheese, Chicken McNuggets®, or golden World Famous Fries.

In 1984, a Big Mac costs about $1.60, and millions are served every week across the country.

"You deserve a break today at McDonald's."`,
  },
  {
    id: 'mcd_2',
    brand: "MCDONALD'S",
    icon: '🍔',
    color: '#ffc72c',
    anim: 'fries',
    matchText: "Try a Quarter Pounder with Cheese at McDonald's.",
    title: 'Quarter Pounder with Cheese',
    body: `The burger built for serious appetites.

The Quarter Pounder with Cheese features a quarter-pound beef patty, two slices of melted cheese, onions, pickles, ketchup, and mustard served on a sesame seed bun.

Typical 1984 price: $1.39–$1.69 depending on location.

Consumer surveys consistently rank McDonald's among America's most recognizable brands.`,
  },
  {
    id: 'mcd_3',
    brand: "MCDONALD'S",
    icon: '🍟',
    color: '#ffc72c',
    anim: 'fries',
    matchText: "Stop by McDonald's after today's game.",
    title: 'After the Game',
    body: `Baseball and burgers go together.

After today's game, stop by your local McDonald's and enjoy dinner with the family. Many locations feature indoor seating, birthday parties, and PlayPlaces for children.

Fun Fact: McDonald's operates more than 7,000 restaurants worldwide in 1984.`,
  },
  {
    id: 'bk_1',
    brand: 'BURGER KING',
    icon: '👑',
    color: '#f97316',
    anim: 'flame',
    matchText: "Burger King invites you to have it your way.",
    title: 'Have It Your Way',
    body: `At Burger King, you're in charge.

The famous Whopper® features flame-broiled beef cooked over an open flame, giving it a distinctive taste different from traditional fast-food hamburgers.

Customize it your way:

• Hold the onions
• Extra pickles
• Extra ketchup
• No problem

"Have It Your Way."`,
  },
  {
    id: 'bk_2',
    brand: 'BURGER KING',
    icon: '🔥',
    color: '#f97316',
    anim: 'flame',
    matchText: "Visit Burger King for flame-broiled flavor.",
    title: 'Flame Broiled Flavor',
    body: `Not fried. Flame broiled.

Burger King's cooking method remains one of the company's biggest selling points.

The Whopper sells for approximately $1.59–$1.89 in many markets and remains one of America's best-known fast-food sandwiches.`,
  },
  {
    id: 'wendys_1',
    brand: "WENDY'S",
    icon: '👩',
    color: '#ef4444',
    anim: 'pulse',
    matchText: "Wendy's asks a simple question: Where's the beef?",
    title: "Where's The Beef?",
    body: `America's most talked-about commercial.

The phrase "Where's the Beef?" has become one of the most popular catchphrases in the country.

Featuring Clara Peller, the advertisement humorously points out Wendy's larger hamburger patties compared to competitors.

Fun Fact: The slogan appears everywhere from newspapers to political speeches.`,
  },
  {
    id: 'wendys_2',
    brand: "WENDY'S",
    icon: '🍔',
    color: '#ef4444',
    anim: 'pulse',
    matchText: "Find out for yourself at Wendy's.",
    title: 'Find Out For Yourself',
    body: `Fresh, never frozen beef.

Wendy's square hamburgers are designed to hang over the edge of the bun, showing customers they are getting more beef.

Popular menu items include:

• Single
• Double
• Triple
• Chili
• Frosty

Average hamburger prices range from 99¢ to $1.89.`,
  },
  {
    id: 'coke_1',
    brand: 'COCA-COLA',
    icon: '🥤',
    color: '#dc2626',
    anim: 'wave',
    matchText: "Coca-Cola reminds you that Coke is it.",
    title: 'Coke Is It!',
    body: `Coke Is It!

America's best-selling soft drink continues to dominate vending machines, grocery stores, restaurants, and ballparks nationwide.

A six-pack of Coca-Cola typically sells for around $1.79–$2.29.

Fun Fact: More than 100 years after its invention, Coca-Cola is sold in over 150 countries.`,
  },
  {
    id: 'coke_2',
    brand: 'COCA-COLA',
    icon: '❄️',
    color: '#dc2626',
    anim: 'wave',
    matchText: "Enjoy an ice-cold Coca-Cola during the game.",
    title: 'Ice Cold Refreshment',
    body: `Nothing refreshes like an ice-cold Coke.

Whether you're watching baseball, mowing the lawn, or relaxing on the porch, Coca-Cola remains one of America's favorite refreshments.

Look for collectible glass bottles, aluminum cans, and special promotional packaging throughout the summer.`,
  },
  {
    id: 'pepsi_1',
    brand: 'PEPSI',
    icon: '🔵',
    color: '#2563eb',
    anim: 'swirl',
    matchText: "Pepsi is the choice of a new generation.",
    title: 'The Choice of a New Generation',
    body: `Pepsi challenges Coke for America's taste buds.

Pepsi's newest campaign targets younger consumers with modern music, celebrities, and energetic advertising.

The slogan:

"Pepsi. The Choice of a New Generation."

has become one of the most successful advertising campaigns of the decade.`,
  },
  {
    id: 'pepsi_2',
    brand: 'PEPSI',
    icon: '🥤',
    color: '#2563eb',
    anim: 'swirl',
    matchText: "Pick up a refreshing Pepsi today.",
    title: 'Pick Up A Refreshing Pepsi Today',
    body: `The Cola Wars continue.

Pepsi and Coca-Cola are locked in one of the biggest marketing battles in American history. Pepsi's famous "Pepsi Challenge" blind taste tests have convinced many consumers that they prefer Pepsi's sweeter flavor.

Popular package prices in 1984:

• 12-pack cans: $2.99–$3.99
• 2-liter bottle: 99¢–$1.29
• Vending machine can: 35¢–50¢

Fun Fact: Millions of Americans have participated in Pepsi Challenge events held at malls, fairs, and supermarkets.`,
  },
  {
    id: 'sevenup_1',
    brand: '7-UP',
    icon: '🟢',
    color: '#22c55e',
    anim: 'bubbles',
    matchText: "7-Up. The Uncola.",
    title: 'The Uncola',
    body: `The Uncola.

While cola companies battle for market share, 7-Up offers something completely different.

Clear, caffeine-free, and crisp, 7-Up has built its reputation as the refreshing alternative to traditional soft drinks.

Popular uses include:

• Everyday refreshment
• Ice cream floats
• Mixed drinks
• Home remedies for upset stomachs

"7-Up. The Uncola."`,
  },
  {
    id: 'sevenup_2',
    brand: '7-UP',
    icon: '💧',
    color: '#22c55e',
    anim: 'bubbles',
    matchText: "Enjoy the crisp taste of 7-Up.",
    title: 'Crisp Refreshment',
    body: `A different kind of soft drink.

Unlike most leading sodas, 7-Up contains no caffeine and no caramel coloring.

A six-pack typically sells for approximately $1.69–$2.29.

Consumer surveys frequently rank 7-Up among America's favorite lemon-lime beverages.`,
  },
  {
    id: 'sears_1',
    brand: 'SEARS',
    icon: '🏬',
    color: '#0ea5e9',
    anim: 'shimmer',
    matchText: "Visit your local Sears and discover great values for the family.",
    title: "America's Store",
    body: `Everything under one roof.

For generations, Sears has been one of America's most trusted retailers.

Walk through your local Sears and you'll find:

• Appliances
• Clothing
• Tools
• Tires
• Electronics
• Lawn equipment
• Sporting goods

Many families still wait eagerly for the annual Sears Christmas Wish Book catalog.`,
    bonusText: '1984 Sears Christmas Wish Book now available. 605 pages of toys, electronics, trains, dolls, bicycles, and dreams.',
  },
  {
    id: 'sears_2',
    brand: 'SEARS',
    icon: '🔧',
    color: '#0ea5e9',
    anim: 'shimmer',
    matchText: "Sears has appliances, tools, and clothing for every household.",
    title: 'Appliances, Tools & More',
    body: `The Craftsman and Kenmore names Americans trust.

Sears-exclusive brands dominate their categories:

CRAFTSMAN TOOLS
Known for durability and lifetime guarantees.

KENMORE APPLIANCES
America's best-selling washers, dryers, refrigerators, and dishwashers.

DIEHARD BATTERIES
One of the most recognized automotive batteries in the country.

Fun Fact: Many American garages contain at least one Craftsman tool purchased from Sears.`,
    bonusText: '1984 Sears Christmas Wish Book now available. 605 pages of toys, electronics, trains, dolls, bicycles, and dreams.',
  },
  {
    id: 'kmart_1',
    brand: 'KMART',
    icon: '🛒',
    color: '#3b82f6',
    anim: 'bluelight',
    matchText: "Kmart reminds you that today's savings can make tomorrow brighter.",
    title: "Today's Savings",
    body: `Attention Kmart shoppers!

Kmart continues to offer discount prices on thousands of items for American families.

Departments include:

• Clothing
• Toys
• Electronics
• Housewares
• Automotive
• Sporting goods

The company operates over 2,000 stores nationwide.`,
    bonusText: 'A Blue Light Special is in progress somewhere in the store. Better hurry.',
  },
  {
    id: 'kmart_2',
    brand: 'KMART',
    icon: '💡',
    color: '#3b82f6',
    anim: 'bluelight',
    matchText: "Blue Light Specials are waiting at Kmart.",
    title: 'Blue Light Special',
    body: `BLUE LIGHT SPECIAL!

Look for the flashing blue light somewhere in the store.

For a limited time:

• Save on towels
• Save on toys
• Save on clothing
• Save on kitchen appliances

Customers often rush toward the flashing light hoping to discover an unexpected bargain.

Fun Fact: The Blue Light Special has become one of the most recognizable promotions in American retail history.`,
    bonusText: 'A Blue Light Special is in progress somewhere in the store. Better hurry.',
  },
  {
    id: 'jcp_1',
    brand: 'JCPENNEY',
    icon: '👔',
    color: '#a855f7',
    anim: 'shimmer',
    matchText: "Stop by JCPenney for quality and value.",
    title: 'Quality and Value',
    body: `Style for every American family.

JCPenney continues to be one of America's most popular department stores, offering affordable fashions, home furnishings, jewelry, and gifts.

Featured departments include:

• Men's Apparel
• Women's Fashion
• Children's Clothing
• Fine Jewelry
• Window Treatments
• Home Decor

Back-to-school shopping remains one of the busiest seasons of the year.

1984 Fun Fact: Many mall shoppers visit JCPenney as an anchor store before stopping at smaller specialty shops.`,
  },
  {
    id: 'jcp_2',
    brand: 'JCPENNEY',
    icon: '👗',
    color: '#a855f7',
    anim: 'shimmer',
    matchText: "See the latest fashions at JCPenney.",
    title: 'Latest Fashions',
    body: `The looks America is wearing.

From corduroy jackets to designer jeans, JCPenney brings the latest styles to communities across the nation.

Popular 1984 items include:

• Levi's Jeans
• Arizona Sportswear
• Sweaters and Windbreakers
• Athletic Apparel
• Casual Family Fashion

"Fashion doesn't have to be expensive."

Many stores now feature expanded portrait studios and catalog ordering services.`,
  },
  {
    id: 'ford_1',
    brand: 'FORD',
    icon: '🚗',
    color: '#6366f1',
    anim: 'drive',
    matchText: "Visit your local Ford dealer and test drive the new Ford Tempo.",
    title: 'Ford Tempo',
    body: `The New American Road Car.

Introducing the Ford Tempo.

Designed with modern aerodynamics and fuel economy in mind, the Tempo represents the future of family transportation.

1984 FORD TEMPO
• Front-wheel drive
• 2.3L four-cylinder engine
• Available 5-speed manual
• Available automatic transmission
• Excellent fuel economy

Starting Price: Approximately $7,000–$8,000 depending on options.

Popular Options: Air Conditioning, AM/FM Stereo, Cruise Control, Power Steering, Rear Defroster.

"The shape of things to come."`,
  },
  {
    id: 'chevy_1',
    brand: 'CHEVROLET',
    icon: '🚙',
    color: '#64748b',
    anim: 'drive',
    matchText: "Chevrolet invites you to see the 1984 Cavalier.",
    title: 'Chevrolet Cavalier',
    body: `America's best-selling compact car.

The Chevrolet Cavalier remains one of General Motors' most successful vehicles.

AVAILABLE MODELS
• Coupe
• Sedan
• Wagon
• Convertible

FEATURES
• Front-wheel drive
• Excellent fuel economy
• Comfortable ride
• Affordable maintenance

Typical Price: $6,500–$9,000 depending on trim.

Consumer surveys continue to praise the Cavalier for reliability and value.`,
  },
  {
    id: 'chrysler_1',
    brand: 'CHRYSLER',
    icon: '🚐',
    color: '#0891b2',
    anim: 'drive',
    matchText: "Chrysler introduces a new way to travel with its innovative minivan.",
    title: 'Chrysler Minivan',
    body: `A new way to move America.

Lee Iacocca and Chrysler have introduced a revolutionary vehicle.

The new Dodge Caravan and Plymouth Voyager combine the comfort of a car with the room of a van.

WHY FAMILIES LOVE IT
• Seats up to seven
• Sliding side door
• Massive cargo area
• Better fuel economy than full-size vans
• Easy to park

Starting Price: Approximately $8,500–$10,500.

INDUSTRY BUZZ
Many automotive journalists believe the minivan may create an entirely new vehicle category.

1984 Fun Fact: Most competitors don't yet have a direct answer to Chrysler's new design.`,
  },
  {
    id: 'goodyear_1',
    brand: 'GOODYEAR',
    icon: '🛞',
    color: '#fbbf24',
    anim: 'blimp',
    matchText: "Goodyear reminds you that quality tires make a difference.",
    title: 'Goodyear Tires',
    body: `Because so much is riding on your tires.

For generations, Goodyear has helped keep American families safely on the road.

POPULAR PRODUCTS
• All-season tires
• Radial passenger tires
• Light truck tires
• Performance tires

WHY DRIVERS CHOOSE GOODYEAR
• Long tread life
• Strong wet-weather traction
• Nationwide dealer network

Look for the famous Goodyear blimp at sporting events around the country.

"Goodyear. Because so much is riding on your tires."`,
  },
  {
    id: 'aaa_1',
    brand: 'AAA',
    icon: '🗺️',
    color: '#16a34a',
    anim: 'route',
    matchText: "Plan your summer vacation with AAA.",
    title: 'AAA Travel',
    body: `Plan your next great American adventure.

Whether you're heading to the Grand Canyon, Yellowstone, Disney World, or the beaches of California, AAA can help you get there.

AAA MEMBERSHIP BENEFITS
• Emergency roadside assistance
• Free maps
• Trip planning
• Tour books
• Hotel discounts
• Travel advice

MOST REQUESTED MAPS IN 1984
• Interstate Highway Atlas
• Route 66 Guides
• National Park Maps
• State Highway Maps

Fun Fact: Before GPS and smartphones, millions of Americans planned entire vacations using AAA TripTik route books.`,
  },
  {
    id: 'broadcast_1',
    brand: 'NETWORK BROADCAST',
    icon: '📡',
    color: '#94a3b8',
    anim: 'static',
    matchText: "Thanks for joining us today. We'll be back with more baseball right after this.",
    title: "We'll Be Back After This",
    body: `We'll return to baseball in just a moment.

This game is being brought to you by America's leading companies and products.

Stay tuned for more Major League Baseball action after these messages.

While we pause for station identification, take a moment to stretch, grab a snack, or check the scorebook.

You're watching 1984 Baseball.`,
    rareVariant: {
      title: 'This Concludes Our Advertising Break',
      body: `This concludes our advertising break.

Coming up:

• Major League Baseball
• SportsCenter Highlights
• Local News at 10
• Tonight Show with Johnny Carson

Stay tuned.`,
    },
    ultraRareVariant: {
      title: 'Technical Difficulties',
      body: `Please Stand By

The station is currently experiencing technical difficulties.

A color-bar test pattern briefly appears before normal programming resumes.

We apologize for the interruption.`,
      achievement: 'broadcast_interruption',
    },
  },
];

// Tracking for viewed general products ads and achievement triggers
const VIEWED_ADS = new Set();

/**
 * Find the general products entry matching a given ad text.
 * @param {string} adText
 * @returns {object|null}
 */
export function findGeneralProductsEntry(adText) {
  return ENTRIES.find(e => e.matchText === adText) || null;
}

/**
 * Get a general products entry by ID.
 * @param {string} id
 * @returns {object|null}
 */
export function getGeneralProductsEntry(id) {
  return ENTRIES.find(e => e.id === id) || null;
}

/**
 * Track a view of a general products ad. Returns newly unlocked achievement IDs.
 * @param {string} entryId
 * @returns {string[]}
 */
export function trackGeneralProductsView(entryId) {
  VIEWED_ADS.add(entryId);
  const unlocked = [];

  if (VIEWED_ADS.size === 1) {
    unlocked.push('commercial_break');
  }
  if (VIEWED_ADS.size >= 10) {
    unlocked.push('channel_surfer');
  }
  if (VIEWED_ADS.size >= 25) {
    unlocked.push('prime_time');
  }

  return unlocked;
}

/**
 * Get count of viewed general products ads.
 * @returns {number}
 */
export function getGeneralProductsViewCount() {
  return VIEWED_ADS.size;
}

/**
 * Check if a specific entry has been viewed.
 * @param {string} entryId
 * @returns {boolean}
 */
export function hasGeneralProductsBeenViewed(entryId) {
  return VIEWED_ADS.has(entryId);
}