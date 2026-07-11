// ═══════════════════════════════════════════════════════════════
// SEASON MODE ACHIEVEMENT CATALOG
// All achievements with structured trigger functions.
// Triggers evaluate against a context object — never parse text.
// ═══════════════════════════════════════════════════════════════

// ── Helper Functions ──

function userBatter(ctx, nameSub) {
  return (ctx.userBatting || []).find(b => (b.name || '').toLowerCase().includes(nameSub.toLowerCase()));
}
function userPitcher(ctx, nameSub) {
  return (ctx.userPitching || []).find(p => (p.name || '').toLowerCase().includes(nameSub.toLowerCase()));
}
function maxBat(ctx, field) {
  return Math.max(0, ...(ctx.userBatting || []).map(b => b[field] || 0));
}
function sumBat(ctx, field) {
  return (ctx.userBatting || []).reduce((s, b) => s + (b[field] || 0), 0);
}
function sumPitch(ctx, field) {
  return (ctx.userPitching || []).reduce((s, p) => s + (p[field] || 0), 0);
}
function getUserStanding(standings, userTeam) {
  if (!standings) return null;
  for (const div of Object.values(standings)) {
    const team = div.find(t => t.teamKey === userTeam);
    if (team) return { ...team, division: div, place: div.indexOf(team) + 1 };
  }
  return null;
}
function isDivisionWinner(standings, userTeam) {
  const st = getUserStanding(standings, userTeam);
  return st && st.place === 1;
}

// ── Category Definitions ──

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'progress', label: 'Season Progress', icon: 'Calendar' },
  { id: 'team', label: 'Team Record', icon: 'Trophy' },
  { id: 'hitting', label: 'Hitting', icon: 'Zap' },
  { id: 'pitching', label: 'Pitching', icon: 'Target' },
  { id: 'defense', label: 'Field & Defense', icon: 'Shield' },
  { id: 'drama', label: 'Game Drama', icon: 'Flame' },
  { id: 'discipline', label: 'Injuries & Discipline', icon: 'AlertTriangle' },
  { id: 'allstar', label: 'All-Star Game', icon: 'Star' },
  { id: 'trade', label: 'Trade Deadline', icon: 'Repeat' },
  { id: 'awards', label: 'Awards', icon: 'Award' },
  { id: 'postseason', label: 'Postseason', icon: 'Crown' },
  { id: 'mets', label: 'Mets-Specific', icon: 'Anchor' },
  { id: 'hidden', label: 'Hidden', icon: 'EyeOff' },
];

// ── Achievement Definitions ──

export const ACHIEVEMENTS = [

  // ═══ SEASON PROGRESSION ═══
  { id: 'opening_day', title: 'Opening Day', description: 'Start your first Season Mode game.', category: 'progress', rarity: 'Common', hidden: false, phase: 'game', trigger: ctx => ctx.isUserGame },
  { id: 'first_game_complete', title: 'First One In The Books', description: 'Complete your first Season Mode game.', category: 'progress', rarity: 'Common', hidden: false, phase: 'game', trigger: ctx => ctx.isUserGame },
  { id: 'april_baseball', title: 'April Baseball', description: 'Finish the month of April.', category: 'progress', rarity: 'Common', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'milestone' && ctx.season?.currentDate && ctx.season.currentDate >= '1984-05-01' },
  { id: 'dog_days', title: 'Dog Days', description: 'Reach August 1 in Season Mode.', category: 'progress', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'milestone' && ctx.season?.currentDate && ctx.season.currentDate >= '1984-08-01' },
  { id: 'september_call', title: 'September Call', description: 'Reach September 1 in Season Mode.', category: 'progress', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'milestone' && ctx.season?.currentDate && ctx.season.currentDate >= '1984-09-01' },
  { id: 'grind_162', title: '162 Grind', description: "Complete your user's full regular-season schedule.", category: 'progress', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'season_complete' },
  { id: 'long_haul', title: 'The Long Haul', description: 'Complete every regular-season game on the MLB schedule.', category: 'progress', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'season_complete' && ctx.season?.completedGames >= 2106 },
  { id: 'still_here_october', title: 'Still Here In October', description: 'Reach the postseason.', category: 'progress', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => ['postseason', 'season_complete'].includes(ctx.phase) },
  { id: 'april_to_october', title: 'From April To October', description: 'Complete an entire season and postseason.', category: 'progress', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'season_complete' && ctx.season?.seasonPhase === 'SEASON_COMPLETE' },
  { id: 'walk_off_win', title: 'One More Tomorrow', description: 'Win a walk-off game in Season Mode.', category: 'progress', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.walkOff && ctx.userWon },
  { id: 'no_reset_162', title: '162 And Counting', description: 'Finish a regular season without resetting Season Mode.', category: 'progress', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'season_complete' },

  // ═══ TEAM RECORD ═══
  { id: 'hot_start', title: 'Hot Start', description: 'Start the season 5-0.', category: 'team', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => { const st = getUserStanding(ctx.standings, ctx.userTeam); return st && st.w >= 5 && st.l === 0; } },
  { id: 'ten_game_tear', title: 'Ten-Game Tear', description: 'Win 10 games in a row.', category: 'team', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => { const st = getUserStanding(ctx.standings, ctx.userTeam); return st && st.streakType === 'W' && st.streakLen >= 10; } },
  { id: 'stop_bleeding', title: 'Stop The Bleeding', description: 'Snap a losing streak of 5 or more games.', category: 'team', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.snappedLosingStreak >= 5 },
  { id: 'above_water', title: 'Above Water', description: 'Get your team above .500 after being below .500.', category: 'team', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => { const st = getUserStanding(ctx.standings, ctx.userTeam); return st && st.w > st.l && ctx.extraData?.wasBelow500; } },
  { id: 'first_place', title: 'First Place Feeling', description: 'Take over 1st place in your division.', category: 'team', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => isDivisionWinner(ctx.standings, ctx.userTeam) },
  { id: 'wire_to_wire', title: 'Wire To Wire', description: 'Finish the season in 1st place after holding 1st on May 1.', category: 'team', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'season_complete' && isDivisionWinner(ctx.standings, ctx.userTeam) },
  { id: 'division_champs', title: 'Division Champs', description: 'Win your division.', category: 'team', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => ['season_complete', 'postseason'].includes(ctx.phase) && isDivisionWinner(ctx.standings, ctx.userTeam) },
  { id: 'heartbreak_hotel', title: 'Heartbreak Hotel', description: 'Miss the postseason by 1 game.', category: 'team', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'season_complete' && ctx.extraData?.missedPostseasonBy === 1 },
  { id: 'spoiler_alert', title: 'Spoiler Alert', description: 'Beat a division contender after your team has been eliminated.', category: 'team', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.spoilerWin },
  { id: 'comeback_club', title: 'The Comeback Club', description: 'Come from 10+ games back to win the division.', category: 'team', rarity: 'Legendary', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'season_complete' && ctx.extraData?.cameBackFrom >= 10 },
  { id: 'century_mark', title: 'Century Mark', description: 'Win 100 games.', category: 'team', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => { const st = getUserStanding(ctx.standings, ctx.userTeam); return st && st.w >= 100; } },
  { id: 'just_enough', title: 'Just Enough', description: 'Win the division with fewer than 90 wins.', category: 'team', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'season_complete' && isDivisionWinner(ctx.standings, ctx.userTeam) && (() => { const st = getUserStanding(ctx.standings, ctx.userTeam); return st && st.w < 90; })() },
  { id: 'last_day_drama', title: 'Last Day Drama', description: 'Clinch a division or playoff spot on the final day of the regular season.', category: 'team', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'season_complete' && ctx.extraData?.clinchedOnLastDay },

  // ═══ HITTING ═══
  { id: 'first_knock', title: 'First Knock', description: 'Record your first hit in Season Mode.', category: 'hitting', rarity: 'Common', hidden: false, phase: 'game', trigger: ctx => ctx.isUserGame && sumBat(ctx, 'h') >= 1 },
  { id: 'touch_em_all', title: "Touch 'Em All", description: 'Hit your first home run in Season Mode.', category: 'hitting', rarity: 'Common', hidden: false, phase: 'game', trigger: ctx => ctx.isUserGame && (ctx.userHRs?.length || 0) >= 1 },
  { id: 'multi_homer', title: 'Multi-Homer Game', description: 'Hit 2 home runs with one player in a game.', category: 'hitting', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => (ctx.userBatting || []).some(b => (b.hr || 0) >= 2) },
  { id: 'three_homer', title: 'Three Times A Charm', description: 'Hit 3 home runs with one player in a game.', category: 'hitting', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => (ctx.userBatting || []).some(b => (b.hr || 0) >= 3) },
  { id: 'grand_occasion', title: 'Grand Occasion', description: 'Hit a grand slam.', category: 'hitting', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.grandSlam },
  { id: 'slam_the_door', title: 'Slam The Door', description: 'Hit a grand slam in the 7th inning or later.', category: 'hitting', rarity: 'Epic', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.grandSlam && ctx.extraData?.grandSlamInning >= 7 },
  { id: 'cycle_watch', title: 'Cycle Watch', description: 'Collect a single, double, triple, and home run with one player.', category: 'hitting', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => (ctx.userBatting || []).some(b => { const singles = (b.h || 0) - (b.doubles || 0) - (b.triples || 0) - (b.hr || 0); return singles >= 1 && (b.doubles || 0) >= 1 && (b.triples || 0) >= 1 && (b.hr || 0) >= 1; }) },
  { id: 'five_hit_night', title: 'Five-Hit Night', description: 'Get 5 hits with one player.', category: 'hitting', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => (ctx.userBatting || []).some(b => (b.h || 0) >= 5) },
  { id: 'seven_rbi_storm', title: 'Seven RBI Storm', description: 'Drive in 7+ runs with one player.', category: 'hitting', rarity: 'Epic', hidden: false, phase: 'game', trigger: ctx => (ctx.userBatting || []).some(b => (b.rbi || 0) >= 7) },
  { id: 'small_ball_lives', title: 'Small Ball Lives', description: 'Score a run using bunt, steal, and sacrifice in the same inning.', category: 'hitting', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.smallBallInning },
  { id: 'pinch_hit_hero', title: 'Pinch-Hit Hero', description: 'Hit a pinch-hit home run.', category: 'hitting', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.pinchHitHR },
  { id: 'bench_mob', title: 'Bench Mob', description: 'Bench player drives in 3+ runs.', category: 'hitting', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.benchRBI >= 3 },
  { id: 'speed_kills', title: 'Speed Kills', description: 'Steal 3 bases with one player in a game.', category: 'hitting', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => (ctx.userBatting || []).some(b => (b.sb || 0) >= 3) },
  { id: 'manufactured_run', title: 'Manufactured Run', description: 'Score without a hit in the inning.', category: 'hitting', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.manufacturedRun },
  { id: 'two_out_thunder', title: 'Two-Out Thunder', description: 'Score 4+ runs in an inning with two outs.', category: 'hitting', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.twoOutRallyRuns >= 4 },
  { id: 'back_to_back', title: 'Back-To-Back Jacks', description: 'Hit back-to-back home runs.', category: 'hitting', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.backToBackHR },
  { id: 'back_to_back_to_back', title: 'Back-To-Back-To-Back', description: 'Hit three straight home runs.', category: 'hitting', rarity: 'Epic', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.backToBackToBackHR },
  { id: 'leadoff_lightning', title: 'Leadoff Lightning', description: 'Hit a leadoff home run.', category: 'hitting', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.leadoffHR },
  { id: 'pitcher_who_rakes', title: 'Pitcher Who Rakes', description: 'Get 3 hits with a pitcher.', category: 'hitting', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.pitcherHits >= 3 },
  { id: 'pitcher_power', title: 'Pitcher Power', description: 'Hit a home run with a pitcher.', category: 'hitting', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.pitcherHR },

  // ═══ PITCHING ═══
  { id: 'quality_start', title: 'Quality Start', description: 'Pitch at least 6 innings and allow 3 or fewer earned runs.', category: 'pitching', rarity: 'Common', hidden: false, phase: 'game', trigger: ctx => (ctx.userPitching || []).some(p => (p.outs || 0) >= 18 && (p.er || 0) <= 3) },
  { id: 'complete_game', title: 'Complete Game', description: 'Throw a complete game.', category: 'pitching', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => (ctx.userPitching || []).length === 1 && (ctx.userPitching[0].outs || 0) >= 24 },
  { id: 'complete_game_shutout', title: 'Complete Game Shutout', description: 'Throw a complete-game shutout.', category: 'pitching', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => (ctx.userPitching || []).length === 1 && (ctx.userPitching[0].outs || 0) >= 24 && sumPitch(ctx, 'er') === 0 },
  { id: 'no_hit_watch', title: 'No-Hit Watch', description: 'Take a no-hitter into the 7th inning.', category: 'pitching', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => sumPitch(ctx, 'h') <= 1 && sumPitch(ctx, 'outs') >= 21 },
  { id: 'no_no', title: 'No-No', description: 'Throw a no-hitter.', category: 'pitching', rarity: 'Epic', hidden: false, phase: 'game', trigger: ctx => sumPitch(ctx, 'h') === 0 && sumPitch(ctx, 'outs') >= 24 },
  { id: 'perfect_game', title: 'Perfect', description: 'Throw a perfect game.', category: 'pitching', rarity: 'Legendary', hidden: false, phase: 'game', trigger: ctx => sumPitch(ctx, 'h') === 0 && sumPitch(ctx, 'bb') === 0 && (ctx.userErrors || 0) === 0 && sumPitch(ctx, 'outs') >= 24 },
  { id: 'ten_punchouts', title: 'Ten Punchouts', description: 'Strike out 10+ batters with one pitcher.', category: 'pitching', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => (ctx.userPitching || []).some(p => (p.so || 0) >= 10) },
  { id: 'fifteen_punchouts', title: 'Fifteen Punchouts', description: 'Strike out 15+ batters with one pitcher.', category: 'pitching', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => (ctx.userPitching || []).some(p => (p.so || 0) >= 15) },
  { id: 'escape_artist', title: 'Escape Artist', description: 'Escape a bases-loaded, no-out jam without allowing a run.', category: 'pitching', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.escapedBasesLoaded },
  { id: 'fireman', title: 'Fireman', description: 'Record a save.', category: 'pitching', rarity: 'Common', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && (ctx.userPitching || []).some(p => p.sv === 1) },
  { id: 'old_school_save', title: 'Old-School Save', description: 'Record a save of 3+ innings.', category: 'pitching', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && (ctx.userPitching || []).some(p => p.sv === 1 && (p.outs || 0) >= 9) },
  { id: 'nail_biter', title: 'Nail-Biter', description: 'Record a one-run save.', category: 'pitching', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && ctx.margin === 1 && (ctx.userPitching || []).some(p => p.sv === 1) },
  { id: 'bullpen_masterclass', title: 'Bullpen Masterclass', description: 'Bullpen throws 4+ scoreless innings.', category: 'pitching', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => { const relievers = (ctx.userPitching || []).filter(p => p.gs !== 1); const outs = relievers.reduce((s, p) => s + (p.outs || 0), 0); const er = relievers.reduce((s, p) => s + (p.er || 0), 0); return outs >= 12 && er === 0; } },
  { id: 'lefty_specialist', title: 'Lefty Specialist', description: 'Use a left-handed reliever to retire a key left-handed hitter late.', category: 'pitching', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.leftySpecialist },
  { id: 'workhorse', title: 'Workhorse', description: 'Starter throws 120+ pitches and wins.', category: 'pitching', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => { const sp = (ctx.userPitching || []).find(p => p.gs === 1); return sp && (sp.pitches || 0) >= 120 && sp.w === 1; } },
  { id: 'hooked_right_time', title: 'Hooked At The Right Time', description: 'Remove a starter before he blows a lead and win the game.', category: 'pitching', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.goodHook },
  { id: 'rough_start_strong_finish', title: 'Rough Start, Strong Finish', description: 'Starter allows 3+ runs in first 2 innings but earns the win.', category: 'pitching', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.roughStartWin },

  // ═══ DEFENSE & FIELDING ═══
  { id: 'web_gem', title: 'Web Gem', description: 'Make a diving catch.', category: 'defense', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.divingCatch },
  { id: 'leather_show', title: 'Leather Show', description: 'Make 3 defensive gems in one game.', category: 'defense', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => (ctx.extraData?.defensiveGems || 0) >= 3 },
  { id: 'robbery', title: 'Robbery', description: 'Rob a home run.', category: 'defense', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.robbedHR },
  { id: 'shea_magic', title: 'Shea Magic', description: 'Rob a home run at Shea Stadium.', category: 'defense', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.robbedHR && ctx.gameResult?.homeTeam === 'mets' },
  { id: 'double_trouble', title: 'Double Trouble', description: 'Turn 3 double plays in one game.', category: 'defense', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => (ctx.extraData?.doublePlays || 0) >= 3 },
  { id: 'around_the_horn', title: 'Around The Horn', description: 'Turn an inning-ending double play with bases loaded.', category: 'defense', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.basesLoadedDP },
  { id: 'caught_napping', title: 'Caught Napping', description: 'Pick off a runner.', category: 'defense', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.pickoff },
  { id: 'cannon_arm', title: 'Cannon Arm', description: 'Throw out a runner at home from the outfield.', category: 'defense', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.outAtHome },
  { id: 'no_free_bases', title: 'No Free Bases', description: 'Throw out 2 runners trying to steal in one game.', category: 'defense', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => (ctx.extraData?.caughtStealing || 0) >= 2 },
  { id: 'rally_killer', title: 'Rally Killer', description: 'End an inning with a defensive gem while tying or go-ahead run is on base.', category: 'defense', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.rallyKiller },
  { id: 'costly_boot', title: 'Costly Boot', description: 'Commit an error that leads to 3+ unearned runs.', category: 'defense', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.costlyError },
  { id: 'redemption_glove', title: 'Redemption Glove', description: 'Commit an error, then later make a game-saving defensive play.', category: 'defense', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.redemptionGlove },

  // ═══ GAME DRAMA ═══
  { id: 'walkoff_winner', title: 'Walk-Off Winner', description: 'Win on a walk-off hit.', category: 'drama', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.walkOff && ctx.userWon },
  { id: 'walkoff_homer', title: 'Walk-Off Homer', description: 'Win on a walk-off home run.', category: 'drama', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.walkOff && ctx.userWon && ctx.extraData?.walkOffHR },
  { id: 'down_but_not_out', title: 'Down But Not Out', description: 'Come back from 5+ runs down to win.', category: 'drama', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && ctx.extraData?.largestDeficit >= 5 },
  { id: 'miracle_ninth', title: 'Miracle Ninth', description: 'Score 4+ runs in the 9th inning to win.', category: 'drama', rarity: 'Epic', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.ninthInningComeback },
  { id: 'extra_inning_madness', title: 'Extra-Inning Madness', description: 'Win a game in the 12th inning or later.', category: 'drama', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && ctx.innings >= 12 },
  { id: 'marathon_men', title: 'Marathon Men', description: 'Play a game of 15+ innings.', category: 'drama', rarity: 'Epic', hidden: false, phase: 'game', trigger: ctx => ctx.innings >= 15 },
  { id: 'heartbreaker', title: 'Heartbreaker', description: 'Lose on a walk-off.', category: 'drama', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.walkOff && !ctx.userWon },
  { id: 'one_run_wonder', title: 'One Run Wonder', description: 'Win a 1-run game.', category: 'drama', rarity: 'Common', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && ctx.margin === 1 },
  { id: 'blowout_city', title: 'Blowout City', description: 'Win by 10+ runs.', category: 'drama', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && ctx.margin >= 10 },
  { id: 'pitchers_duel', title: "Pitcher's Duel", description: 'Win a game where both teams score 2 or fewer runs.', category: 'drama', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && ctx.userScore <= 2 && ctx.oppScore <= 2 },
  { id: 'slugfest', title: 'Slugfest', description: 'Win a game where both teams score 8+ runs.', category: 'drama', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && ctx.userScore >= 8 && ctx.oppScore >= 8 },
  { id: 'escalated_quickly', title: 'That Escalated Quickly', description: 'Score 7+ runs in one inning.', category: 'drama', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => (ctx.extraData?.maxInningRuns || 0) >= 7 },
  { id: 'hold_your_breath', title: 'Hold Your Breath', description: 'Win while the tying run is on base in the 9th.', category: 'drama', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && ctx.extraData?.tyingRunOnBaseNinth },

  // ═══ INJURIES & DISCIPLINE ═══
  { id: 'next_man_up', title: 'Next Man Up', description: 'Win a game after a starter leaves injured.', category: 'discipline', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && (ctx.injuries || []).some(i => i.teamKey === ctx.userTeam) },
  { id: 'day_to_day_drama', title: 'Day-To-Day Drama', description: 'Win while missing a day-to-day player.', category: 'discipline', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && ctx.extraData?.missingDayToDay },
  { id: 'patchwork_lineup', title: 'Patchwork Lineup', description: 'Win while 3+ players are unavailable.', category: 'discipline', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && (ctx.extraData?.unavailableCount || 0) >= 3 },
  { id: 'mash_unit', title: 'MASH Unit', description: 'Have 5 players injured at the same time.', category: 'discipline', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => (ctx.extraData?.injuredCount || 0) >= 5 },
  { id: 'return_from_shelf', title: 'Return From The Shelf', description: 'Win a game with a player returning from injury.', category: 'discipline', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && ctx.extraData?.playerReturnedFromInjury },
  { id: 'heated_skipper', title: 'Heated Skipper', description: 'Have your manager ejected.', category: 'discipline', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.managerEjected },
  { id: 'playing_under_protest', title: 'Playing Under Protest', description: 'Win a game after your manager is ejected.', category: 'discipline', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && ctx.extraData?.managerEjected },
  { id: 'tossed', title: 'Tossed', description: 'Have a player ejected.', category: 'discipline', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => (ctx.ejections || []).some(e => e.teamKey === ctx.userTeam) },
  { id: 'warnings_issued', title: 'Warnings Issued', description: 'Both teams receive warnings.', category: 'discipline', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.warningsIssued },
  { id: 'retaliation', title: 'Retaliation', description: 'Pitcher is ejected after hitting a batter following warnings.', category: 'discipline', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => (ctx.ejections || []).some(e => e.reason === 'hbp_after_warning' || e.reason === 'obvious_retaliation') },
  { id: 'bench_clearing', title: 'Bench-Clearing', description: 'Trigger a bench-clearing incident.', category: 'discipline', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.benchCleared },
  { id: 'suspended', title: 'Suspended', description: 'Have a player suspended.', category: 'discipline', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.playerSuspended },
  { id: 'acting_manager', title: 'Acting Manager', description: 'Win while your manager is suspended.', category: 'discipline', rarity: 'Epic', hidden: false, phase: 'game', trigger: ctx => ctx.userWon && ctx.extraData?.managerSuspended },

  // ═══ ALL-STAR GAME ═══
  { id: 'midsummer_classic', title: 'Midsummer Classic', description: 'Reach the All-Star Break.', category: 'allstar', rarity: 'Common', hidden: false, phase: 'season', trigger: ctx => ['allstar', 'trade', 'awards', 'postseason', 'season_complete'].includes(ctx.phase) || ctx.season?.allStarBreakPhase },
  { id: 'allstar_rep', title: 'All-Star Representative', description: 'Have at least one player from your team make the All-Star roster.', category: 'allstar', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => { const rosters = ctx.season?.allStarRosters || ctx.allStarRosters; if (!rosters) return false; const league = ctx.extraData?.userLeague; const check = (arr) => (arr || []).some(p => p.teamKey === ctx.userTeam); return check(rosters.AL?.battingOrder) || check(rosters.AL?.bench) || check(rosters.AL?.pitchers?.starters) || check(rosters.AL?.pitchers?.relievers) || check(rosters.NL?.battingOrder) || check(rosters.NL?.bench) || check(rosters.NL?.pitchers?.starters) || check(rosters.NL?.pitchers?.relievers); } },
  { id: 'starting_star', title: 'Starting Star', description: 'Have one of your players named an All-Star starter.', category: 'allstar', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => { const rosters = ctx.season?.allStarRosters || ctx.allStarRosters; if (!rosters) return false; const check = (arr) => (arr || []).some(p => p.teamKey === ctx.userTeam); return check(rosters.AL?.battingOrder) || check(rosters.NL?.battingOrder); } },
  { id: 'allstar_mvp', title: 'All-Star MVP', description: 'Have one of your players win All-Star Game MVP.', category: 'allstar', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => { const mvp = ctx.season?.allStarMvp; return mvp && mvp.team === ctx.userTeam; } },
  { id: 'win_the_classic', title: 'Win The Classic', description: 'Win the All-Star Game as your league.', category: 'allstar', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => { const result = ctx.season?.allStarGameResult; if (!result) return false; const userLeague = ctx.extraData?.userLeague; return result.winningLeague === userLeague; } },
  { id: 'showcase_manager', title: 'Showcase Manager', description: 'Use 5+ pitchers in the All-Star Game.', category: 'allstar', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.allStarPitchersUsed >= 5 },
  { id: 'everyone_look', title: 'Everyone Gets A Look', description: 'Use 10+ position players in the All-Star Game.', category: 'allstar', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.allStarPlayersUsed >= 10 },
  { id: 'asg_fireworks', title: 'ASG Fireworks', description: 'Hit a home run in the All-Star Game.', category: 'allstar', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.allStarHR },
  { id: 'asg_walkoff', title: 'ASG Walk-Off', description: 'Win the All-Star Game on a walk-off.', category: 'allstar', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.allStarWalkOff },
  { id: 'home_field_earned', title: 'Home Field Earned', description: 'Win the All-Star Game and earn World Series home-field advantage.', category: 'allstar', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => ctx.season?.worldSeriesHomeFieldLeague && ctx.season?.allStarGameResult?.winningLeague === ctx.extraData?.userLeague },

  // ═══ TRADE DEADLINE ═══
  { id: 'deadline_day', title: 'Deadline Day', description: 'Reach the Trade Deadline.', category: 'trade', rarity: 'Common', hidden: false, phase: 'season', trigger: ctx => ['trade', 'awards', 'postseason', 'season_complete'].includes(ctx.phase) || ctx.season?.tradeDeadlinePhase },
  { id: 'buyer', title: 'Buyer', description: 'Your team makes a trade while in contention.', category: 'trade', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => { const trades = ctx.season?.tradeDeadlineTrades || ctx.trades; return (trades || []).some(t => t.isUserTrade && t.teamA === ctx.userTeam && t.contender); } },
  { id: 'seller', title: 'Seller', description: 'Your team makes a trade while out of contention.', category: 'trade', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => { const trades = ctx.season?.tradeDeadlineTrades || ctx.trades; return (trades || []).some(t => t.isUserTrade && t.teamA === ctx.userTeam && !t.contender); } },
  { id: 'lefty_help', title: 'Lefty Help', description: 'Acquire a left-handed reliever at the deadline.', category: 'trade', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => { const trades = ctx.season?.tradeDeadlineTrades || ctx.trades; return (trades || []).some(t => t.isUserTrade && t.teamA === ctx.userTeam && t.teamAGets?.[0]?.pos === 'RP'); } },
  { id: 'bench_upgrade', title: 'Bench Upgrade', description: 'Acquire a bench bat at the deadline.', category: 'trade', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => { const trades = ctx.season?.tradeDeadlineTrades || ctx.trades; return (trades || []).some(t => t.isUserTrade && t.teamA === ctx.userTeam && t.needType === 'BENCH_BAT'); } },
  { id: 'rotation_help', title: 'Rotation Help', description: 'Acquire a starting pitcher at the deadline.', category: 'trade', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => { const trades = ctx.season?.tradeDeadlineTrades || ctx.trades; return (trades || []).some(t => t.isUserTrade && t.teamA === ctx.userTeam && t.teamAGets?.[0]?.pos === 'SP'); } },
  { id: 'fair_deal', title: 'Fair Deal', description: 'Complete a trade where both player values are close.', category: 'trade', rarity: 'Common', hidden: false, phase: 'season', trigger: ctx => { const trades = ctx.season?.tradeDeadlineTrades || ctx.trades; return (trades || []).some(t => t.fair); } },
  { id: 'deadline_winner', title: 'Deadline Winner', description: 'A deadline acquisition helps win a game in September.', category: 'trade', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.deadlineAcquisitionContributed },
  { id: 'fresh_face', title: 'Fresh Face', description: "A newly acquired player gets a hit in his first game with your team.", category: 'trade', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.newAcquisitionHit },
  { id: 'immediate_impact', title: 'Immediate Impact', description: 'A newly acquired player records an RBI, save, or win in his first game.', category: 'trade', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.extraData?.newAcquisitionImpact },

  // ═══ AWARDS ═══
  { id: 'potw', title: 'Player Of The Week', description: 'Have one of your players win weekly honors.', category: 'awards', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => (ctx.extraData?.weeklyAwards || []).some(a => a.team === ctx.userTeam && (a.type === 'PlayerOfTheWeek' || a.type === 'BatterOfTheWeek')) },
  { id: 'potw_pitcher', title: 'Pitcher Of The Week', description: 'Have one of your pitchers win weekly honors.', category: 'awards', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => (ctx.extraData?.weeklyAwards || []).some(a => a.team === ctx.userTeam && (a.type === 'PitcherOfTheWeek')) },
  { id: 'potm', title: 'Player Of The Month', description: 'Have one of your players win monthly honors.', category: 'awards', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => (ctx.extraData?.monthlyAwards || []).some(a => a.team === ctx.userTeam && (a.type === 'PlayerOfTheMonth' || a.type === 'BatterOfTheMonth')) },
  { id: 'potm_pitcher', title: 'Pitcher Of The Month', description: 'Have one of your pitchers win monthly honors.', category: 'awards', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => (ctx.extraData?.monthlyAwards || []).some(a => a.team === ctx.userTeam && a.type === 'PitcherOfTheMonth') },
  { id: 'mvp_season', title: 'MVP Season', description: 'Have one of your players win league MVP.', category: 'awards', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => (ctx.season?.seasonAwards || ctx.awards || []).some(a => a.awardType === 'MVP' && a.team === ctx.userTeam) },
  { id: 'cy_young_season', title: 'Cy Young Season', description: 'Have one of your pitchers win Cy Young.', category: 'awards', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => (ctx.season?.seasonAwards || ctx.awards || []).some(a => a.awardType === 'CyYoung' && a.team === ctx.userTeam) },
  { id: 'fireman_year', title: 'Fireman Of The Year', description: 'Have one of your relievers win Fireman of the Year.', category: 'awards', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => (ctx.season?.seasonAwards || ctx.awards || []).some(a => a.awardType === 'FiremanOfTheYear' && a.team === ctx.userTeam) },
  { id: 'manager_year', title: 'Manager Of The Year', description: 'Win Manager of the Year.', category: 'awards', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => (ctx.season?.seasonAwards || ctx.awards || []).some(a => a.awardType === 'ManagerOfTheYear' && a.team === ctx.userTeam) },
  { id: 'clean_sweep', title: 'Clean Sweep', description: 'Win 3+ major awards in the same season.', category: 'awards', rarity: 'Legendary', hidden: false, phase: 'season', trigger: ctx => { const awards = ctx.season?.seasonAwards || ctx.awards || []; const userAwards = awards.filter(a => a.team === ctx.userTeam && ['MVP', 'CyYoung', 'FiremanOfTheYear', 'ManagerOfTheYear', 'ROY'].includes(a.awardType)); return userAwards.length >= 3; } },
  { id: 'league_leader', title: 'League Leader', description: 'Have a player finish first in a major league category.', category: 'awards', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.leagueLeader },
  { id: 'triple_crown_watch', title: 'Triple Crown Watch', description: 'Lead the league in AVG, HR, and RBI on September 1.', category: 'awards', rarity: 'Legendary', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.tripleCrownWatch },
  { id: 'pitching_crown', title: 'Pitching Crown', description: 'Lead the league in ERA, wins, and strikeouts on September 1.', category: 'awards', rarity: 'Legendary', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.pitchingCrownWatch },

  // ═══ POSTSEASON ═══
  { id: 'october_baseball', title: 'October Baseball', description: 'Play your first postseason game.', category: 'postseason', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => ['postseason', 'season_complete'].includes(ctx.phase) },
  { id: 'lcs_bound', title: 'LCS Bound', description: 'Reach the League Championship Series.', category: 'postseason', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => { const ps = ctx.season?.postseason; return ps && (ps.alcs || ps.nlcs); } },
  { id: 'game_one_statement', title: 'Game One Statement', description: 'Win Game 1 of a postseason series.', category: 'postseason', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.wonGameOne },
  { id: 'even_it_up', title: 'Even It Up', description: 'Win a postseason game while trailing in the series.', category: 'postseason', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.evenedSeries },
  { id: 'elimination_survivor', title: 'Elimination Survivor', description: 'Win an elimination game.', category: 'postseason', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.wonEliminationGame },
  { id: 'reverse_sweep', title: 'Reverse Sweep', description: 'Come back from down 0-2 in a best-of-5 series.', category: 'postseason', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.reverseSweep },
  { id: 'pennant_winner', title: 'Pennant Winner', description: 'Win the pennant.', category: 'postseason', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => { const ps = ctx.season?.postseason; return ps && (ps.alcs?.status === 'complete' || ps.nlcs?.status === 'complete'); } },
  { id: 'ws_bound', title: 'World Series Bound', description: 'Reach the World Series.', category: 'postseason', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => { const ps = ctx.season?.postseason; return ps && ps.worldSeries; } },
  { id: 'ws_winner', title: 'World Series Winner', description: 'Win the World Series.', category: 'postseason', rarity: 'Legendary', hidden: false, phase: 'season', trigger: ctx => ctx.season?.champion === ctx.userTeam },
  { id: 'game_seven_glory', title: 'Game Seven Glory', description: 'Win a Game 7.', category: 'postseason', rarity: 'Legendary', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.wonGameSeven },
  { id: 'october_walkoff', title: 'October Walk-Off', description: 'Win a postseason game on a walk-off.', category: 'postseason', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.postseasonWalkOff },
  { id: 'postseason_shutout', title: 'Postseason Shutout', description: 'Throw a postseason shutout.', category: 'postseason', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.postseasonShutout },
  { id: 'mr_october', title: 'Mr. October', description: 'One player hits 3+ postseason home runs.', category: 'postseason', rarity: 'Legendary', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.postseasonHRLeader >= 3 },
  { id: 'october_ace', title: 'October Ace', description: 'Pitcher wins 2+ postseason games.', category: 'postseason', rarity: 'Epic', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.postseasonWinsLeader >= 2 },
  { id: 'champagne_shower', title: 'Champagne Shower', description: 'Win the championship with your selected team.', category: 'postseason', rarity: 'Legendary', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'season_complete' && ctx.season?.champion === ctx.userTeam },

  // ═══ METS-SPECIFIC ═══
  { id: 'meet_the_mets', title: 'Meet The Mets', description: 'Win your first game with the Mets.', category: 'mets', rarity: 'Common', hidden: false, phase: 'game', trigger: ctx => ctx.userTeam === 'mets' && ctx.userWon && ctx.isUserGame },
  { id: 'shea_roar', title: 'Shea Roar', description: 'Hit a walk-off home run at Shea Stadium.', category: 'mets', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.userTeam === 'mets' && ctx.walkOff && ctx.userWon && ctx.extraData?.walkOffHR && ctx.userIsHome },
  { id: 'gooden_time', title: 'Gooden Time', description: 'Strike out 10+ with Dwight Gooden.', category: 'mets', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => ctx.userTeam === 'mets' && (userPitcher(ctx, 'Gooden')?.so || 0) >= 10 },
  { id: 'doc_dominates', title: 'Doc Dominates', description: 'Throw 8+ innings with Gooden and allow 1 or fewer runs.', category: 'mets', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => { if (ctx.userTeam !== 'mets') return false; const p = userPitcher(ctx, 'Gooden'); return p && (p.outs || 0) >= 24 && (p.er || 0) <= 1; } },
  { id: 'strawberry_moonshot', title: 'Strawberry Moonshot', description: 'Hit a 450+ foot home run with Darryl Strawberry.', category: 'mets', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.userTeam === 'mets' && (ctx.homeRuns || []).some(hr => (hr.name || '').includes('Straw') && (hr.distance || 0) >= 450) },
  { id: 'keith_being_keith', title: 'Keith Being Keith', description: 'Record 3 hits or 3 RBI with Keith Hernandez.', category: 'mets', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => { if (ctx.userTeam !== 'mets') return false; const b = userBatter(ctx, 'Hernandez'); return b && ((b.h || 0) >= 3 || (b.rbi || 0) >= 3); } },
  { id: 'mookie_magic', title: 'Mookie Magic', description: 'Steal a base and score a run with Mookie Wilson.', category: 'mets', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => { if (ctx.userTeam !== 'mets') return false; const b = userBatter(ctx, 'Mookie'); return b && (b.sb || 0) >= 1 && (b.r || 0) >= 1; } },
  { id: 'backman_battle', title: 'Backman Battle', description: 'Have Wally Backman reach base 3+ times.', category: 'mets', rarity: 'Uncommon', hidden: false, phase: 'game', trigger: ctx => { if (ctx.userTeam !== 'mets') return false; const b = userBatter(ctx, 'Backman'); return b && ((b.h || 0) + (b.bb || 0)) >= 3; } },
  { id: 'kid_delivers', title: 'The Kid Delivers', description: 'Hit a clutch HR with Gary Carter.', category: 'mets', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.userTeam === 'mets' && (ctx.homeRuns || []).some(hr => (hr.name || '').includes('Carter')) },
  { id: 'flushing_frenzy', title: 'Flushing Frenzy', description: 'Win 8 straight home games at Shea.', category: 'mets', rarity: 'Rare', hidden: false, phase: 'season', trigger: ctx => ctx.extraData?.homeWinStreak >= 8 },
  { id: 'queens_comeback', title: 'Queens Comeback', description: 'Come back from 4+ runs down at Shea.', category: 'mets', rarity: 'Rare', hidden: false, phase: 'game', trigger: ctx => ctx.userTeam === 'mets' && ctx.userIsHome && ctx.userWon && (ctx.extraData?.largestDeficit || 0) >= 4 },
  { id: 'almost_there', title: 'Almost There', description: 'Finish over .500 with the 1984 Mets.', category: 'mets', rarity: 'Uncommon', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'season_complete' && ctx.userTeam === 'mets' && (() => { const st = getUserStanding(ctx.standings, ctx.userTeam); return st && st.w > st.l; })() },
  { id: 'changing_history', title: 'Changing History', description: 'Win the NL East with the 1984 Mets.', category: 'mets', rarity: 'Legendary', hidden: false, phase: 'season', trigger: ctx => ctx.phase === 'season_complete' && ctx.userTeam === 'mets' && isDivisionWinner(ctx.standings, ctx.userTeam) },

  // ═══ HIDDEN / RARE ═══
  { id: 'ump_show', title: 'The Ump Show', description: 'Have both a player and manager ejected in the same game.', category: 'hidden', rarity: 'Rare', hidden: true, phase: 'game', trigger: ctx => ctx.extraData?.managerEjected && (ctx.ejections || []).some(e => e.teamKey === ctx.userTeam) },
  { id: 'chaos_sixth', title: 'Chaos In The Sixth', description: 'Have an injury, ejection, and home run in the same inning.', category: 'hidden', rarity: 'Epic', hidden: true, phase: 'game', trigger: ctx => ctx.extraData?.chaosInning },
  { id: 'bad_blood', title: 'Bad Blood', description: 'Trigger warnings, an ejection, and a suspension in the same game.', category: 'hidden', rarity: 'Epic', hidden: true, phase: 'game', trigger: ctx => ctx.warningsIssued && (ctx.ejections || []).length > 0 && ctx.extraData?.playerSuspended },
  { id: 'baseball_gods', title: 'The Baseball Gods', description: 'Win a game despite being outhit by 8+.', category: 'hidden', rarity: 'Epic', hidden: true, phase: 'game', trigger: ctx => ctx.userWon && (ctx.extraData?.hitDifferential || 0) <= -8 },
  { id: 'how_did_we_win', title: 'How Did We Win That?', description: 'Win with 3 or fewer hits.', category: 'hidden', rarity: 'Rare', hidden: true, phase: 'game', trigger: ctx => ctx.userWon && sumBat(ctx, 'h') <= 3 },
  { id: 'how_did_we_lose', title: 'How Did We Lose That?', description: 'Lose with 12+ hits.', category: 'hidden', rarity: 'Rare', hidden: true, phase: 'game', trigger: ctx => !ctx.userWon && sumBat(ctx, 'h') >= 12 },
  { id: 'free_baseball_forever', title: 'Free Baseball Forever', description: 'Play an 18-inning game.', category: 'hidden', rarity: 'Legendary', hidden: true, phase: 'game', trigger: ctx => ctx.innings >= 18 },
  { id: 'bunt_madness', title: 'Bunt Madness', description: 'Record 3 bunt hits in one game.', category: 'hidden', rarity: 'Epic', hidden: true, phase: 'game', trigger: ctx => (ctx.extraData?.buntHits || 0) >= 3 },
  { id: 'old_ways', title: 'The Old Ways', description: 'Win with sacrifice bunt, stolen base, complete game, and no home runs.', category: 'hidden', rarity: 'Epic', hidden: true, phase: 'game', trigger: ctx => ctx.userWon && ctx.extraData?.hadSacrificeBunt && ctx.extraData?.hadStolenBase && (ctx.userPitching || []).length === 1 && (ctx.userHRs?.length || 0) === 0 },
  { id: 'radio_classic', title: 'Radio Classic', description: 'Finish a game with a walk-off while using radio broadcast mode.', category: 'hidden', rarity: 'Rare', hidden: true, phase: 'game', trigger: ctx => ctx.walkOff && ctx.userWon && ctx.extraData?.radioMode },
  { id: 'newspaper_legend', title: 'Newspaper Legend', description: 'Generate a front-page headline after a historic performance.', category: 'hidden', rarity: 'Rare', hidden: true, phase: 'game', trigger: ctx => ctx.extraData?.frontPageHeadline },
  { id: 'baseball_is_weird', title: 'Baseball Is Weird', description: 'Win a game that includes an injury, error, stolen base, balk, and ejection.', category: 'hidden', rarity: 'Legendary', hidden: true, phase: 'game', trigger: ctx => ctx.userWon && (ctx.injuries || []).length > 0 && (ctx.userErrors || 0) > 0 && ctx.extraData?.hadStolenBase && ctx.extraData?.hadBalk && (ctx.ejections || []).length > 0 },

];