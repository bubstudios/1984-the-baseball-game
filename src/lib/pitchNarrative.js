// Pitch-by-pitch narrative generation engine using universal announcer calls
// Orange text: play-by-play (pitch delivery, result)
// White text: color commentary (context, analysis, count)

import { 
  PITCH_DELIVERY, 
  CALLED_STRIKES, 
  CALLED_BALLS, 
  SWINGING_STRIKES,
  HIT_BY_PITCH,
  getRandomCall as getPitchCall,
  getPitchCallsByType
} from './universalPitchCalls';

import {
  GROUND_BALLS,
  HARD_GROUND_BALLS,
  LINE_DRIVES,
  FLY_BALLS_SHALLOW,
  FLY_BALLS_ROUTINE,
  FLY_BALLS_DEEP,
  BLOOPERS_FLARES,
  POP_UPS,
  GAP_SHOTS,
  DOWN_THE_LINE,
  HOME_RUNS,
  getRandomCall as getBattedBallCall,
  getBattedBallCallByType
} from './universalBattedBallCalls';

export function generatePitchNarrative(gameState, pitchType, swingType, result) {
  if (!gameState || !result) {
    return {
      playByPlay: 'The pitch is thrown.',
      colorCommentary: 'And the at-bat continues.'
    };
  }

  const pitcher = gameState.effectivePitcher || gameState.pitchers?.[gameState.inning - 1];
  const batter = gameState.batter;
  
  if (!pitcher || !batter) {
    return {
      playByPlay: 'The pitch is thrown.',
      colorCommentary: 'A moment in the game.'
    };
  }

  const resultType = result.type || 'strike';
  const batterName = batter.name.split(' ').pop();
  const count = `${gameState.balls}-${gameState.strikes}`;
  const runners = gameState.bases.filter(r => r !== null).length;

  // ── ORANGE TEXT: Play-by-play (pitch delivery + result) ──
  const playByPlayLines = [];
  
  // Delivery setup
  playByPlayLines.push(getPitchCall(PITCH_DELIVERY));
  
  // Pitch type call
  const pitchCalls = getPitchCallsByType(pitchType);
  playByPlayLines.push(getPitchCall(pitchCalls));
  
  // Swing/take result
  const swingName = swingType?.name?.toLowerCase() || 'take';
  if (swingName === 'take' || swingName.includes('take')) {
    playByPlayLines.push(`${batterName} takes it.`);
  } else if (swingName === 'swing' || swingName === 'swing hard') {
    playByPlayLines.push(`${batterName} swings.`);
  } else {
    playByPlayLines.push(`${batterName} makes contact.`);
  }
  
  // Result call
  if (result.isHBP || result.text?.includes('hit by')) {
    playByPlayLines.push(getPitchCall(HIT_BY_PITCH));
  } else if (resultType === 'strike') {
    playByPlayLines.push(getPitchCall(CALLED_STRIKES));
  } else if (resultType === 'ball') {
    playByPlayLines.push(getPitchCall(CALLED_BALLS));
  } else if (resultType === 'walk') {
    playByPlayLines.push('Ball four! He takes first base.');
  } else if (resultType === 'strikeout') {
    playByPlayLines.push('Strike three! He\'s out!');
  } else if (resultType === 'homerun') {
    playByPlayLines.push(getPitchCall(HOME_RUNS));
  } else {
    // Batted ball — use universal calls
    const ballCalls = getBattedBallCallByType(resultType);
    playByPlayLines.push(getPitchCall(ballCalls));
  }

  // ── WHITE TEXT: Color commentary (context, count, analysis) ──
  const colorLines = [];
  
  // Count situation
  if (count === '0-2') colorLines.push(`Two strikes — the hitter is vulnerable.`);
  else if (count === '2-0') colorLines.push(`Two balls — the pitcher must throw a strike.`);
  else if (count === '3-0') colorLines.push(`Three and oh — a hitter\'s count.`);
  else if (count === '3-2') colorLines.push(`Full count — everything is on the line.`);
  else if (gameState.strikes === 2) colorLines.push(`Two strikes — the hitter is protecting the zone.`);
  else if (gameState.balls === 3) colorLines.push(`Three balls — the pitcher is struggling with location.`);
  
  // Runner context
  if (runners === 3) colorLines.push(`Bases are loaded — pressure on the pitcher.`);
  else if (runners === 2) colorLines.push(`Two runners in scoring position — the defense is alert.`);
  else if (runners === 1) colorLines.push(`Runner on base — the pitcher must be careful.`);
  
  // Pitch effectiveness
  if (resultType === 'strike' && swingName.includes('take')) {
    colorLines.push(`A well-placed pitch that catches the zone.`);
  } else if (resultType === 'ball') {
    colorLines.push(`Off the corner — the pitcher is missing his spots.`);
  } else if (resultType === 'homerun') {
    const runs = runners + 1;
    colorLines.push(`That\'s a ${runs}-run shot! Game-changer!`);
  } else if (resultType === 'double' || resultType === 'triple') {
    colorLines.push(`Extra-base hit — runners are advancing.`);
  } else if (resultType === 'single') {
    colorLines.push(`Base hit — the runner is on first.`);
  } else if (resultType === 'strikeout') {
    colorLines.push(`A strikeout — the pitcher gets the out.`);
  } else if (resultType === 'walk') {
    colorLines.push(`Free pass — the pitcher\'s control is off.`);
  }
  
  // Fallback if no commentary
  if (colorLines.length === 0) {
    colorLines.push(`The at-bat continues.`);
  }

  return {
    playByPlay: playByPlayLines.join(' '),
    colorCommentary: colorLines.join(' ')
  };
}