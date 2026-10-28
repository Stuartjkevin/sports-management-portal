import { playerRepository, teamRepository, userRepository } from '../repositories/index.js';
import { createCrudController } from './crudController.js';
import { validatePlayer } from '../utils/validators.js';
import AppError from '../utils/AppError.js';
import { playerFormHistory } from '../data/analytics.js';

const emptyStats = (sport) => (sport === 'CRICKET' ? { matches: 0, runs: 0, wickets: 0 } : { matches: 0, goals: 0, assists: 0 });

export const playerController = createCrudController({
  repository: playerRepository,
  name: 'Player',
  fields: ['name', 'sport', 'teamId', 'position', 'jerseyNumber', 'age', 'rating', 'form', 'attendanceRate', 'stats'],
  numberFields: ['jerseyNumber', 'age', 'rating', 'form', 'attendanceRate'],
  filters: ['sport', 'teamId', 'position'],
  // New players start with neutral scores until real stats are recorded.
  defaults: (input) => ({ rating: 60, form: 60, attendanceRate: 100, stats: emptyStats(input.sport) }),
  validate: validatePlayer,
  buildContext: async (data, id) => {
    const team = data.teamId ? await teamRepository.findById(data.teamId) : null;
    const sameNumber = team ? await playerRepository.findAll({ teamId: team.id, jerseyNumber: data.jerseyNumber }) : [];
    return { team, jerseyTaken: sameNumber.some((p) => p.id !== id) };
  },
});

// GET /api/players/me  - the logged-in PLAYER's own profile
export async function getMyPlayerProfile(req, res) {
  const user = await userRepository.findById(req.user.id);
  if (!user?.playerId) throw new AppError(404, 'No player profile is linked to this account yet.');
  const player = await playerRepository.findById(user.playerId);
  if (!player) throw new AppError(404, 'Player profile not found.');
  // formHistory is still sample data until per-match stats are recorded.
  res.json({ ...player, formHistory: playerFormHistory });
}
