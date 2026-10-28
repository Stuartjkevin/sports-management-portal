// Turns a list like [{ id: 't1', name: 'Karunya Kings' }] into { t1: 'Karunya Kings' }
// so pages can show names for ids returned by the API.
export function buildNameMap(list = []) {
  return Object.fromEntries((list ?? []).map((item) => [item.id, item.name]));
}
