// =====================================================================
// IN-MEMORY REPOSITORY (used when MONGODB_URI is not set)
// ---------------------------------------------------------------------
// Each repository stores one "collection" in a plain array.
// Data resets every time the server restarts.
//
// Same async methods as mongoRepository.js, so controllers work with
// either one - only src/repositories/index.js decides which is used.
// =====================================================================
import { randomUUID } from 'node:crypto';

const clone = (value) => structuredClone(value);

// filter example: { sport: 'CRICKET', teamId: 't1' }. Undefined values are ignored.
const matches = (item, filter) =>
  Object.entries(filter).every(([key, value]) => value === undefined || item[key] === value);

export function createMemoryRepository(seed = []) {
  const items = clone(seed);

  async function findAll(filter = {}) {
    return clone(items.filter((item) => matches(item, filter)));
  }

  async function findById(id) {
    const item = items.find((i) => i.id === id);
    return item ? clone(item) : null;
  }

  async function findOne(filter) {
    const item = items.find((i) => matches(i, filter));
    return item ? clone(item) : null;
  }

  async function create(data) {
    const now = new Date().toISOString();
    const item = { ...clone(data), id: randomUUID(), createdAt: now, updatedAt: now };
    items.unshift(item);
    return clone(item);
  }

  async function update(id, changes) {
    const item = items.find((i) => i.id === id);
    if (!item) return null;
    Object.assign(item, clone(changes), { id, updatedAt: new Date().toISOString() });
    return clone(item);
  }

  async function updateMany(filter, changes) {
    const targets = items.filter((i) => matches(i, filter));
    targets.forEach((i) => Object.assign(i, clone(changes), { updatedAt: new Date().toISOString() }));
    return targets.length;
  }

  async function remove(id) {
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    return true;
  }

  async function count(filter = {}) {
    return items.filter((item) => matches(item, filter)).length;
  }

  return { findAll, findById, findOne, create, update, updateMany, remove, count };
}
