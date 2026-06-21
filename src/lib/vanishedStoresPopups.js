// Vanished Stores interactive popups for the 1984 game experience
// 25 entries matching the vanished stores banner ads in broadcastAds.js (#701-725)

const ENTRIES = [
  {
    id: 'montgomery_ward',
    store: 'Montgomery Ward',
    icon: '🏬',
    matchText: 'Visit Montgomery Ward for quality products at affordable prices.',
    tagline: 'Quality products for American families since 1872.',
    founded: '1872',
    description: 'Visit Montgomery Ward this weekend and discover values throughout every department.',
    featured: { 'Color Television': '$399', 'Microwave Oven': '$189', "Men's Jeans": '$19.99', 'Schwinn Bicycle': '$129' },
    funFact: 'Montgomery Ward was once one of America\'s largest department store chains.',
    catalog: true,
  },
  {
    id: 'montgomery_ward_catalog',
    store: 'Montgomery Ward Catalog',
    icon: '📖',
    matchText: 'Montgomery Ward has great values throughout the store.',
    tagline: 'America\'s favorite catalog shopping.',
    description: 'The Fall 1984 Montgomery Ward Catalog has arrived with over 1,000 pages of shopping delivered right to your home.',
    sections: ['Electronics', 'Furniture', 'Appliances', 'Sporting Goods', 'Toys', 'Fashion'],
    funFact: 'The Ward catalog was a treasured resource for millions of American families.',
  },
  {
    id: 'woolworth',
    store: 'Woolworth',
    icon: '🍭',
    matchText: 'Stop by Woolworth this weekend.',
    tagline: 'America\'s Five-and-Dime Store.',
    description: 'Stop by Woolworth this weekend and browse candy, toys, school supplies, housewares, and sewing goods.',
    items: ['Candy', 'Toys', 'School Supplies', 'Housewares', 'Sewing Goods'],
    lunchCounter: true,
    special: 'Grilled Cheese & Soup — $1.99',
    funFact: 'Woolworth five-and-dime stores were a fixture in American Main Streets for over 100 years.',
  },
  {
    id: 'woolworth_lunch',
    store: 'Woolworth Lunch Counter',
    icon: '☕',
    matchText: 'Woolworth remains a trusted American retailer.',
    tagline: 'A favorite meeting place for shoppers across America.',
    description: 'For generations, Woolworth has been more than a store. Enjoy hamburgers, milkshakes, pie, and coffee at the famous lunch counter.',
    menu: ['Hamburgers', 'Milkshakes', 'Pie', 'Coffee'],
    funFact: 'The Woolworth lunch counter was an iconic gathering place in American culture.',
  },
  {
    id: 'venture',
    store: 'Venture',
    icon: '🎯',
    matchText: 'Venture stores invite you to save this week.',
    tagline: 'Venture means value.',
    description: 'This week\'s specials include Atari 2600, men\'s shirts, tennis shoes, and cassette players.',
    specials: { 'Atari 2600': '$89', "Men's Shirts": '$7.99', 'Tennis Shoes': '$14.99', 'Cassette Players': '$29.99' },
    funFact: 'Venture stores were known for their competitive pricing on electronics and clothing.',
  },
  {
    id: 'kmart',
    store: 'Kmart',
    icon: '💥',
    matchText: 'Blue light specials continue at Kmart.',
    tagline: 'Attention Kmart shoppers!',
    description: 'The Blue Light Special is back. This hour only: Towels 50% Off, Children\'s Clothing $4.99, Board Games $7.99.',
    famous: 'Blue Light Special',
    announcement: 'Blue Light Special in aisle 7!',
    specials: { 'Towels': '50% Off', "Children's Clothing": '$4.99', 'Board Games': '$7.99' },
    funFact: 'Kmart\'s Blue Light Special became an iconic retail phenomenon of the 1980s.',
  },
  {
    id: 'service_merchandise',
    store: 'Service Merchandise',
    icon: '📦',
    matchText: 'Service Merchandise has gifts for every occasion.',
    tagline: 'Shopping from the future.',
    description: 'Browse the showroom, place your order, and watch your merchandise arrive on the conveyor belt.',
    innovation: 'Conveyor Belt Delivery System',
    featured: ['Jewelry', 'Cameras', 'Electronics', 'Sporting Goods'],
    funFact: 'Service Merchandise pioneered the showroom-and-conveyor ordering system.',
  },
  {
    id: 'service_merchandise_showroom',
    store: 'Service Merchandise Showroom',
    icon: '🎬',
    matchText: 'Visit Service Merchandise and browse their showroom.',
    tagline: 'See it before you buy it.',
    description: 'Popular items this week include Sony Walkman, Nikon cameras, gold jewelry, and Atari consoles.',
    items: { 'Sony Walkman': 'Featured', 'Nikon Cameras': 'Featured', 'Gold Jewelry': 'Featured', 'Atari Consoles': 'Featured' },
    funFact: 'The Service Merchandise showroom experience was unlike any other retailer of the era.',
  },
  {
    id: 'gold_circle',
    store: 'Gold Circle',
    icon: '🔴',
    matchText: 'Gold Circle offers savings throughout the store.',
    tagline: 'Big savings every day.',
    description: 'Gold Circle continues to offer discounts throughout the store on VCRs, stereos, patio furniture, and summer clothing.',
    specials: ['VCRs', 'Stereo Systems', 'Patio Furniture', 'Summer Clothing'],
    funFact: 'Gold Circle was a discount department store chain popular in the Midwest and Mid-Atlantic.',
  },
  {
    id: 'ames',
    store: 'Ames Department Stores',
    icon: '📚',
    matchText: 'Ames Department Stores welcomes shoppers this weekend.',
    tagline: 'Ames knows value.',
    description: 'Back-to-school savings begin now with notebooks, Trapper Keepers, children\'s jeans, and athletic shoes.',
    backToSchool: true,
    specials: { 'Notebooks': '19¢', 'Trapper Keepers': '$3.99', "Children's Jeans": '$8.99', 'Athletic Shoes': '$12.99' },
    funFact: 'Ames Department Stores was a major retailer with hundreds of locations across America.',
  },
  {
    id: 'ben_franklin',
    store: 'Ben Franklin',
    icon: '🧵',
    matchText: 'Stop by your neighborhood Ben Franklin store.',
    tagline: 'Your neighborhood variety store.',
    description: 'Visit Ben Franklin for crafts, sewing supplies, candy, toys, and seasonal decorations.',
    items: ['Crafts', 'Sewing Supplies', 'Candy', 'Toys', 'Seasonal Decorations'],
    local: true,
    funFact: 'Ben Franklin stores were a small-town tradition and staple of American communities.',
  },
  {
    id: 'department_store',
    store: 'Department Store Sale',
    icon: '🏷️',
    matchText: 'Value and selection await at your local department store.',
    tagline: 'Storewide savings event.',
    description: 'This weekend only: Men\'s wear, ladies fashion, electronics, appliances, and furniture reduced up to 40%.',
    departments: ['Men\'s Wear', 'Ladies Fashion', 'Electronics', 'Appliances', 'Furniture'],
    discount: 'Up to 40% off',
    funFact: 'Department stores were the social and shopping centers of American communities.',
  },
  {
    id: 'shop_early',
    store: 'Shop Early for Best Selection',
    icon: '⏰',
    matchText: 'Shop early for the best selection.',
    tagline: 'The best selection won\'t last.',
    description: 'Popular items are selling fast. Customers are encouraged to shop early before quantities become limited.',
    warning: 'When they\'re gone, they\'re gone.',
    funFact: 'Advertised specials were often limited in quantity, creating urgency for shoppers.',
  },
  {
    id: 'back_to_school',
    store: 'Back-to-School Sale',
    icon: '✏️',
    matchText: 'Back-to-school savings are now underway.',
    tagline: 'School starts soon.',
    description: 'Everything students need: Folders, crayons, lunch boxes, and backpacks at special prices.',
    items: { 'Folders': '29¢', 'Crayons': '79¢', 'Lunch Boxes': '$4.99', 'Backpacks': '$9.99' },
    funFact: 'Back-to-school shopping was one of the biggest retail events of the year.',
  },
  {
    id: 'family_fashions',
    store: 'Family Fashions',
    icon: '👕',
    matchText: 'Family fashions are available now.',
    tagline: 'New fall styles have arrived.',
    description: 'Featuring Members Only jackets, Jordache jeans, Wrangler denim, and Izod shirts.',
    brands: ['Members Only Jackets', 'Jordache Jeans', 'Wrangler Denim', 'Izod Shirts'],
    funFact: 'Designer jeans and branded clothing were must-haves for 1980s fashion.',
  },
  {
    id: 'appliance_sale',
    store: 'Appliance Sale',
    icon: '🔌',
    matchText: 'Home appliances are on sale this week.',
    tagline: 'Upgrade your home.',
    description: 'This week\'s specials: Kenmore washer, refrigerator, and microwave oven. Financing available for qualified buyers.',
    specials: { 'Kenmore Washer': '$249', 'Refrigerator': '$499', 'Microwave Oven': '$169' },
    financing: true,
    funFact: 'Major appliance sales were significant household purchases for American families.',
  },
  {
    id: 'quality_value',
    store: 'Quality and Value',
    icon: '⭐',
    matchText: 'Discover quality and value under one roof.',
    tagline: 'Why pay more?',
    description: 'From clothing to electronics, today\'s department stores offer more selection than ever before.',
    convenience: 'Thousands of items in one location',
    funFact: 'Department stores positioned themselves as one-stop shopping destinations.',
  },
  {
    id: 'electronics_weekend',
    store: 'Electronics Weekend',
    icon: '📺',
    matchText: 'Save on electronics this weekend.',
    tagline: 'Technology has never been more affordable.',
    description: 'Featured items: Atari 2600, Commodore 64, Sony Walkman, and VHS VCR.',
    specials: { 'Atari 2600': '$89', 'Commodore 64': '$199', 'Sony Walkman': '$79', 'VHS VCR': '$299' },
    funFact: 'Home electronics sales were driving retail growth in the 1980s.',
  },
  {
    id: 'furniture_clearance',
    store: 'Furniture Clearance',
    icon: '🛋️',
    matchText: 'Furniture specials continue throughout the month.',
    tagline: 'Make room for new inventory.',
    description: 'Save on sofas, recliners, dining sets, and bedroom furniture. Many floor models priced to move.',
    items: ['Sofas', 'Recliners', 'Dining Sets', 'Bedroom Furniture'],
    floorModels: true,
    funFact: 'Furniture clearance events were popular opportunities for home shoppers.',
  },
  {
    id: 'limited_offers',
    store: 'Limited-Time Offers',
    icon: '⏳',
    matchText: 'Don\'t miss these limited-time offers.',
    tagline: 'This week only.',
    description: 'Store managers have authorized special markdowns throughout the store. Look for red clearance tags. Savings end Sunday night.',
    urgent: true,
    clearanceTags: 'Red clearance tags throughout',
    funFact: 'Limited-time offers created shopping excitement and drove foot traffic.',
  },
  {
    id: 'see_store_details',
    store: 'See Store for Details',
    icon: '📋',
    matchText: 'See store for complete details.',
    tagline: 'Details matter.',
    description: 'Special financing, extended warranties, layaway plans, and gift certificates. Ask a sales associate for complete information.',
    services: ['Special Financing', 'Extended Warranties', 'Layaway Plans', 'Gift Certificates'],
    funFact: 'Store services and financing options were competitive advantages for retailers.',
  },
  {
    id: 'quantities_limited',
    store: 'Quantities May Be Limited',
    icon: '⚠️',
    matchText: 'Quantities may be limited.',
    tagline: 'Popular items selling fast.',
    description: 'Recent advertisements have generated strong customer response. Limited quantities remain on select merchandise. No rain checks.',
    warning: 'No rain checks',
    funFact: 'The threat of limited quantities motivated shoppers to act quickly.',
  },
  {
    id: 'shop_local',
    store: 'Shop Local',
    icon: '🏘️',
    matchText: 'Shop local whenever possible.',
    tagline: 'Support your community.',
    description: 'Your local stores employ local workers and support local schools and organizations. Thank you for shopping close to home.',
    community: true,
    funFact: 'Shopping local was an important part of American community life.',
  },
  {
    id: 'friendly_service',
    store: 'Friendly Service',
    icon: '🤝',
    matchText: 'Friendly service makes the difference.',
    tagline: 'The difference is people.',
    description: 'Knowledgeable employees, helpful sales staff, and personal service. The things that keep customers coming back.',
    values: ['Knowledgeable Employees', 'Helpful Sales Staff', 'Personal Service'],
    funFact: 'Personal service was a key differentiator for retail stores in the 1980s.',
  },
  {
    id: 'american_mall',
    store: 'The American Mall',
    icon: '🛍️',
    matchText: 'Visit your favorite department store today.',
    tagline: 'A Saturday tradition.',
    description: 'Spend the day at your local shopping center. Visit Sears, JCPenney, Kmart, B. Dalton, Musicland, and Orange Julius.',
    anchor: ['Sears', 'JCPenney', 'Kmart'],
    tenants: ['B. Dalton Booksellers', 'Musicland', 'Orange Julius'],
    cultural: 'For millions of Americans in 1984, the mall isn\'t just a place to shop—it\'s where the weekend begins.',
    funFact: 'The shopping mall was the center of American leisure and socializing in the 1980s.',
  },
];

// Tracking for viewed vanished stores ads
const VIEWED_ADS = new Set();
const STORE_VIEW_COUNTS = {};

/**
 * Find the vanished store entry matching a given ad text.
 * @param {string} adText
 * @returns {object|null}
 */
export function findVanishedStoresEntry(adText) {
  return ENTRIES.find(e => e.matchText === adText) || null;
}

/**
 * Track a view of a vanished stores ad. Returns newly unlocked achievement IDs.
 * @param {string} entryId
 * @returns {string[]}
 */
export function trackVanishedStoresView(entryId) {
  VIEWED_ADS.add(entryId);
  STORE_VIEW_COUNTS[entryId] = (STORE_VIEW_COUNTS[entryId] || 0) + 1;
  const unlocked = [];

  if (VIEWED_ADS.size >= 5) {
    unlocked.push('mall_visitor');
  }
  if (VIEWED_ADS.size >= 15) {
    unlocked.push('mall_regular');
  }
  if (VIEWED_ADS.size >= 25) {
    unlocked.push('mall_historian');
  }

  return unlocked;
}

/**
 * Get count of viewed vanished stores ads.
 * @returns {number}
 */
export function getVanishedStoresViewCount() {
  return VIEWED_ADS.size;
}