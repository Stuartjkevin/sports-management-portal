import { clubRepository, playerRepository, teamRepository } from '../repositories/index.js';
import { createCrudController } from './crudController.js';
import { validateTeam } from '../utils/validators.js';
import AppError from '../utils/AppError.js';

export const teamController = createCrudController({
  repository: teamRepository,
  name: 'Team',
  fields: ['name', 'clubId', 'sport', 'coach', 'ageGroup', 'wins', 'draws', 'losses'],
  numberFields: ['wins', 'draws', 'losses'],
  filters: ['sport', 'clubId', 'ageGroup'],
  defaults: () => ({ wins: 0, draws: 0, losses: 0 }),
  validate: validateTeam,
  buildContext: async (data) => ({ clubExists: Boolean(data.clubId && (await clubRepository.findById(data.clubId))) }),
  beforeRemove: async (id) => {
    const playerCount = await playerRepository.count({ teamId: id });
    if (playerCount > 0) throw new AppError(409, `This team still has ${playerCount} player(s). Remove or move them first.`);
  },
});

// GET /api/teams/:id/players  - the roster, sorted by jersey number
export async function getTeamRoster(req, res) {
  const team = await teamRepository.findById(req.params.id);
  if (!team) throw new AppError(404, 'Team not found.');
  const roster = await playerRepository.findAll({ teamId: team.id });
  res.json(roster.sort((a, b) => a.jerseyNumber - b.jerseyNumber));
}
