/**
 * Composure Tracking for Diagnostic Reporting
 * Tracks zone transitions, meltdown spirals, and recovery patterns
 */

export function initializeComposureTracking() {
  return {
    zoneCounts: {
      LOCKED_IN: 0,
      NORMAL: 0,
      PRESSING: 0,
      RED_ZONE: 0,
    },
    zoneTransitions: [],
    recoveryCount: 0,
    meltdownCount: 0,
    pitchersTracked: {},
  };
}

export function trackComposureEvent(tracking, pitcherName, oldZone, newZone, composureValue) {
  if (!tracking.pitchersTracked[pitcherName]) {
    tracking.pitchersTracked[pitcherName] = {
      startComposure: composureValue,
      currentComposure: composureValue,
      minComposure: composureValue,
      zoneHistory: [oldZone],
      lowPointInning: null,
    };
  }
  
  const p = tracking.pitchersTracked[pitcherName];
  p.currentComposure = composureValue;
  if (composureValue < p.minComposure) {
    p.minComposure = composureValue;
  }
  
  if (oldZone !== newZone) {
    tracking.zoneTransitions.push({
      pitcher: pitcherName,
      from: oldZone,
      to: newZone,
      composure: composureValue,
    });
    p.zoneHistory.push(newZone);
  }
  
  if (newZone) {
    tracking.zoneCounts[newZone] = (tracking.zoneCounts[newZone] || 0) + 1;
  }
}

export function trackMeltdown(tracking, pitcherName) {
  tracking.meltdownCount++;
  if (tracking.pitchersTracked[pitcherName]) {
    tracking.pitchersTracked[pitcherName].meltdowns = 
      (tracking.pitchersTracked[pitcherName].meltdowns || 0) + 1;
  }
}

export function trackRecovery(tracking, pitcherName, delta) {
  tracking.recoveryCount++;
  if (tracking.pitchersTracked[pitcherName]) {
    tracking.pitchersTracked[pitcherName].recoveries = 
      (tracking.pitchersTracked[pitcherName].recoveries || 0) + 1;
    tracking.pitchersTracked[pitcherName].totalRecoveryDelta = 
      (tracking.pitchersTracked[pitcherName].totalRecoveryDelta || 0) + delta;
  }
}

export function generateComposureReport(tracking) {
  console.log('\n=== COMPOSURE TRACKING REPORT ===\n');
  
  console.log('Zone Distribution:');
  console.log(`  LOCKED_IN: ${tracking.zoneCounts.LOCKED_IN}`);
  console.log(`  NORMAL: ${tracking.zoneCounts.NORMAL}`);
  console.log(`  PRESSING: ${tracking.zoneCounts.PRESSING}`);
  console.log(`  RED_ZONE: ${tracking.zoneCounts.RED_ZONE}`);
  
  console.log(`\nTotal Zone Transitions: ${tracking.zoneTransitions.length}`);
  console.log(`Total Meltdowns (RED_ZONE entries): ${tracking.meltdownCount}`);
  console.log(`Total Recoveries: ${tracking.recoveryCount}`);
  
  console.log('\nPitcher-by-Pitcher Stats:');
  for (const [name, data] of Object.entries(tracking.pitchersTracked)) {
    console.log(`\n  ${name}:`);
    console.log(`    Start: ${data.startComposure}% | Current: ${data.currentComposure}% | Min: ${data.minComposure}%`);
    console.log(`    Zone History: ${data.zoneHistory.join(' → ')}`);
    console.log(`    Meltdowns: ${data.meltdowns || 0}`);
    console.log(`    Recoveries: ${data.recoveries || 0} (Δ +${data.totalRecoveryDelta || 0})`);
  }
  
  console.log('\n=== END REPORT ===\n');
  return tracking;
}