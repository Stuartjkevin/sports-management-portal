// Builds the 5 standard handlers (list, getById, create, update, remove) for a resource,
// so each resource only describes what is different about it.
//
// Options:
//   repository     - where the data is stored
//   name           - used in messages, e.g. 'Club'
//   fields         - fields a client is allowed to send
//   numberFields   - fields converted to numbers
//   filters        - query params allowed for filtering, e.g. ?sport=CRICKET
//   defaults(data) - default values for new records
//   validate(data, ctx)        - returns an errors object
//   buildContext(data, id)     - async lookups the validator needs (e.g. "does this team exist?")
//   beforeRemove(id)           - throw an AppError to block a delete
import AppError, { assertValid } from '../utils/AppError.js';
import { pickFields } from '../utils/pick.js';

export function createCrudController({
  repository, name, fields, numberFields = [], filters = [],
  defaults = () => ({}), validate, buildContext = async () => ({}), beforeRemove,
}) {
  async function findOr404(id) {
    const item = await repository.findById(id);
    if (!item) throw new AppError(404, `${name} not found.`);
    return item;
  }

  return {
    async list(req, res) {
      const filter = Object.fromEntries(filters.map((f) => [f, req.query[f] || undefined]));
      res.json(await repository.findAll(filter));
    },

    async getById(req, res) {
      res.json(await findOr404(req.params.id));
    },

    async create(req, res) {
      const input = pickFields(req.body, fields, numberFields);
      const data = { ...defaults(input), ...input };
      assertValid(validate(data, await buildContext(data, null)));
      res.status(201).json(await repository.create(data));
    },

    // PUT/PATCH: send only the fields you want to change; the rest are kept.
    async update(req, res) {
      const existing = await findOr404(req.params.id);
      const data = { ...existing, ...pickFields(req.body, fields, numberFields) };
      assertValid(validate(data, await buildContext(data, existing.id)));
      res.json(await repository.update(existing.id, pickFields(data, fields)));
    },

    async remove(req, res) {
      const existing = await findOr404(req.params.id);
      if (beforeRemove) await beforeRemove(existing.id);
      await repository.remove(existing.id);
      res.status(204).end();
    },
  };
}
