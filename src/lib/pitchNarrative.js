// Pitch-by-pitch narrative generation engine
// Tells the story of each pitch: setup, delivery, action, result

export function generatePitchNarrative(gameState, pitchType, swingType, result) {
  if (!gameState || !result) return null;

  const pitcher = gameState.effectivePitcher || gameState.pitchers[gameState.inning - 1];
  const batter = gameState.batter;
  const bases = gameState.bases;
  const count = `${gameState.balls}-${gameState.strikes}`;
  
  if (!pitcher || !batter) return null;

  const lines = [];
  const pitcherName = pitcher.name.split(' ').pop();
  const batterName = batter.name.split(' ').pop();

  // ── LINE 1: Setup (pitcher's perspective on runners/batter) ──
  const runnersOn = bases.filter(r => r !== null).length;
  const firstBaseRunner = bases[0];
  const secondBaseRunner = bases[1];
  const thirdBaseRunner = bases[2];

  if (firstBaseRunner && !secondBaseRunner && !thirdBaseRunner) {
    lines.push(`${pitcherName} checks ${firstBaseRunner.name.split(' ').pop()} at first...`);
  } else if (secondBaseRunner && !firstBaseRunner && !thirdBaseRunner) {
    lines.push(`${pitcherName} glances at ${secondBaseRunner.name.split(' ').pop()} at second...`);
  } else if (thirdBaseRunner && !firstBaseRunner && !secondBaseRunner) {
    lines.push(`${pitcherName} eyes ${thirdBaseRunner.name.split(' ').pop()} at third...`);
  } else if (firstBaseRunner && secondBaseRunner && !thirdBaseRunner) {
    lines.push(`${pitcherName} looks at the runners in scoring position...`);
  } else if (bases[0] && bases[1] && bases[2]) {
    lines.push(`${pitcherName} takes a breath with the bases loaded...`);
  } else if (runnersOn > 0) {
    lines.push(`${pitcherName} reads the runners on base...`);
  } else {
    lines.push(`${pitcherName} winds up with bases empty...`);
  }

  // ── LINE 2: Delivery + pitch type + location + runner action ──
  const pitchName = pitchType?.name || 'fastball';
  const location = getPitchLocation(result);
  const inZone = result.inZone;

  let deliveryLine = `pitch to the plate...`;
  
  // Runner movement during pitch
  if (result.stolenBase !== undefined) {
    if (result.stolenBase) {
      const baseNum = gameState.pendingSteal;
      const baseNames = ['second', 'third', 'home'];
      deliveryLine += `${firstBaseRunner.name.split(' ').pop()} breaks for ${baseNames[baseNum]}...`;
    } else if (result.caughtStealing) {
      deliveryLine += `${firstBaseRunner.name.split(' ').pop()} breaks but the throw beats him...`;
    }
  }

  deliveryLine += `${pitchName} hits ${location}`;
  if (!inZone) deliveryLine += ` — looks out of the zone`;

  lines.push(deliveryLine);

  // ── LINE 3: Batter decision + outcome ──
  const swingName = swingType?.name || 'take';
  let outcomeType = result.type || 'strike';
  
  let outcomeLine = '';
  
  if (swingName === 'take' || swingName === 'Take Pitch') {
    outcomeLine = `${batterName} takes it...`;
  } else if (swingName === 'swing') {
    outcomeLine = `${batterName} swings...`;
  } else {
    outcomeLine = `${batterName} ${swingName.toLowerCase()}...`;
  }

  // Result
  if (result.text?.includes('hit by the pitch')) {
    outcomeLine += `hit by the pitch`;
  } else if (outcomeType === 'strike') {
    outcomeLine += `strike ${inZone ? 'called' : 'swinging'}`;
  } else if (outcomeType === 'ball') {
    outcomeLine += `ball — wide`;
  } else if (outcomeType === 'homerun') {
    outcomeLine += `DEEP FLY BALL...that's GONE! HOME RUN!`;
  } else if (outcomeType === 'single') {
    outcomeLine += `BASE HIT`;
  } else if (outcomeType === 'double') {
    outcomeLine += `LINE DRIVE INTO THE GAP...TWO BASES!`;
  } else if (outcomeType === 'triple') {
    outcomeLine += `LINE DRIVE TO THE WALL...HE'S ON THIRD!`;
  } else if (outcomeType === 'flyout' || outcomeType === 'lineout' || outcomeType === 'popout') {
    outcomeLine += `FLIES OUT`;
  } else if (outcomeType === 'groundout') {
    outcomeLine += `GROUNDS OUT`;
  } else if (outcomeType === 'walk') {
    outcomeLine += `takes the pitch — BALL FOUR, he's on first`;
  }

  lines.push(outcomeLine);

  // ── LINE 4: Follow-up action (throws, runner advancement) ──
  if (result.caughtStealing) {
    lines.push(`throw to second...they've got him!`);
  } else if (result.stolenBase && firstBaseRunner) {
    const baseNum = gameState.pendingSteal;
    const baseNames = ['second', 'third', 'home'];
    lines.push(`${firstBaseRunner.name.split(' ').pop()} slides into ${baseNames[baseNum]} safely.`);
  } else if (result.type === 'homerun') {
    lines.push(`The crowd is on its feet!`);
  } else if (result.type === 'single' && firstBaseRunner) {
    lines.push(`The runners are moving...${firstBaseRunner.name.split(' ').pop()} advancing.`);
  }

  return lines.join(' ');
}

function getPitchLocation(result) {
  if (!result) return 'somewhere';
  
  const vLoc = result.vLocation || 'middle'; // high, middle, low
  const hLoc = result.hLocation || 'middle'; // left, middle, right (from pitcher's POV: left=RHB's outside)

  const vertical = {
    'high': 'the high part of the zone',
    'middle': 'the middle of the zone',
    'low': 'the low part of the zone',
  };

  const horizontal = {
    'left': 'the outside corner',
    'middle': 'the middle',
    'right': 'the inside corner',
  };

  return `${vertical[vLoc] || 'the zone'} on the ${horizontal[hLoc] || 'middle'}`;
}

export function getPitchReactionLine(batter, result) {
  if (!batter || !result) return '';

  const batterName = batter.name.split(' ').pop();
  const reactions = [];

  if (result.type === 'strike' && !result.swung) {
    reactions.push(`The look on ${batterName}'s face says he thought it was high.`);
    reactions.push(`${batterName} doesn't like that call.`);
    reactions.push(`${batterName} steps out — clearly disagreed with that one.`);
  } else if (result.type === 'ball' && result.swung) {
    reactions.push(`${batterName} swung at ball one — he's protecting.`);
    reactions.push(`${batterName} went after that one and missed.`);
  } else if (result.type === 'homerun') {
    reactions.push(`${batterName} knew it was gone the moment it left his bat.`);
    reactions.push(`They're celebrating in the dugout.`);
  } else if (result.type === 'single') {
    reactions.push(`That's good contact by ${batterName}.`);
    reactions.push(`He's off to first.`);
  }

  return reactions.length > 0 ? reactions[Math.floor(Math.random() * reactions.length)] : '';
}