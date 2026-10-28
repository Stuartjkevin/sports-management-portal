import { matchRepository, teamRepository } from '../repositories/index.js';
import { createCrudController } from './crudController.js';
import { validateMatch } from '../utils/validators.js';

const crud = createCrudController({
  repository: matchRepository,
  name: 'Match',
  fields: ['sport', 'teamId', 'opponent', 'date', 'time', 'venue', 'competition', 'status', 'score', 'result'],
  filters: ['sport', 'teamId', 'status'],
  defaults: () => ({ status: 'UPCOMING' }),
  validate: validateMatch,
  buildContext: async (data) => ({ team: data.teamId ? await teamRepository.findById(data.teamId) : null }),
});

export const matchController = {
  ...crud,
  // Upcoming matches come back soonest first; completed matches newest first.
  async list(req, res) {
    const list = await matchRepository.findAll({
      sport: req.query.sport || undefined,
      teamId: req.query.teamId || undefined,
      status: req.query.status || undefined,
    });
    list.sort((a, b) => (a.status === 'UPCOMING' && b.status === 'UPCOMING' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
    res.json(list);
  },
};
