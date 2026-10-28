import { playerRepository, teamRepository } from '../repositories/index.js';
import { recommendLineup, STRATEGIES } from '../services/teamSelection.js';
import { validateSelectionRequest } from '../utils/validators.js';
import AppError, { assertValid } from '../utils/AppError.js';

// POST /api/team-selection
// Body: { "teamId": "t1", "count": 11, "strategy": "BALANCED" | "FORM" | "DISCIPLINE" }
export async function recommend(req, res) {
  const teamId = req.body?.teamId;
  const count = Number(req.body?.count);
  const strategy = req.body?.strategy ?? 'BALANCED';

  const team = teamId ? await teamRepository.findById(teamId) : null;
  const squad = team ? await playerRepository.findAll({ teamId: team.id }) : [];

  const errors = validateSelectionRequest({ teamId, count }, team ? squad.length : null);
  if (!STRATEGIES.includes(strategy)) errors.strategy = `Strategy must be one of: ${STRATEGIES.join(', ')}.`;
  assertValid(errors);
  if (!team) throw new AppError(404, 'Team not found.');

  res.json({ team: { id: team.id, name: team.name, sport: team.sport }, strategy, ...recommendLineup(squad, team.sport, count, strategy) });
}
