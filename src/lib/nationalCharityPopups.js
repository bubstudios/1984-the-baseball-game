// 25 National Charity and Nonprofit Popups - 1984 PSA and Broadcast Sponsors
// Historical nonprofits featured in baseball broadcasts, with accurate mission/history

const NATIONAL_CHARITY_POPUPS = [
  {
    id: 'united_way_1',
    keyword: 'United Way',
    organization: 'United Way of America',
    icon: '🤝',
    logo: 'UW',
    category: 'Community Services',
    color: '#E81B23',
    title: 'United Way - Fighting Poverty Together',
    body: `United Way of America reaches into every corner of our nation, pooling local talent and resources to address the root causes of poverty and hardship.

In 1984, United Way campaigns raised over $2 billion nationwide to support thousands of local agencies providing food, shelter, job training, and youth programs.

"It takes a United Way" - the iconic slogan - reminds Americans that collective action solves community problems.

Baseball broadcasts featured United Way PSAs, connecting sports to lifting vulnerable populations across America.`,
    history: 'Founded in 1886 as response to urban poverty. By 1984, United Way was the largest privately-funded social services organization in North America.',
    achievement: 'united_way_viewer',
  },
  {
    id: 'united_way_2',
    keyword: 'United Way',
    organization: 'United Way - Campaign Season',
    icon: '📢',
    logo: 'UW',
    category: 'Community Services',
    color: '#E81B23',
    title: 'United Way Annual Campaign',
    body: `Every fall, United Way kicks off its annual workplace campaign, asking companies to pledge support for local United Way chapters.

In 1984, the campaign emphasized one gift reaches hundreds of agencies - far more efficient than giving separately.

"One gift. One call. One time." emphasized simplicity and power in numbers.

MLB teams partnered with United Way during the regular season and World Series.`,
    history: 'United Way campaigns raised billions since 1970s, becoming integral to American corporate culture and civic life.',
    achievement: 'united_way_viewer',
  },
  {
    id: 'red_cross_1',
    keyword: 'Red Cross',
    organization: 'American Red Cross',
    icon: '🩹',
    logo: 'RC',
    category: 'Disaster Relief',
    color: '#C41E3A',
    title: 'American Red Cross - Disaster Relief',
    body: `The American Red Cross, chartered by Congress, responds to humanitarian needs: natural disasters, house fires, blood shortages, and international conflicts.

In 1984, the Red Cross recovered from 1983 El Niño storms and prepared for hurricane season, mobilizing thousands nationwide.

Baseball broadcasts featured Red Cross PSAs reminding viewers to give blood - lifesaving resources.

"The Power of Red" symbolized America's commitment to helping neighbors in crisis.`,
    history: 'Founded in 1881 by Clara Barton. By 1984, Red Cross operated in all 50 states, world largest humanitarian organization.',
    achievement: 'red_cross_viewer',
  },
  {
    id: 'red_cross_2',
    keyword: 'Red Cross',
    organization: 'Red Cross Blood Drive',
    icon: '🩸',
    logo: 'RC',
    category: 'Disaster Relief',
    color: '#C41E3A',
    title: 'Red Cross Blood Donor Program',
    body: `The Red Cross Blood Donor Program collected lifesaving blood from millions of volunteers, ensuring hospitals could treat accident victims and surgery patients.

In 1984, blood shortages were common in summer. Red Cross launched summer blood drives to build reserves.

Baseball games often hosted Red Cross blood drives in parking lots, turning ballpark visits into civic participation.

"Give the Gift of Life" transformed voluntary donation into patriotic duty.`,
    history: 'Red Cross blood service began in 1941, collected over 1 million units annually by 1984, serving every hospital in America.',
    achievement: 'red_cross_viewer',
  },
  {
    id: 'march_dimes_1',
    keyword: 'March of Dimes',
    organization: 'March of Dimes',
    icon: '👶',
    logo: 'MOD',
    category: 'Child Health',
    color: '#00A3E0',
    title: 'March of Dimes - Fighting Birth Defects',
    body: `March of Dimes pivoted after polio eradication to prevent birth defects and infant mortality.

In 1984, March of Dimes funded research into prenatal care, neonatal intensive care, and genetic counseling.

Baseball broadcasts featured segments about healthy pregnancies and prenatal care importance.

"Mothers for Healthy Babies" emphasized every mother deserves quality prenatal care.`,
    history: 'Founded in 1938 fighting polio. By 1984, March of Dimes funded neonatal research and changed focus to birth defects.',
    achievement: 'march_dimes_viewer',
  },
  {
    id: 'march_dimes_2',
    keyword: 'March of Dimes',
    organization: 'March of Dimes Research Fund',
    icon: '🧬',
    logo: 'MOD',
    category: 'Child Health',
    color: '#00A3E0',
    title: 'March of Dimes Research Breakthroughs',
    body: `March of Dimes funded research into birth defects, premature birth, and infant mortality.

In 1984, funded scientists investigated genetic factors, maternal nutrition, and prenatal diagnostics.

The "Mothers March" fundraising campaign still engaged millions supporting critical research.

"Every Mother Counts" emphasized mothers deserve best medical care during pregnancy.`,
    history: 'March of Dimes research grants supported major advances in pediatric medicine throughout 20th century.',
    achievement: 'march_dimes_viewer',
  },
  {
    id: 'heart_assoc_1',
    keyword: 'American Heart Association',
    organization: 'American Heart Association',
    icon: '❤️',
    logo: 'AHA',
    category: 'Heart Disease Prevention',
    color: '#E71930',
    title: 'American Heart Association - Prevention',
    body: `The American Heart Association fought cardiovascular disease through research, education, and community programs.

In 1984, AHA launched campaigns on exercise, diet, and stress management.

Baseball broadcasters featured AHA PSAs encouraging regular exercise and managing risk factors.

"Fight Heart Disease and Stroke" resonated with aging sports fans concerned about health.`,
    history: 'Founded in 1924, American Heart Association became largest voluntary health organization preventing heart disease by 1984.',
    achievement: 'heart_assoc_viewer',
  },
  {
    id: 'heart_assoc_2',
    keyword: 'American Heart Association',
    organization: 'Heart Research Program',
    icon: '💙',
    logo: 'AHA',
    category: 'Heart Disease Prevention',
    color: '#E71930',
    title: 'AHA Heart Research - CPR Training',
    body: `American Heart Association funded heart research and trained millions in CPR techniques.

In 1984, AHA instructors taught schools and workplaces chest compression and rescue breathing.

Baseball stadiums hosted CPR training, and PSAs emphasized anyone can save lives.

"Learn CPR - Be a Lifesaver" transformed emergency medicine into achievable skill.`,
    history: 'AHA CPR training programs introduced 1970s, trained millions by 1984, became standard emergency response.',
    achievement: 'heart_assoc_viewer',
  },
  {
    id: 'cancer_society_1',
    keyword: 'American Cancer Society',
    organization: 'American Cancer Society',
    icon: '🎗️',
    logo: 'ACS',
    category: 'Cancer Prevention',
    color: '#008000',
    title: 'American Cancer Society - Early Detection',
    body: `American Cancer Society promoted cancer early detection through education and research funding.

In 1984, ACS campaigns emphasized regular screening importance for breast, cervical, and colon cancer.

Baseball broadcasters featured ACS PSAs: "Most important step fighting cancer is catching it early."

Relay for Life events had roots in 1980s ACS fundraising celebrating survivor stories.`,
    history: 'Founded in 1913, American Cancer Society became largest voluntary organization dedicated to cancer research.',
    achievement: 'cancer_society_viewer',
  },
  {
    id: 'cancer_society_2',
    keyword: 'American Cancer Society',
    organization: 'Cancer Research Fund',
    icon: '🔬',
    logo: 'ACS',
    category: 'Cancer Prevention',
    color: '#008000',
    title: 'American Cancer Society Research Initiatives',
    body: `American Cancer Society research funding drove advances in chemotherapy, radiation, and immunology.

In 1984, ACS-funded researchers investigated new cancer drugs and lifestyle factors in cancer development.

Baseball broadcasters highlighted research achievements emphasizing progress saves millions.

"Hope. Progress. Answers." captured commitment to funding life-saving science.`,
    history: 'American Cancer Society research grants supported major breakthroughs in cancer treatment throughout late 20th century.',
    achievement: 'cancer_society_viewer',
  },
  {
    id: 'easter_seals_1',
    keyword: 'Easter Seals',
    organization: 'Easter Seals',
    icon: '🦽',
    logo: 'ES',
    category: 'Disability Services',
    color: '#C41E3A',
    title: 'Easter Seals - Services for Disabilities',
    body: `Easter Seals provided rehabilitation, job training, and assistive technology for people with disabilities.

In 1984, Easter Seals operated centers nationwide serving cerebral palsy, spinal cord, and autism populations.

Baseball broadcasters featured PSAs: "People with disabilities want opportunity, not sympathy."

Campaign shifted toward independence and capability messages.`,
    history: 'Founded in 1919, Easter Seals became largest disability services organization in North America.',
    achievement: 'easter_seals_viewer',
  },
  {
    id: 'easter_seals_2',
    keyword: 'Easter Seals',
    organization: 'Easter Seals Job Training',
    icon: '🛠️',
    logo: 'ES',
    category: 'Disability Services',
    color: '#C41E3A',
    title: 'Easter Seals Employment Programs',
    body: `Easter Seals job training prepared disabled people for competitive employment with accessible workplaces.

In 1984, Easter Seals led disability employment advocacy before ADA workplace mandates.

Baseball broadcasters featured success stories: "With training, people with disabilities become productive members of society."

"We Can Work" promoted radical idea that disability should not exclude employment.`,
    history: 'Easter Seals employment programs placed thousands of disabled workers in jobs, proving disability need not mean unemployment.',
    achievement: 'easter_seals_viewer',
  },
  {
    id: 'naacp_1',
    keyword: 'NAACP',
    organization: 'NAACP',
    icon: '✊',
    logo: 'NAACP',
    category: 'Civil Rights',
    color: '#000000',
    title: 'NAACP - Civil Rights Advancement',
    body: `NAACP, America oldest civil rights group, fought discrimination in employment, housing, education, and justice.

In 1984, NAACP challenged racial inequality in school desegregation, voting, and police brutality.

Baseball broadcasters featured NAACP PSAs celebrating Civil Rights progress and ongoing fights.

"Equal Rights for All" resonated with fans believing in fairness and justice.`,
    history: 'Founded in 1909, NAACP became central legal force behind Civil Rights Movement, remained influential into 1980s.',
    achievement: 'naacp_viewer',
  },
  {
    id: 'naacp_2',
    keyword: 'NAACP',
    organization: 'NAACP Legal Defense Fund',
    icon: '⚖️',
    logo: 'NAACP',
    category: 'Civil Rights',
    color: '#000000',
    title: 'NAACP Legal Defense - Courtroom Justice',
    body: `NAACP Legal Defense Fund argued civil rights cases in federal courts nationwide.

In 1984, NAACP lawyers litigated school desegregation, employment discrimination, and capital punishment cases.

Baseball broadcasters highlighted legal victories emphasizing court justice means freedom for all.

NAACP legal tradition reached new heights in 1980s with new generations of civil rights lawyers.`,
    history: 'NAACP Legal Defense Fund, founded 1940, argued Brown v. Board of Education, became premier civil rights law organization.',
    achievement: 'naacp_viewer',
  },
  {
    id: 'salvation_army_1',
    keyword: 'Salvation Army',
    organization: 'Salvation Army',
    icon: '🪖',
    logo: 'SA',
    category: 'Emergency Relief',
    color: '#CC0000',
    title: 'Salvation Army - Emergency Assistance',
    body: `Salvation Army, founded in England 1865, provided emergency food, shelter, and disaster relief.

In 1984, Salvation Army shelters served homeless, runaway youth, and displaced families with military discipline.

Baseball broadcasters featured PSAs during holidays emphasizing year-round vulnerable population service.

"Heart to God, Hand to Man" captured spiritual motivation for practical service.`,
    history: 'Salvation Army arrived in America 1880, became largest faith-based social service provider by 1984.',
    achievement: 'salvation_army_viewer',
  },
  {
    id: 'salvation_army_2',
    keyword: 'Salvation Army',
    organization: 'Salvation Army Disaster Relief',
    icon: '🚑',
    logo: 'SA',
    category: 'Emergency Relief',
    color: '#CC0000',
    title: 'Salvation Army Disaster Response',
    body: `Salvation Army mobilized mobile feeding units and shelters during natural disasters nationwide.

In 1984, disaster relief teams responded to hurricanes and floods, partnering with Red Cross.

Baseball broadcasters highlighted relief: "In dark hours, Salvation Army helps rebuild lives and communities."

Rapid response and on-ground presence made trusted disaster relief partner.`,
    history: 'Salvation Army disaster relief operations, developed early 1900s, became model for emergency response and recovery.',
    achievement: 'salvation_army_viewer',
  },
  {
    id: 'boys_girls_club_1',
    keyword: 'Boys and Girls Clubs',
    organization: 'Boys and Girls Clubs of America',
    icon: '⚽',
    logo: 'BGC',
    category: 'Youth Development',
    color: '#003399',
    title: 'Boys and Girls Clubs - Youth Programs',
    body: `Boys and Girls Clubs provided after-school and summer programs in low-income neighborhoods.

In 1984, clubs operated nationwide serving youth 6-18 with sports, arts, and mentorship.

Baseball broadcasters featured PSAs: "A club near you gives kids chance to dream and achieve."

MLB teams hosted club youth at games, promoting memberships.`,
    history: 'Boys and Girls Clubs began late 1800s Boston, became nationwide movement by 20th century.',
    achievement: 'boys_girls_club_viewer',
  },
  {
    id: 'boys_girls_club_2',
    keyword: 'Boys and Girls Clubs',
    organization: 'BGC Summer Programs',
    icon: '🎯',
    logo: 'BGC',
    category: 'Youth Development',
    color: '#003399',
    title: 'Boys and Girls Clubs Summer Camp',
    body: `Summer programs kept youth engaged, active, safe during school breaks with recreation and academics.

In 1984, summer slide concerns grew as low-income kids fell behind academically.

Baseball broadcasters celebrated member scholarships and regional sports wins.

MLB teams partnered for baseball clinics, creating pathways for talented youth.`,
    history: 'Boys and Girls Clubs summer programs expanded dramatically 1970s-1980s addressing youth unemployment and academic gaps.',
    achievement: 'boys_girls_club_viewer',
  },
  {
    id: 'ywca_1',
    keyword: 'YWCA',
    organization: 'YWCA',
    icon: '👩',
    logo: 'YWCA',
    category: 'Women Empowerment',
    color: '#FF6600',
    title: 'YWCA - Women Empowerment',
    body: `YWCA, founded 1858, provided women programs for health, wellbeing, career training, and social action.

In 1984, YWCA ran fitness centers, job training, childcare, and domestic violence shelters.

Baseball broadcasters featured PSAs celebrating women in sports, careers, and leadership.

"Empowering women and girls" reflected feminist roots and commitment to equality.`,
    history: 'YWCA expanded dramatically 20th century, became largest women-focused nonprofit in America.',
    achievement: 'ywca_viewer',
  },
  {
    id: 'ywca_2',
    keyword: 'YWCA',
    organization: 'YWCA Training Programs',
    icon: '💪',
    logo: 'YWCA',
    category: 'Women Empowerment',
    color: '#FF6600',
    title: 'YWCA Job Training and Fitness',
    body: `YWCA job training prepared women for employment in healthcare, technology, and business.

In 1984, fitness centers promoted women physical health. Aerobics revolution filled YWCA classes.

Baseball broadcasters featured testimonies: "With skills and confidence, women achieve independence and leadership."

"Strong Body, Mind, Spirit" connected fitness to economic empowerment.`,
    history: 'YWCA fitness and training programs expanded 1970s-1980s as women entered workforce in record numbers.',
    achievement: 'ywca_viewer',
  },
  {
    id: 'world_vision_1',
    keyword: 'World Vision',
    organization: 'World Vision',
    icon: '🌍',
    logo: 'WV',
    category: 'International Relief',
    color: '#CC0000',
    title: 'World Vision - Global Hunger Relief',
    body: `World Vision, Christian humanitarian organization, fought poverty and famine worldwide.

In 1984, World Vision responded to famines in Ethiopia and Sudan.

Baseball broadcasters featured PSAs: "For pennies daily, sponsor a child with food, education, hope."

Child sponsorship created direct connections between American donors and needy children.`,
    history: 'World Vision, founded 1950, became largest Christian relief organization by 1984, active over 100 countries.',
    achievement: 'world_vision_viewer',
  },
  {
    id: 'world_vision_2',
    keyword: 'World Vision',
    organization: 'World Vision Sponsorship',
    icon: '🤲',
    logo: 'WV',
    category: 'International Relief',
    color: '#CC0000',
    title: 'World Vision Child Sponsorship',
    body: `Child sponsorship created direct donor connections funding impoverished children education and healthcare.

In 1984, over million children sponsored. Sponsors received letters and photos creating emotional bonds.

Baseball broadcasters shared stories: "You can change a child life. World Vision connects you directly."

Individual giving multiplied across millions transformed communities worldwide.`,
    history: 'Child sponsorship programs pioneered by World Vision 1970s revolutionized international aid through personal relationships.',
    achievement: 'world_vision_viewer',
  },
  {
    id: 'leukemia_lymphoma_1',
    keyword: 'Leukemia',
    organization: 'Leukemia and Lymphoma Society',
    icon: '🧬',
    logo: 'TLS',
    category: 'Cancer Research',
    color: '#FF3333',
    title: 'Leukemia and Lymphoma Society - Blood Cancer Research',
    body: `Society funded research and patient support for blood cancers.

In 1984, blood cancers seemed incurable. Society mission accelerated research for cures.

Baseball broadcasters featured survivor testimonies: "Research saves lives, turning death sentence into manageable disease."

"Fighting Cancer. Saving Lives." captured research and patient support missions.`,
    history: 'Leukemia and Lymphoma Society, founded 1949, became worlds largest organization for blood cancer research.',
    achievement: 'leukemia_lymphoma_viewer',
  },
  {
    id: 'leukemia_lymphoma_2',
    keyword: 'Leukemia',
    organization: 'Leukemia Research Grants',
    icon: '💊',
    logo: 'TLS',
    category: 'Cancer Research',
    color: '#FF3333',
    title: 'Leukemia Research Breakthroughs',
    body: `Society funded research in chemotherapy, bone marrow transplantation, and immunology.

In 1984, researchers approached childhood leukemia breakthroughs with improving survival rates.

Baseball broadcasters highlighted achievements: "Research supported by society gives children hope and survival chances."

"Progress Through Research" emphasized individual giving funded life-saving science.`,
    history: 'Leukemia and Lymphoma Society research funding accelerated cancer treatment advances and survival improvements.',
    achievement: 'leukemia_lymphoma_viewer',
  },
];

export function findNationalCharityEntry(adText) {
  if (!adText) return null;
  const entry = NATIONAL_CHARITY_POPUPS.find(p => adText.includes(p.keyword) || p.keyword.includes(adText));
  return entry || null;
}

export function trackNationalCharityView(entryId) {
  const viewed = JSON.parse(localStorage.getItem('nationalCharityViewed') || '[]');
  if (!viewed.includes(entryId)) {
    viewed.push(entryId);
    localStorage.setItem('nationalCharityViewed', JSON.stringify(viewed));
  }

  const unlocked = [];
  try {
    const stored = JSON.parse(localStorage.getItem('bb84_achievements') || '{}');
    if (viewed.length >= 5 && !stored['charity_advocate']) {
      unlocked.push('charity_advocate');
      stored['charity_advocate'] = true;
    }
    if (viewed.length >= 10 && !stored['compassion_champion']) {
      unlocked.push('compassion_champion');
      stored['compassion_champion'] = true;
    }
    if (viewed.length >= 25 && !stored['change_maker']) {
      unlocked.push('change_maker');
      stored['change_maker'] = true;
    }
    if (unlocked.length > 0) {
      localStorage.setItem('bb84_achievements', JSON.stringify(stored));
    }
  } catch (e) { /* ignore */ }

  return unlocked;
}

export default NATIONAL_CHARITY_POPUPS;