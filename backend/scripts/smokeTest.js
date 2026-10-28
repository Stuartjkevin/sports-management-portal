// Quick end-to-end check of the API. Start the app first (npm run dev in the top
// folder), then in a second terminal run:  npm run smoke
// It logs in as each role and calls the main endpoints, printing PASS / FAIL.
const BASE = process.env.API_URL ?? 'http://localhost:5000/api';
let failures = 0;

async function call(method, path, { token, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, data: text ? JSON.parse(text) : null };
}

function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : `  (expected ${expected}, got ${actual})`}`);
}

async function login(email) {
  const { data } = await call('POST', '/auth/login', { body: { email, password: 'Demo@123' } });
  return data.token;
}

try {
  await fetch(`${BASE}/health`);
} catch {
  console.error(`Cannot reach the API at ${BASE}.\nStart the app first in another terminal:  npm run dev\nThen run this again.`);
  process.exit(1);
}

const admin = await login('superadmin@stp.demo');
const coach = await login('coach@stp.demo');
const player = await login('player@stp.demo');

check('health', (await call('GET', '/health')).status, 200);
check('wrong password -> 401', (await call('POST', '/auth/login', { body: { email: 'coach@stp.demo', password: 'nope' } })).status, 401);
check('no token -> 401', (await call('GET', '/teams')).status, 401);
check('me', (await call('GET', '/auth/me', { token: coach })).data.role, 'COACH');

const reg = await call('POST', '/auth/register', { body: { name: 'Test Coach', email: `t${Date.now()}@stp.demo`, password: 'Coach1234', role: 'COACH' } });
check('register', reg.status, 201);
check('register as SUPER_ADMIN blocked', (await call('POST', '/auth/register', { body: { name: 'Hacker', email: 'x@y.com', password: 'abc12345', role: 'SUPER_ADMIN' } })).status, 400);

check('list clubs', (await call('GET', '/clubs', { token: admin })).data.length, 4);
check('player cannot list clubs -> 403', (await call('GET', '/clubs', { token: player })).status, 403);
check('club validation -> 400', (await call('POST', '/clubs', { token: admin, body: { name: 'X' } })).status, 400);
const club = await call('POST', '/clubs', { token: admin, body: { name: 'Salem Spartans', city: 'Salem', founded: '1999', contactEmail: 'hi@salem.demo', sports: ['CRICKET'] } });
check('create club', club.status, 201);
check('update club', (await call('PATCH', `/clubs/${club.data.id}`, { token: admin, body: { city: 'Salem City' } })).data.city, 'Salem City');
check('delete club', (await call('DELETE', `/clubs/${club.data.id}`, { token: admin })).status, 204);
check('delete club with teams -> 409', (await call('DELETE', '/clubs/c1', { token: admin })).status, 409);

check('cricket teams', (await call('GET', '/teams?sport=CRICKET', { token: player })).data.length, 3);
// Data now persists in MongoDB, so remove any test player left behind by an earlier run.
for (const p of (await call('GET', '/teams/t1/players', { token: coach })).data) {
  if (p.name === 'New Guy') await call('DELETE', `/players/${p.id}`, { token: coach });
}
check('roster t1', (await call('GET', '/teams/t1/players', { token: coach })).data.length, 14);
check('coach cannot create team -> 403', (await call('POST', '/teams', { token: coach, body: {} })).status, 403);

check('duplicate jersey -> 400', (await call('POST', '/players', { token: coach, body: { name: 'New Guy', sport: 'CRICKET', teamId: 't1', position: 'Batsman', jerseyNumber: 18, age: 20 } })).status, 400);
const newPlayer = await call('POST', '/players', { token: coach, body: { name: 'New Guy', sport: 'CRICKET', teamId: 't1', position: 'Batsman', jerseyNumber: 50, age: 20 } });
check('create player', newPlayer.status, 201);
check('delete player', (await call('DELETE', `/players/${newPlayer.data.id}`, { token: coach })).status, 204);
check('player /me', (await call('GET', '/players/me', { token: player })).data.id, 'p1');

check('upcoming matches', (await call('GET', '/matches?status=UPCOMING', { token: player })).data.length, 5);
check('standings', (await call('GET', '/tournaments/tr1/standings', { token: player })).data.standings[0].position, 1);

check('attendance get', (await call('GET', '/training/s3/attendance', { token: coach })).data.summary.PRESENT, 11);
check('attendance save', (await call('PUT', '/training/s1/attendance', { token: coach, body: { records: { p1: 'PRESENT', p2: 'ABSENT' } } })).data.summary.ABSENT, 1);
check('attendance bad status -> 400', (await call('PUT', '/training/s1/attendance', { token: coach, body: { records: { p1: 'LATE' } } })).status, 400);

const notes = await call('GET', '/notifications', { token: player });
// The count depends on what was read before (it is stored), so only check its type.
check('notifications unread', typeof notes.data.unreadCount, 'number');
await call('PATCH', '/notifications/read-all', { token: player });
check('read-all', (await call('GET', '/notifications', { token: player })).data.unreadCount, 0);

check('analytics overview', (await call('GET', '/analytics/overview', { token: admin })).status, 200);
check('analytics football', (await call('GET', '/analytics/sport/football', { token: coach })).data.sport, 'FOOTBALL');

const lineup = await call('POST', '/team-selection', { token: coach, body: { teamId: 't2', count: 11, strategy: 'FORM' } });
check('team selection size', lineup.data.lineup.length, 11);
check('team selection has goalkeeper', lineup.data.lineup.some((p) => p.position === 'Goalkeeper'), true);
check('team selection too many -> 400', (await call('POST', '/team-selection', { token: coach, body: { teamId: 't2', count: 40 } })).status, 400);

check('unknown route -> 404', (await call('GET', '/../nope')).status, 404);

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
