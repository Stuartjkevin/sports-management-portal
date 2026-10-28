// Smart Team Selection: scores players with simple weights and picks a lineup.
// Same logic as the frontend demo, now running on the server.
// Later improvement: use real per-match statistics instead of rating/form scores.

const STRATEGY_WEIGHTS = {
  BALANCED: { rating: 0.4, form: 0.4, attendance: 0.2 },
  FORM: { rating: 0.25, form: 0.6, attendance: 0.15 },
  DISCIPLINE: { rating: 0.3, form: 0.3, attendance: 0.4 },
};

export const STRATEGIES = Object.keys(STRATEGY_WEIGHTS);

// Positions every lineup must include at least once.
const REQUIRED_POSITIONS = {
  CRICKET: ['Wicket-keeper'],
  FOOTBALL: ['Goalkeeper'],
};

function explain(player) {
  const reasons = [];
  if (player.form >= 80) reasons.push(`excellent recent form (${player.form})`);
  else if (player.form >= 65) reasons.push(`steady form (${player.form})`);
  if (player.rating >= 80) reasons.push(`high skill rating (${player.rating})`);
  if (player.attendanceRate >= 90) reasons.push(`${player.attendanceRate}% training attendance`);
  if (reasons.length === 0) reasons.push('best available option for squad balance');
  return `Selected for ${reasons.join(', ')}.`;
}

export function recommendLineup(players, sport, count, strategy = 'BALANCED') {
  const w = STRATEGY_WEIGHTS[strategy];
  const scored = players
    .map((p) => ({ ...p, score: Math.round(p.rating * w.rating + p.form * w.form + p.attendanceRate * w.attendance) }))
    .sort((a, b) => b.score - a.score);

  const lineup = [];
  (REQUIRED_POSITIONS[sport] ?? []).forEach((position) => {
    const best = scored.find((p) => p.position === position);
    if (best && lineup.length < count) {
      lineup.push({ ...best, explanation: `${explain(best)} Required ${position.toLowerCase()} for the lineup.` });
    }
  });
  scored.forEach((p) => {
    if (lineup.length < count && !lineup.some((s) => s.id === p.id)) lineup.push({ ...p, explanation: explain(p) });
  });

  const bench = scored.filter((p) => !lineup.some((s) => s.id === p.id));
  const averageScore = lineup.length ? Math.round(lineup.reduce((sum, p) => sum + p.score, 0) / lineup.length) : 0;
  return { lineup: lineup.sort((a, b) => b.score - a.score), bench, averageScore };
}
