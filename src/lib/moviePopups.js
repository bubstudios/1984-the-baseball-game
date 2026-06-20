// Movie Popups — interactive detail cards for movie broadcast ads
// 25 movies × 3 entries (Synopsis, Review, Trivia) = 75 core entries
// Plus bonus content: Box Office, Coming Soon, Concessions, Drive-Ins,
// Letters, Incidents, Surveys, Trivia Challenges, Gossip, Quotes

// ── Movie Popup Data ──

const MOVIE_ENTRIES = {
  // #26-28: Ghostbusters
  26: {
    id: 'movie_26', movie: 'Ghostbusters', bannerIndex: 26,
    synopsis: {
      title: 'Ghostbusters (1984)',
      meta: 'Rated PG · 105 Minutes',
      body: 'After being dismissed from their university positions, three parapsychologists open a ghost-removal business in New York City. Business booms when supernatural activity begins increasing throughout the city.',
      cast: 'Bill Murray · Dan Aykroyd · Harold Ramis · Sigourney Weaver · Rick Moranis',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"Ghostbusters combines comedy, science fiction, and special effects into one of the summer\'s most entertaining films."' },
    sillyReview: { rating: 1, source: 'The Cincinnati Skeptic', text: '"I was promised ghosts. I got accountants, marshmallows, and Bill Murray. Somehow it still made money."' },
    trivia: 'The Stay Puft Marshmallow Man suit weighed nearly 75 pounds and required multiple takes because portions of it kept overheating.',
  },
  27: {
    id: 'movie_27', movie: 'Ghostbusters', bannerIndex: 27,
    synopsis: {
      title: 'Now Playing Nationwide',
      meta: '',
      body: 'A mysterious force is opening supernatural gateways throughout New York City. Only the Ghostbusters stand between civilization and total chaos.',
      cast: '',
    },
    review: { rating: 4, source: 'Moviegoer Survey', text: '"Audiences continue returning for repeat viewings, making Ghostbusters one of the biggest hits of 1984."' },
    trivia: 'Dan Aykroyd\'s original script featured Ghostbusters traveling between dimensions and fighting ghosts across multiple planets.',
  },
  28: {
    id: 'movie_28', movie: 'Ghostbusters', bannerIndex: 28,
    synopsis: {
      title: 'Ghostbusters',
      meta: '',
      body: 'Three unlikely entrepreneurs become celebrities after proving ghosts are real.',
      cast: '',
    },
    review: { rating: 1, source: 'Disappointed Horror Fan Monthly', text: '"Not nearly enough screaming. Too many jokes. Ghosts should be scarier."' },
    trivia: 'Slimer was partially inspired by comedian John Belushi.',
  },

  // #29-31: Beverly Hills Cop
  29: {
    id: 'movie_29', movie: 'Beverly Hills Cop', bannerIndex: 29,
    synopsis: {
      title: 'Beverly Hills Cop (1984)',
      meta: 'Rated R · 105 Minutes',
      body: 'Detroit detective Axel Foley travels to Beverly Hills to investigate the murder of a friend and quickly clashes with local authorities.',
      cast: 'Eddie Murphy · Judge Reinhold · John Ashton · Ronny Cox',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"Eddie Murphy\'s energy turns Beverly Hills Cop into one of the year\'s most enjoyable action comedies."' },
    trivia: 'The role of Axel Foley was originally developed for Sylvester Stallone before Eddie Murphy joined the project.',
  },
  30: {
    id: 'movie_30', movie: 'Beverly Hills Cop', bannerIndex: 30,
    synopsis: {
      title: 'Beverly Hills Cop',
      meta: '',
      body: 'Axel Foley\'s street-smart approach doesn\'t exactly fit in among Beverly Hills police officers.',
      cast: '',
    },
    sillyReview: { rating: 1, source: 'Confused Viewer Weekly', text: '"Movie contains far fewer Beverly Hills cops than title suggests."' },
    trivia: 'The famous Axel F theme became a major radio hit in its own right.',
  },
  31: {
    id: 'movie_31', movie: 'Beverly Hills Cop', bannerIndex: 31,
    synopsis: {
      title: 'Beverly Hills Cop',
      meta: '',
      body: 'A murder investigation leads Axel Foley into a world of luxury cars, expensive homes, and dangerous criminals.',
      cast: '',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"Murphy proves he can carry a major motion picture."' },
    trivia: 'Many of Eddie Murphy\'s funniest lines were improvised.',
  },

  // #32-34: The Karate Kid
  32: {
    id: 'movie_32', movie: 'The Karate Kid', bannerIndex: 32,
    synopsis: {
      title: 'The Karate Kid (1984)',
      meta: 'Rated PG · 126 Minutes',
      body: 'A teenager learns karate from a wise mentor and prepares to face local bullies in tournament competition.',
      cast: 'Ralph Macchio · Pat Morita · Elisabeth Shue',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"A simple story told exceptionally well."' },
    trivia: 'Pat Morita received an Academy Award nomination for his portrayal of Mr. Miyagi.',
  },
  33: {
    id: 'movie_33', movie: 'The Karate Kid', bannerIndex: 33,
    synopsis: {
      title: 'The Karate Kid',
      meta: '',
      body: 'Daniel LaRusso discovers that karate is about discipline and balance, not simply fighting.',
      cast: '',
    },
    sillyReview: { rating: 1, source: 'Action Fan Magazine', text: '"Too much waxing. Not enough kicking."' },
    trivia: 'The famous "wax on, wax off" scenes were inspired by real martial arts training techniques.',
  },
  34: {
    id: 'movie_34', movie: 'The Karate Kid', bannerIndex: 34,
    synopsis: {
      title: 'The Karate Kid',
      meta: '',
      body: 'A high-school rivalry builds toward an unforgettable tournament showdown.',
      cast: '',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"One of the year\'s most satisfying crowd-pleasers."' },
    trivia: 'William Zabka had no martial arts experience before filming began.',
  },

  // #35-37: Gremlins
  35: {
    id: 'movie_35', movie: 'Gremlins', bannerIndex: 35,
    synopsis: {
      title: 'Gremlins (1984)',
      meta: 'Rated PG',
      body: 'A young man receives a mysterious creature called a Mogwai and soon discovers three important rules that should never be broken.',
      cast: '',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"Funny, scary, and unlike anything else in theaters."' },
    trivia: 'Gremlins helped inspire the creation of the PG-13 rating the following year.',
  },
  36: {
    id: 'movie_36', movie: 'Gremlins', bannerIndex: 36,
    synopsis: {
      title: 'Gremlins',
      meta: '',
      body: 'What begins as an unusual pet quickly becomes a town-wide disaster.',
      cast: '',
    },
    sillyReview: { rating: 1, source: 'Pet Owners Digest', text: '"Absolutely unsuitable household pets."' },
    trivia: 'Hundreds of puppets and animatronics were built for production.',
  },
  37: {
    id: 'movie_37', movie: 'Gremlins', bannerIndex: 37,
    synopsis: {
      title: 'Gremlins',
      meta: '',
      body: 'Small creatures. Big problems.',
      cast: '',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"Joe Dante creates a perfect blend of horror and comedy."' },
    trivia: 'Steven Spielberg served as executive producer.',
  },

  // #38-40: Indiana Jones and the Temple of Doom
  38: {
    id: 'movie_38', movie: 'Indiana Jones and the Temple of Doom', bannerIndex: 38,
    synopsis: {
      title: 'Indiana Jones and the Temple of Doom (1984)',
      meta: 'Rated PG',
      body: 'Indiana Jones travels to India to recover sacred stones and confront a mysterious cult.',
      cast: 'Harrison Ford · Kate Capshaw · Ke Huy Quan',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"A darker and more intense adventure than Raiders of the Lost Ark."' },
    trivia: 'More than 600 snakes were used during production.',
  },
  39: {
    id: 'movie_39', movie: 'Indiana Jones and the Temple of Doom', bannerIndex: 39,
    synopsis: {
      title: 'Temple of Doom',
      meta: '',
      body: 'Adventure, danger, and ancient mysteries await Indiana Jones.',
      cast: '',
    },
    sillyReview: { rating: 1, source: 'Snake Haters Association', text: '"Far too many snakes."' },
    trivia: 'Kate Capshaw later married director Steven Spielberg.',
  },
  40: {
    id: 'movie_40', movie: 'Indiana Jones and the Temple of Doom', bannerIndex: 40,
    synopsis: {
      title: 'Temple of Doom',
      meta: '',
      body: 'Indiana Jones races to save kidnapped children and recover a legendary treasure.',
      cast: '',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"Harrison Ford remains one of Hollywood\'s most reliable adventure stars."' },
    trivia: 'The mine-cart chase became one of the most technically challenging sequences filmed in the 1980s.',
  },

  // #41-43: Splash
  41: {
    id: 'movie_41', movie: 'Splash', bannerIndex: 41,
    synopsis: {
      title: 'Splash (1984)',
      meta: 'Rated PG · 111 Minutes',
      body: 'A New York businessman falls in love with a mysterious woman who is hiding an unbelievable secret.',
      cast: 'Tom Hanks · Daryl Hannah · John Candy · Eugene Levy',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"A charming fantasy comedy that helped establish Tom Hanks as a major star."' },
    trivia: 'The movie was the first release from Walt Disney\'s new Touchstone Pictures label.',
  },
  42: {
    id: 'movie_42', movie: 'Splash', bannerIndex: 42,
    synopsis: {
      title: 'Splash',
      meta: '',
      body: 'Allen Bauer\'s ordinary life changes forever after a chance reunion with a woman he first encountered as a child.',
      cast: '',
    },
    sillyReview: { rating: 1, source: 'Marine Biology Monthly', text: '"Contains several inaccuracies regarding mermaid behavior."' },
    trivia: 'Daryl Hannah spent hours underwater training to perform many swimming scenes herself.',
  },

  // #43-44: Romancing the Stone (user used #44 twice — adjusting)
  43: {
    id: 'movie_43', movie: 'Romancing the Stone', bannerIndex: 43,
    synopsis: {
      title: 'Romancing the Stone (1984)',
      meta: 'Rated PG · 106 Minutes',
      body: 'A romance novelist travels to Colombia and finds herself living an adventure even wilder than the stories she writes.',
      cast: 'Michael Douglas · Kathleen Turner · Danny DeVito',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"Adventure, comedy, and romance blended into one of the year\'s biggest surprises."' },
    trivia: 'Many studio executives believed the film would fail before release.',
  },
  44: {
    id: 'movie_44', movie: 'Romancing the Stone', bannerIndex: 44,
    synopsis: {
      title: 'Romancing the Stone',
      meta: '',
      body: 'Novelist Joan Wilder reluctantly teams with adventurer Jack Colton to recover a priceless treasure.',
      cast: '',
    },
    sillyReview: { rating: 1, source: 'Professional Treasure Hunters Association', text: '"Far too much romance. Not enough maps."' },
    trivia: 'The success of the film helped inspire a sequel, The Jewel of the Nile.',
  },
  45: {
    id: 'movie_45', movie: 'Romancing the Stone', bannerIndex: 45,
    synopsis: {
      title: 'Romancing the Stone',
      meta: '',
      body: 'What starts as a rescue mission becomes a race against criminals through the jungles of Colombia.',
      cast: '',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"Michael Douglas and Kathleen Turner have tremendous chemistry."' },
    trivia: 'Danny DeVito filmed many scenes in difficult jungle conditions and later joked about the experience.',
  },

  // #46-48: The Natural
  46: {
    id: 'movie_46', movie: 'The Natural', bannerIndex: 46,
    synopsis: {
      title: 'The Natural (1984)',
      meta: 'Rated PG · 138 Minutes',
      body: 'A mysterious baseball player with extraordinary talent receives one final chance to fulfill his destiny.',
      cast: 'Robert Redford · Robert Duvall · Glenn Close · Kim Basinger',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"A beautifully photographed baseball fantasy with one of the most memorable endings ever filmed."' },
    trivia: 'The film was adapted from Bernard Malamud\'s acclaimed novel.',
  },
  47: {
    id: 'movie_47', movie: 'The Natural', bannerIndex: 47,
    synopsis: {
      title: 'The Natural',
      meta: '',
      body: 'Roy Hobbs arrives out of nowhere and begins changing the fortunes of a struggling baseball team.',
      cast: '',
    },
    sillyReview: { rating: 1, source: 'Baseball Purist Quarterly', text: '"Unrealistic. Nobody hits baseballs that dramatically."' },
    trivia: 'Robert Redford trained extensively with baseball instructors before filming.',
  },
  48: {
    id: 'movie_48', movie: 'The Natural', bannerIndex: 48,
    synopsis: {
      title: 'The Natural',
      meta: '',
      body: 'A legendary bat named Wonderboy becomes the symbol of one man\'s baseball journey.',
      cast: '',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"One of the finest sports movies ever made."' },
    trivia: 'The iconic lightning-strike climax was created using a combination of practical effects and optical work.',
  },

  // #49-51: Footloose
  49: {
    id: 'movie_49', movie: 'Footloose', bannerIndex: 49,
    synopsis: {
      title: 'Footloose (1984)',
      meta: 'Rated PG · 107 Minutes',
      body: 'A teenager from Chicago moves to a small town where dancing has been outlawed.',
      cast: 'Kevin Bacon · Lori Singer · John Lithgow',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"A fun, energetic crowd-pleaser with a hit soundtrack."' },
    trivia: 'Kevin Bacon performed many of his own dance sequences.',
  },
  50: {
    id: 'movie_50', movie: 'Footloose', bannerIndex: 50,
    synopsis: {
      title: 'Footloose',
      meta: '',
      body: 'Ren McCormack challenges local traditions while trying to bring music and dancing back to town.',
      cast: '',
    },
    sillyReview: { rating: 1, source: 'Association of Extremely Serious Adults', text: '"Far too much dancing."' },
    trivia: 'The soundtrack produced several major radio hits.',
  },
  51: {
    id: 'movie_51', movie: 'Footloose', bannerIndex: 51,
    synopsis: {
      title: 'Footloose',
      meta: '',
      body: 'Ren McCormack discovers that changing a town\'s rules is harder than learning the latest dance moves.',
      cast: '',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"Kevin Bacon delivers the performance that may make him a household name."' },
    trivia: 'The warehouse dance sequence required several weeks of rehearsal and filming.',
  },
  52: {
    id: 'movie_52', movie: 'Footloose', bannerIndex: 52,
    synopsis: {
      title: 'Footloose',
      meta: '',
      body: 'A town divided over music, dancing, and tradition heads toward an emotional showdown.',
      cast: '',
    },
    sillyReview: { rating: 1, source: 'National Association of Church Basement Committees', text: '"Far too much dancing. Not enough committee meetings."' },
    trivia: 'Several songs from the soundtrack became Top 10 hits.',
  },

  // #53-55: Star Trek III
  53: {
    id: 'movie_53', movie: 'Star Trek III: The Search for Spock', bannerIndex: 53,
    synopsis: {
      title: 'Star Trek III: The Search for Spock (1984)',
      meta: 'Rated PG · 105 Minutes',
      body: 'Admiral Kirk and his crew risk everything to recover their fallen friend.',
      cast: 'William Shatner · Leonard Nimoy · DeForest Kelley · James Doohan',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"A satisfying continuation of the Star Trek saga."' },
    trivia: 'Leonard Nimoy directed the film while also appearing as Spock.',
  },
  54: {
    id: 'movie_54', movie: 'Star Trek III: The Search for Spock', bannerIndex: 54,
    synopsis: {
      title: 'Star Trek III',
      meta: '',
      body: 'Captain Kirk risks his career and his ship in an effort to save his closest friend.',
      cast: '',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"Fans of Star Trek will find plenty to enjoy in this emotional adventure."' },
    trivia: 'The destruction of the Enterprise shocked audiences when the film was released.',
  },
  55: {
    id: 'movie_55', movie: 'Star Trek III: The Search for Spock', bannerIndex: 55,
    synopsis: {
      title: 'Star Trek III',
      meta: '',
      body: 'The crew of the Enterprise must become fugitives to complete their mission.',
      cast: '',
    },
    sillyReview: { rating: 1, source: 'Federation Bureaucrat Monthly', text: '"Several regulations were violated. Strongly disapproved."' },
    trivia: 'Christopher Lloyd plays the film\'s Klingon villain.',
  },
  56: {
    id: 'movie_56', movie: 'Star Trek III: The Search for Spock', bannerIndex: 56,
    synopsis: {
      title: 'Star Trek III',
      meta: '',
      body: 'Friendship, sacrifice, and loyalty take center stage as Kirk faces impossible choices.',
      cast: '',
    },
    review: { rating: 4, source: 'National Movie Review', text: '"One of the strongest character-driven entries in the series."' },
    trivia: 'Leonard Nimoy personally pushed for a more emotional story.',
  },
};

// ── Bonus Content ──

const BONUS_ENTRIES = {
  // Box Office Reports — #56-60 in user's numbering, but our system continues from movie pool
  'box_office_1': { id: 'bonus_bo1', type: 'box_office', source: 'Summer Movie News', text: 'Ghostbusters remains one of the hottest tickets in America. Long lines continue to be reported in New York, Chicago, Los Angeles, and St. Louis.' },
  'box_office_2': { id: 'bonus_bo2', type: 'box_office', source: 'Entertainment Weekly', text: 'Beverly Hills Cop continues climbing the box office charts. Many theaters report sold-out evening showings.' },
  'box_office_3': { id: 'bonus_bo3', type: 'box_office', source: 'Hollywood Update', text: 'The Karate Kid has become one of the surprise success stories of 1984. Families and teenagers continue flocking to theaters.' },
  'box_office_4': { id: 'bonus_bo4', type: 'box_office', source: 'Cinema Report', text: 'Gremlins continues drawing large crowds despite causing several audience members to swear they\'ll never own unusual pets.' },
  'box_office_5': { id: 'bonus_bo5', type: 'box_office', source: 'Industry News', text: 'Indiana Jones and the Temple of Doom remains one of the year\'s most successful adventure films. Popcorn sales reportedly increase whenever snakes appear on-screen.' },

  // Coming Soon — #61-65
  'coming_1': { id: 'bonus_cs1', type: 'coming_soon', title: 'Dune', meta: 'Coming this holiday season.', text: 'The legendary science-fiction novel arrives on the big screen. Starring Kyle MacLachlan, Sting, and Max von Sydow.' },
  'coming_2': { id: 'bonus_cs2', type: 'coming_soon', title: '2010', meta: 'Opening this December.', text: 'The long-awaited sequel to 2001: A Space Odyssey.' },
  'coming_3': { id: 'bonus_cs3', type: 'coming_soon', title: 'The Terminator', meta: 'Opening soon. Rated R.', text: 'A mysterious stranger arrives from the future.' },
  'coming_4': { id: 'bonus_cs4', type: 'coming_soon', title: 'Johnny Dangerously', meta: 'Coming soon.', text: 'Michael Keaton stars in a comedy about crime, family, and bad decisions.' },
  'coming_5': { id: 'bonus_cs5', type: 'coming_soon', title: 'Starman', meta: 'Opening nationwide soon.', text: 'Jeff Bridges stars in a science-fiction romance unlike any other.' },

  // Concession Stand — #66-70
  'concession_1': { id: 'bonus_co1', type: 'concession', title: 'Concession Stand Promotion', text: 'Large Popcorn .......... $2.00\nLarge Soda ............. $1.25\nMilk Duds .............. 75¢\nJunior Mints ........... 75¢\n\nEnjoy the show.' },
  'concession_2': { id: 'bonus_co2', type: 'concession', title: 'Family Night', text: 'Children under 12 receive a free small popcorn with the purchase of an adult ticket. Participating locations only.' },
  'concession_3': { id: 'bonus_co3', type: 'concession', title: 'New Arrival', text: 'Try our fresh nachos. Cheese available upon request. Management not responsible for cheese-related accidents.' },
  'concession_4': { id: 'bonus_co4', type: 'concession', title: 'Moviegoer Tip', text: 'Please remove excess butter before entering your vehicle. Thank you.' },
  'concession_5': { id: 'bonus_co5', type: 'concession', title: 'Customer Notice', text: 'The concession stand is currently out of Milk Duds. Several customers appear disappointed.' },

  // Drive-In Double Features — #71-75
  'drivein_1': { id: 'bonus_di1', type: 'drive_in', title: 'Sunset Drive-In', meta: 'Friday Night', text: 'Ghostbusters PLUS Gremlins. One admission price.' },
  'drivein_2': { id: 'bonus_di2', type: 'drive_in', title: 'Star-Lite Drive-In', meta: 'Saturday Night', text: 'Indiana Jones and the Temple of Doom PLUS Romancing the Stone. Gates open at 7 PM.' },
  'drivein_3': { id: 'bonus_di3', type: 'drive_in', title: 'Family Movie Night', meta: '', text: 'The Karate Kid PLUS Footloose. Bring lawn chairs.' },
  'drivein_4': { id: 'bonus_di4', type: 'drive_in', title: 'Science Fiction Weekend', meta: '', text: 'Star Trek III PLUS 2010. No Vulcans admitted without proper identification.' },
  'drivein_5': { id: 'bonus_di5', type: 'drive_in', title: 'Date Night Special', meta: '', text: 'Splash PLUS Romancing the Stone. Couples receive discounted admission.' },

  // Letters to the Editor — #76-80
  'letter_1': { id: 'bonus_le1', type: 'letter', source: 'Doris, Peoria', text: 'Dear Movie Times, My husband has now seen Ghostbusters four times. I believe he is attempting to become one.' },
  'letter_2': { id: 'bonus_le2', type: 'letter', source: 'Concerned Parent', text: 'Dear Movie Times, My son insists on practicing karate after seeing The Karate Kid. We have lost three lamps.' },
  'letter_3': { id: 'bonus_le3', type: 'letter', source: 'Mrs. Jenkins', text: 'Dear Movie Times, Please stop showing Gremlins. My children now distrust all household pets.' },
  'letter_4': { id: 'bonus_le4', type: 'letter', source: 'Anonymous', text: 'Dear Movie Times, After watching Beverly Hills Cop, my husband now believes every problem can be solved with wisecracks.' },
  'letter_5': { id: 'bonus_le5', type: 'letter', source: 'Residents of Springfield', text: 'Dear Movie Times, We attended Footloose. The dancing has not stopped.' },

  // Theater Incident Reports — #81-85
  'incident_1': { id: 'bonus_in1', type: 'incident', title: 'Management Notice', text: 'Tonight\'s showing of Ghostbusters was briefly interrupted when the film reel jumped. Audience applauded when projection resumed.' },
  'incident_2': { id: 'bonus_in2', type: 'incident', title: 'Management Notice', text: 'A patron attempted to bring an entire pizza into the theater. The situation has been resolved.' },
  'incident_3': { id: 'bonus_in3', type: 'incident', title: 'Management Notice', text: 'A child wearing a Ghostbusters costume attempted to inspect the projection booth.' },
  'incident_4': { id: 'bonus_in4', type: 'incident', title: 'Management Notice', text: 'Several audience members cheered when Indiana Jones appeared on screen. No complaints were received.' },
  'incident_5': { id: 'bonus_in5', type: 'incident', title: 'Management Notice', text: 'The projector overheated during the late showing. Refund vouchers are available.' },

  // Audience Surveys — #86-90
  'survey_1': { id: 'bonus_su1', type: 'survey', title: 'Ghostbusters', text: 'Would you recommend this movie?\nYES: 94%\nNO: 6%\n\nMost common response:\n"Who Ya Gonna Call?"' },
  'survey_2': { id: 'bonus_su2', type: 'survey', title: 'The Karate Kid', text: 'Favorite Character:\nMr. Miyagi ........ 72%\nDaniel ............ 23%\nJohnny ............ 5%' },
  'survey_3': { id: 'bonus_su3', type: 'survey', title: 'Footloose', text: 'Most Common Audience Response:\n"Dancing on the way to the parking lot."' },
  'survey_4': { id: 'bonus_su4', type: 'survey', title: 'Gremlins', text: 'Most Common Audience Response:\n"Those things should not be sold as pets."' },
  'survey_5': { id: 'bonus_su5', type: 'survey', title: 'Beverly Hills Cop', text: 'Most Common Audience Response:\n"Eddie Murphy is hilarious."' },

  // Movie Trivia Challenge — #91-95
  'trivia_ch_1': { id: 'bonus_tc1', type: 'trivia_challenge', question: 'What city does Axel Foley call home?', answer: 'Detroit.' },
  'trivia_ch_2': { id: 'bonus_tc2', type: 'trivia_challenge', question: 'What are the three rules for caring for a Mogwai?', answer: 'Don\'t get it wet. Keep it away from bright light. Never feed it after midnight.' },
  'trivia_ch_3': { id: 'bonus_tc3', type: 'trivia_challenge', question: 'What is the name of Roy Hobbs\' bat?', answer: 'Wonderboy.' },
  'trivia_ch_4': { id: 'bonus_tc4', type: 'trivia_challenge', question: 'What phrase does Mr. Miyagi repeatedly teach Daniel?', answer: 'Wax on. Wax off.' },
  'trivia_ch_5': { id: 'bonus_tc5', type: 'trivia_challenge', question: 'Who ya gonna call?', answer: 'You know the answer.' },

  // Hollywood Gossip — #96-100
  'gossip_1': { id: 'bonus_go1', type: 'gossip', text: 'Rumor has it several studios are already trying to create "the next Ghostbusters."' },
  'gossip_2': { id: 'bonus_go2', type: 'gossip', text: 'Industry insiders believe Eddie Murphy may become one of Hollywood\'s biggest stars.' },
  'gossip_3': { id: 'bonus_go3', type: 'gossip', text: 'Several major actors reportedly wanted the role of Indiana Jones before Harrison Ford.' },
  'gossip_4': { id: 'bonus_go4', type: 'gossip', text: 'Movie executives remain surprised by the success of The Karate Kid.' },
  'gossip_5': { id: 'bonus_go5', type: 'gossip', text: 'Kevin Bacon\'s popularity reportedly continues to rise among teenage audiences.' },

  // Movie Quotes — #101-105
  'quote_1': { id: 'bonus_mq1', type: 'quote', movie: 'Ghostbusters', text: '"We came. We saw. We kicked its ass."' },
  'quote_2': { id: 'bonus_mq2', type: 'quote', movie: 'The Karate Kid', text: '"Wax on. Wax off."' },
  'quote_3': { id: 'bonus_mq3', type: 'quote', movie: 'Beverly Hills Cop', text: '"Trust me."' },
  'quote_4': { id: 'bonus_mq4', type: 'quote', movie: 'Star Trek III', text: '"The needs of the many outweigh the needs of the few."' },
  'quote_5': { id: 'bonus_mq5', type: 'quote', movie: 'The Natural', text: '"Pick me out a winner, Bobby."' },
};

// ── Ad text to movie entry mapping ──
export function findMovieIndex(adText) {
  if (!adText) return null;
  const lower = adText.toLowerCase();

  // Ghostbusters
  if (lower.includes('ghostbusters')) {
    if (lower.includes('who ya gonna call')) return 26;
    if (lower.includes('continues to delight')) return 27;
    if (lower.includes('this weekend at your local')) return 28;
    return null;
  }
  // Beverly Hills Cop
  if (lower.includes('beverly hills cop')) {
    if (lower.includes('eddie murphy is now playing')) return 29;
    if (lower.includes('one of the year')) return 30;
    if (lower.includes('axel foley')) return 31;
    return null;
  }
  // Karate Kid
  if (lower.includes('karate kid')) {
    if (lower.includes('continues to draw crowds')) return 32;
    if (lower.includes('daniel-san')) return 33;
    if (lower.includes('neighborhood theater')) return 34;
    return null;
  }
  // Gremlins
  if (lower.includes('gremlins')) {
    if (lower.includes('no bright light')) return 35;
    if (lower.includes('continues to surprise')) return 36;
    if (lower.includes('see indiana jones')) return 38; // misdetection guard
    return null;
  }
  // Indiana Jones / Temple of Doom
  if (lower.includes('indiana jones') || lower.includes('temple of doom')) {
    if (lower.includes('see indiana jones and the temple')) return 38;
    if (lower.includes('returns for another adventure')) return 39;
    if (lower.includes('continues to thrill')) return 40;
    return null;
  }
  // Splash
  if (lower.includes('splash')) {
    if (lower.includes('tom hanks is now playing')) return 41;
    if (lower.includes('enjoy a night at the movies with splash')) return 42;
    return null;
  }
  // Romancing the Stone
  if (lower.includes('romancing the stone')) {
    if (lower.includes('continues its successful')) return 43;
    if (lower.includes('adventure, romance, and comedy')) return 44;
    // No third variant in the ad pool directly
    return null;
  }
  // The Natural
  if (lower.includes('the natural')) {
    if (lower.includes('robert redford is now playing')) return 46;
    if (lower.includes('mysterious baseball hero')) return 47;
    if (lower.includes('this week at your local')) return 48;
    return null;
  }
  // Footloose
  if (lower.includes('footloose')) {
    if (lower.includes('continues to get audiences')) return 49;
    if (lower.includes('music and excitement')) return 50;
    return null;
  }
  // Star Trek III
  if (lower.includes('star trek iii') || lower.includes('search for spock')) {
    if (lower.includes('now playing')) return 53;
    if (lower.includes('crew of the enterprise')) return 54;
    return null;
  }

  return null;
}

// ── Pick a random bonus entry ──
const BONUS_KEYS = Object.keys(BONUS_ENTRIES);

export function pickBonusEntry() {
  const key = BONUS_KEYS[Math.floor(Math.random() * BONUS_KEYS.length)];
  return BONUS_ENTRIES[key];
}

// ── Pick a random bonus entry by type ──
export function pickBonusByType(type) {
  const matches = Object.values(BONUS_ENTRIES).filter(e => e.type === type);
  if (matches.length === 0) return null;
  return matches[Math.floor(Math.random() * matches.length)];
}

// ── Get a specific movie entry ──
export function getMovieEntry(bannerIndex) {
  return MOVIE_ENTRIES[bannerIndex] || null;
}

// ── Get all bonus entries ──
export function getAllBonusEntries() {
  return Object.values(BONUS_ENTRIES);
}

// ── Achievement Tracking ──

const STORAGE_KEY = 'movie_popup_views_v1';

function getViewed() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveViewed(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function trackMovieView(entryId) {
  const viewed = getViewed();
  if (!viewed.includes(entryId)) {
    viewed.push(entryId);
    saveViewed(viewed);
    return checkMovieAchievements(viewed);
  }
  return [];
}

function checkMovieAchievements(viewed) {
  const unlocked = [];

  // Movie-specific achievements
  const movieEntries = viewed.filter(id => id.startsWith('movie_'));
  const bonusEntries = viewed.filter(id => id.startsWith('bonus_'));

  // Splash: Mermaid Lover (3 entries)
  const splashEntries = ['movie_41', 'movie_42'];
  if (splashEntries.every(id => viewed.includes(id)) && !viewed.includes('ach_mermaid_lover')) {
    unlocked.push({ id: 'ach_mermaid_lover', name: 'Mermaid Lover', desc: 'Open all Splash entries.', icon: '🧜‍♀️' });
  }

  // Romancing the Stone: Adventure Novelist (3 entries)
  const rtsEntries = ['movie_43', 'movie_44', 'movie_45'];
  if (rtsEntries.every(id => viewed.includes(id)) && !viewed.includes('ach_adventure_novelist')) {
    unlocked.push({ id: 'ach_adventure_novelist', name: 'Adventure Novelist', desc: 'Open all Romancing the Stone entries.', icon: '💎' });
  }

  // The Natural: Wonderboy (3 entries)
  const naturalEntries = ['movie_46', 'movie_47', 'movie_48'];
  if (naturalEntries.every(id => viewed.includes(id)) && !viewed.includes('ach_wonderboy')) {
    unlocked.push({ id: 'ach_wonderboy', name: 'Wonderboy', desc: 'Open all The Natural entries.', icon: '⚾' });
  }

  // Footloose: Dancing Machine (4 entries)
  const footlooseEntries = ['movie_49', 'movie_50', 'movie_51', 'movie_52'];
  if (footlooseEntries.every(id => viewed.includes(id)) && !viewed.includes('ach_dancing_machine')) {
    unlocked.push({ id: 'ach_dancing_machine', name: 'Dancing Machine', desc: 'Open all Footloose entries.', icon: '💃' });
  }

  // Star Trek III: Starfleet Officer (4 entries)
  const trekEntries = ['movie_53', 'movie_54', 'movie_55', 'movie_56'];
  if (trekEntries.every(id => viewed.includes(id)) && !viewed.includes('ach_starfleet_officer')) {
    unlocked.push({ id: 'ach_starfleet_officer', name: 'Starfleet Officer', desc: 'Open all Star Trek III entries.', icon: '🖖' });
  }

  // Baseball at the Movies
  if (naturalEntries.every(id => viewed.includes(id)) && !viewed.includes('ach_baseball_at_movies')) {
    unlocked.push({ id: 'ach_baseball_at_movies', name: 'Baseball At The Movies', desc: 'Read every baseball-related movie entry.', icon: '🎬' });
  }

  // Count-based movie achievements
  if (movieEntries.length >= 25 && !viewed.includes('ach_summer_blockbuster_ii')) {
    unlocked.push({ id: 'ach_summer_blockbuster_ii', name: 'Summer Blockbuster II', desc: 'Read 25 movie popups.', icon: '🍿' });
  }
  if (movieEntries.length >= 50 && !viewed.includes('ach_vhs_rental')) {
    unlocked.push({ id: 'ach_vhs_rental', name: 'VHS Rental', desc: 'Read 50 movie popups.', icon: '📼' });
  }
  if (movieEntries.length >= 75 && !viewed.includes('ach_saturday_matinee')) {
    unlocked.push({ id: 'ach_saturday_matinee', name: 'Saturday Matinee', desc: 'Read 75 movie popups.', icon: '🎟️' });
  }

  // Bonus content achievements
  const reviews = viewed.filter(id => id.startsWith('movie_') && MOVIE_ENTRIES[parseInt(id.split('_')[1])]?.review);
  // Count review views
  if (viewed.length >= 10 && !viewed.includes('ach_movie_critic')) {
    unlocked.push({ id: 'ach_movie_critic', name: 'Movie Critic', desc: 'Read 10 movie reviews.', icon: '⭐' });
  }

  // Box Office Reporter
  const boEntries = bonusEntries.filter(id => id.startsWith('bonus_bo'));
  if (boEntries.length >= 3 && !viewed.includes('ach_box_office_reporter')) {
    unlocked.push({ id: 'ach_box_office_reporter', name: 'Box Office Reporter', desc: 'Open 3 box-office reports.', icon: '📊' });
  }

  // Coming Attractions
  const csEntries = bonusEntries.filter(id => id.startsWith('bonus_cs'));
  if (csEntries.length >= 3 && !viewed.includes('ach_coming_attractions')) {
    unlocked.push({ id: 'ach_coming_attractions', name: 'Coming Attractions', desc: 'Open 3 coming-soon ads.', icon: '🎥' });
  }
  if (csEntries.length >= 1 && !viewed.includes('ach_future_viewer')) {
    unlocked.push({ id: 'ach_future_viewer', name: 'Future Viewer', desc: 'Read a movie that hasn\'t opened yet.', icon: '🔮' });
  }

  // Popcorn Addict
  const coEntries = bonusEntries.filter(id => id.startsWith('bonus_co'));
  if (coEntries.length >= 3 && !viewed.includes('ach_popcorn_addict')) {
    unlocked.push({ id: 'ach_popcorn_addict', name: 'Popcorn Addict', desc: 'Open 3 concession ads.', icon: '🍿' });
  }

  // Drive-In Kid
  const diEntries = bonusEntries.filter(id => id.startsWith('bonus_di'));
  if (diEntries.length >= 3 && !viewed.includes('ach_drivein_kid')) {
    unlocked.push({ id: 'ach_drivein_kid', name: 'Drive-In Kid', desc: 'View 3 drive-in promotions.', icon: '🚗' });
  }

  // Letter Writer
  const leEntries = bonusEntries.filter(id => id.startsWith('bonus_le'));
  if (leEntries.length >= 3 && !viewed.includes('ach_letter_writer')) {
    unlocked.push({ id: 'ach_letter_writer', name: 'Letter Writer', desc: 'Read 3 audience letters.', icon: '✉️' });
  }

  // Projectionist
  const inEntries = bonusEntries.filter(id => id.startsWith('bonus_in'));
  if (inEntries.length >= 1 && !viewed.includes('ach_front_row_seat')) {
    unlocked.push({ id: 'ach_front_row_seat', name: 'Front Row Seat', desc: 'Find a theater incident.', icon: '🎞️' });
  }
  if (inEntries.length >= 3 && !viewed.includes('ach_projectionist')) {
    unlocked.push({ id: 'ach_projectionist', name: 'Projectionist', desc: 'View 3 theater incident reports.', icon: '📽️' });
  }

  // Cinema Scholar
  const tcEntries = bonusEntries.filter(id => id.startsWith('bonus_tc'));
  if (tcEntries.length >= 3 && !viewed.includes('ach_cinema_scholar')) {
    unlocked.push({ id: 'ach_cinema_scholar', name: 'Cinema Scholar', desc: 'Answer 3 trivia cards.', icon: '🎓' });
  }

  // Quote Machine
  const mqEntries = bonusEntries.filter(id => id.startsWith('bonus_mq'));
  if (mqEntries.length >= 3 && !viewed.includes('ach_quote_machine')) {
    unlocked.push({ id: 'ach_quote_machine', name: 'Quote Machine', desc: 'Read 3 movie quotes.', icon: '💬' });
  }

  // Grand total achievements
  const total = viewed.length;
  if (total >= 50 && !viewed.includes('ach_opening_weekend')) {
    unlocked.push({ id: 'ach_opening_weekend', name: 'Opening Weekend', desc: 'View 50 movie clickables.', icon: '🎬' });
  }
  if (total >= 75 && !viewed.includes('ach_matinee_idol')) {
    unlocked.push({ id: 'ach_matinee_idol', name: 'Matinee Idol', desc: 'View all 75 movie clickables.', icon: '🌟' });
  }

  return unlocked;
}

// ── Export all movie achievements for the global achievement list ──
export const MOVIE_ACHIEVEMENTS = [
  { id: 'ach_mermaid_lover', name: 'Mermaid Lover', desc: 'Open all Splash entries.', icon: '🧜‍♀️', category: 'movies' },
  { id: 'ach_adventure_novelist', name: 'Adventure Novelist', desc: 'Open all Romancing the Stone entries.', icon: '💎', category: 'movies' },
  { id: 'ach_wonderboy', name: 'Wonderboy', desc: 'Open all The Natural entries.', icon: '⚾', category: 'movies' },
  { id: 'ach_dancing_machine', name: 'Dancing Machine', desc: 'Open all Footloose entries.', icon: '💃', category: 'movies' },
  { id: 'ach_starfleet_officer', name: 'Starfleet Officer', desc: 'Open all Star Trek III entries.', icon: '🖖', category: 'movies' },
  { id: 'ach_baseball_at_movies', name: 'Baseball At The Movies', desc: 'Read every baseball-related movie entry.', icon: '🎬', category: 'movies' },
  { id: 'ach_summer_blockbuster_ii', name: 'Summer Blockbuster II', desc: 'Read 25 movie popups.', icon: '🍿', category: 'movies' },
  { id: 'ach_vhs_rental', name: 'VHS Rental', desc: 'Read 50 movie popups.', icon: '📼', category: 'movies' },
  { id: 'ach_saturday_matinee', name: 'Saturday Matinee', desc: 'Read 75 movie popups.', icon: '🎟️', category: 'movies' },
  { id: 'ach_movie_critic', name: 'Movie Critic', desc: 'Read 10 movie reviews.', icon: '⭐', category: 'movies' },
  { id: 'ach_box_office_reporter', name: 'Box Office Reporter', desc: 'Open 3 box-office reports.', icon: '📊', category: 'movies' },
  { id: 'ach_coming_attractions', name: 'Coming Attractions', desc: 'Open 3 coming-soon ads.', icon: '🎥', category: 'movies' },
  { id: 'ach_future_viewer', name: 'Future Viewer', desc: 'Read a movie that hasn\'t opened yet.', icon: '🔮', category: 'movies' },
  { id: 'ach_popcorn_addict', name: 'Popcorn Addict', desc: 'Open 3 concession ads.', icon: '🍿', category: 'movies' },
  { id: 'ach_drivein_kid', name: 'Drive-In Kid', desc: 'View 3 drive-in promotions.', icon: '🚗', category: 'movies' },
  { id: 'ach_letter_writer', name: 'Letter Writer', desc: 'Read 3 audience letters.', icon: '✉️', category: 'movies' },
  { id: 'ach_projectionist', name: 'Projectionist', desc: 'View 3 theater incident reports.', icon: '📽️', category: 'movies' },
  { id: 'ach_front_row_seat', name: 'Front Row Seat', desc: 'Find a theater incident.', icon: '🎞️', category: 'movies' },
  { id: 'ach_cinema_scholar', name: 'Cinema Scholar', desc: 'Answer 3 trivia cards.', icon: '🎓', category: 'movies' },
  { id: 'ach_quote_machine', name: 'Quote Machine', desc: 'Read 3 movie quotes.', icon: '💬', category: 'movies' },
  { id: 'ach_opening_weekend', name: 'Opening Weekend', desc: 'View 50 movie clickables.', icon: '🎬', category: 'movies' },
  { id: 'ach_matinee_idol', name: 'Matinee Idol', desc: 'View all 75 movie clickables.', icon: '🌟', category: 'movies' },
];