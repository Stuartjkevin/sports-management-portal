import { tournamentRepository } from '../repositories/index.js';
import { createCrudController } from './crudController.js';
import { validateTournament } from '../utils/validators.js';
import AppError from '../utils/AppError.js';

export const tournamentController = createCrudController({
  repository: tournamentRepository,
  name: 'Tournament',
  fields: ['name', 'sport', 'startDate', 'endDate', 'teamsCount', 'status', 'standings'],
  numberFields: ['teamsCount'],
  filters: ['sport', 'status'],
  defaults: () => ({ status: 'UPCOMING', standings: [] }),
  validate: validateTournament,
});

// GET /api/tournaments/:id/standings  - sorted by points, then wins
export async function getStandings(req, res) {
  const tournament = await tournamentRepository.findById(req.params.id);
  if (!tournament) throw new AppError(404, 'Tournament not found.');
  const table = [...tournament.standings]
    .sort((a, b) => b.points - a.points || b.won - a.won)
    .map((row, index) => ({ position: index + 1, ...row }));
  res.json({ tournamentId: tournament.id, name: tournament.name, standings: table });
}
