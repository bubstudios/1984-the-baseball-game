// Generic banner text matchers for unmatched ads that fall through the detection chain
// Maps common banner keywords to rich popup libraries

export function findGenericBannerEntry(adText) {
  if (!adText) return null;

  // Film/vacation photos
  if (adText.includes('vacation photos to life') || adText.includes('vacation film')) {
    return {
      id: 'film_vacation',
      type: 'film',
      title: 'Capture Your Memories',
      description: 'Film processing was the lifeline for preserving vacation memories in 1984.',
      content: 'Drop off your rolls at participating photo labs for development within days. Color prints bring those precious vacation moments to life.',
    };
  }

  // Sports involvement / charity
  if (adText.includes('involve in sports') || adText.includes('get involved in sports') || adText.includes('children') && adText.includes('sports')) {
    return {
      id: 'youth_sports',
      type: 'charity',
      title: 'Youth Sports Matter',
      description: 'Local youth baseball and recreation programs build character and community.',
      content: 'Encourage children to participate in Little League, park district sports, and summer camps. Registration is open for all skill levels.',
    };
  }

  // Fashion / shopping
  if (adText.includes('latest fashions') || adText.includes('browse') && adText.includes('fashions')) {
    return {
      id: 'fashion_shopping',
      type: 'retail',
      title: 'Browse the Latest Fashions',
      description: 'Department stores and boutiques throughout the mall showcase 1984 trends.',
      content: 'Visit your local mall for back-to-school styles, summer wear, and classic fashions. New arrivals every week.',
    };
  }

  // Newspaper delivery
  if (adText.includes('newspaper delivery') || (adText.includes('newspaper') && adText.includes('seven days'))) {
    return {
      id: 'newspaper_delivery',
      type: 'service',
      title: 'Newspaper Delivery Service',
      description: 'Home delivery brings local news and sports coverage right to your door.',
      content: 'Subscribe to daily and Sunday editions. Never miss box scores, weather, or classified ads. Call your local newspaper office to start service.',
    };
  }

  // Arcade
  if (adText.includes('arcade') || adText.includes('visit your local arcade')) {
    return {
      id: 'local_arcade',
      type: 'recreation',
      title: 'Visit Your Local Arcade',
      description: 'Arcades remain the hottest hangout for video game enthusiasts.',
      content: 'Bring quarters and challenge friends to Pac-Man, Galaga, Donkey Kong, and the latest arrivals. Arcades are open daily.',
    };
  }

  // Family photographs
  if (adText.includes('family photographs') || (adText.includes('family') && adText.includes('photos'))) {
    return {
      id: 'family_photos',
      type: 'film',
      title: 'Family Photographs',
      description: 'Preserve family memories through photography.',
      content: 'Keep your camera ready for birthdays, holidays, and special moments. Film processing services are available at local shops for lasting prints.',
    };
  }

  // Foul balls / fan experience
  if (adText.includes('foul balls') || adText.includes('fan') && adText.includes('balls')) {
    return {
      id: 'foul_ball_catch',
      type: 'ballpark',
      title: 'Foul Ball Catch!',
      description: 'A legendary ballpark moment for any fan.',
      content: 'Bringing a glove and snagging a foul ball is a memory that lasts forever. Keep your glove ready in the stands!',
    };
  }

  // Sports/business/entertainment
   if (adText.includes('Sports, business, entertainment') || (adText.includes('sports') && adText.includes('business') && adText.includes('entertainment'))) {
     return {
       id: 'news_coverage',
       type: 'media',
       title: 'Sports, Business, Entertainment',
       description: 'Complete news coverage across all sections.',
       content: 'Your local newspaper covers everything: sports box scores, business news, entertainment listings, and classified ads. Stay informed daily.',
     };
   }

   // Future/exploration sponsor messages
   if (adText.includes('future belongs to those who explore') || adText.includes('future') && adText.includes('explore')) {
     return {
       id: 'future_explore',
       type: 'service',
       title: 'The Future Belongs to Those Who Explore',
       description: 'Sponsor Message - Inspiring exploration and discovery.',
       content: 'In 1984, innovation and curiosity drive progress. From cutting-edge technology to new frontiers, the spirit of exploration shapes tomorrow\'s opportunities. Take the next step. Explore what\'s possible.',
     };
   }

   return null;
  }