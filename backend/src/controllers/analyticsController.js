// Analytics endpoints. Counts come from live data; the monthly trend series
// are still sample data (src/data/analytics.js) until real match history exists.
import { clubRepository, matchRepository, playerRepository, teamRepository } from '../repositories/index.js';
import { MONTHS, monthlyMatches, resultsDistribution, teamFormTrend } from '../data/analytics.js';
import { ACTIVE_SPORTS } from '../utils/constants.js';
import AppError from '../utils/AppError.js';

const average = (list, key) => (list.length ? Math.round(list.reduce((sum, item) => sum + item[key], 0) / list.length) : 0);

// GET /api/analytics/overview  - numbers for the admin dashboard
export async function getOverview(req, res) {
  const [clubs, teams, players, upcoming] = await Promise.all([
    clubRepository.findAll(),
    teamRepository.count(),
    playerRepository.findAll(),
    matchRepository.count({ status: 'UPCOMING' }),
  ]);

  res.json({
    clubs: clubs.length,
    activeClubs: clubs.filter((c) => c.status === 'ACTIVE').length,
    teams,
    players: players.length,
    upcomingMatches: upcoming,
    playersBySport: Object.fromEntries(ACTIVE_SPORTS.map((s) => [s, players.filter((p) => p.sport === s).length])),
    monthlyMatches,
  });
}

// GET /api/analytics/sport/:sport  - data for the Performance Analytics page
export async function getSportAnalytics(req, res) {
  const sport = String(req.params.sport).toUpperCase();
  if (!ACTIVE_SPORTS.includes(sport)) throw new AppError(400, `Sport must be one of: ${ACTIVE_SPORTS.join(', ')}.`);

  const players = await playerRepository.findAll({ sport });
  const statKey = sport === 'CRICKET' ? 'runs' : 'goals';
  const topPerformers = [...players]
    .sort((a, b) => (b.stats?.[statKey] ?? 0) - (a.stats?.[statKey] ?? 0))
    .slice(0, 6)
    .map((p) => ({ id: p.id, name: p.name, value: p.stats?.[statKey] ?? 0 }));

  const results = resultsDistribution[sport];
  const totalMatches = results.WON + results.LOST + results.DRAW;

  res.json({
    sport,
    totalMatches,
    winRate: totalMatches ? Math.round((results.WON / totalMatches) * 100) : 0,
    averageForm: average(players, 'form'),
    averageAttendance: average(players, 'attendanceRate'),
    resultsDistribution: results,
    topPerformers: { stat: statKey, players: topPerformers },
    teamFormTrend: { labels: MONTHS, teams: teamFormTrend[sport] },
  });
}
