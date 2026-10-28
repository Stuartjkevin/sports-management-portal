// =====================================================================
// MONGODB REPOSITORY (MongoDB Atlas via the official driver)
// ---------------------------------------------------------------------
// Same methods as memoryRepository.js, so controllers did not change.
// Documents keep our own string `id` (seed ids like 'p1' or a UUID);
// MongoDB's internal _id is never sent to the client.
//
// An empty collection is filled with the demo seed data on first use.
// `_order` keeps the old list order: newest created first, then seed order.
// =====================================================================
import { randomUUID } from 'node:crypto';
import { getDb } from '../config/db.js';

const HIDDEN = { projection: { _id: 0, _order: 0 } };

// Undefined values are ignored, same as the memory repository.
const toQuery = (filter = {}) =>
  Object.fromEntries(Object.entries(filter).filter(([, value]) => value !== undefined));

export function createMongoRepository(name, seed = []) {
  let ready;

  // Runs once per server start: seeds an empty collection and adds an index on id.
  function collection() {
    if (!ready) {
      ready = (async () => {
        const col = (await getDb()).collection(name);
        if ((await col.estimatedDocumentCount()) === 0 && seed.length > 0) {
          await col.insertMany(seed.map((item, i) => ({ ...structuredClone(item), _order: i })));
        }
        await col.createIndex({ id: 1 }, { unique: true });
        return col;
      })().catch((error) => {
        ready = undefined;
        throw error;
      });
    }
    return ready;
  }

  async function findAll(filter = {}) {
    return (await collection()).find(toQuery(filter), HIDDEN).sort({ _order: 1 }).toArray();
  }

  async function findById(id) {
    return (await collection()).findOne({ id }, HIDDEN);
  }

  async function findOne(filter) {
    return (await collection()).findOne(toQuery(filter), HIDDEN);
  }

  async function create(data) {
    const now = new Date().toISOString();
    const item = { ...structuredClone(data), id: randomUUID(), createdAt: now, updatedAt: now };
    await (await collection()).insertOne({ ...item, _order: -Date.now() });
    return item;
  }

  async function update(id, changes) {
    const { id: _ignored, _id, ...rest } = changes;
    return (await collection()).findOneAndUpdate(
      { id },
      { $set: { ...rest, updatedAt: new Date().toISOString() } },
      { ...HIDDEN, returnDocument: 'after' },
    );
  }

  async function updateMany(filter, changes) {
    const result = await (await collection()).updateMany(
      toQuery(filter),
      { $set: { ...changes, updatedAt: new Date().toISOString() } },
    );
    return result.matchedCount;
  }

  async function remove(id) {
    const result = await (await collection()).deleteOne({ id });
    return result.deletedCount === 1;
  }

  async function count(filter = {}) {
    return (await collection()).countDocuments(toQuery(filter));
  }

  return { findAll, findById, findOne, create, update, updateMany, remove, count };
}
