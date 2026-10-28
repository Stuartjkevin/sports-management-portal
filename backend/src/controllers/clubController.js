import { clubRepository, teamRepository } from '../repositories/index.js';
import { createCrudController } from './crudController.js';
import { validateClub } from '../utils/validators.js';
import AppError from '../utils/AppError.js';

export const clubController = createCrudController({
  repository: clubRepository,
  name: 'Club',
  fields: ['name', 'city', 'founded', 'contactEmail', 'sports', 'status'],
  numberFields: ['founded'],
  filters: ['status', 'city'],
  defaults: () => ({ status: 'ACTIVE', sports: [] }),
  validate: validateClub,
  beforeRemove: async (id) => {
    const teamCount = await teamRepository.count({ clubId: id });
    if (teamCount > 0) throw new AppError(409, `This club still has ${teamCount} team(s). Delete or move them first.`);
  },
});
