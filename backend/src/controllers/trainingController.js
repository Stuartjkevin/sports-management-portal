import { playerRepository, teamRepository, trainingRepository, userRepository } from '../repositories/index.js';
import { createCrudController } from './crudController.js';
import { validateTrainingSession } from '../utils/validators.js';
import { ATTENDANCE_STATUSES } from '../utils/constants.js';
import AppError, { assertValid } from '../utils/AppError.js';

export const trainingController = createCrudController({
  repository: trainingRepository,
  name: 'Training session',
  fields: ['teamId', 'title', 'date', 'time', 'duration', 'location', 'focus'],
  numberFields: ['duration'],
  filters: ['teamId', 'focus'],
  defaults: () => ({ attendance: {} }),
  validate: validateTrainingSession,
  buildContext: async (data) => ({ team: data.teamId ? await teamRepository.findById(data.teamId) : null }),
});

// New sessions start with empty attendance (from defaults). Clients set it with PUT /:id/attendance.

async function findSessionOr404(id) {
  const session = await trainingRepository.findById(id);
  if (!session) throw new AppError(404, 'Training session not found.');
  return session;
}

async function buildAttendanceResponse(session) {
  const squad = (await playerRepository.findAll({ teamId: session.teamId })).sort((a, b) => a.jerseyNumber - b.jerseyNumber);
  const attendance = session.attendance ?? {};
  const records = squad.map((p) => ({
    playerId: p.id, name: p.name, jerseyNumber: p.jerseyNumber, position: p.position, status: attendance[p.id] ?? null,
  }));
  const summary = Object.fromEntries(ATTENDANCE_STATUSES.map((s) => [s, records.filter((r) => r.status === s).length]));
  summary.UNMARKED = records.filter((r) => r.status === null).length;
  return { sessionId: session.id, title: session.title, records, summary };
}

// GET /api/training/me/attendance  - the logged-in PLAYER's attendance history
export async function getMyAttendance(req, res) {
  const user = await userRepository.findById(req.user.id);
  const player = user?.playerId ? await playerRepository.findById(user.playerId) : null;
  if (!player) throw new AppError(404, 'No player profile is linked to this account yet.');

  const sessions = await trainingRepository.findAll({ teamId: player.teamId });
  const history = sessions
    .filter((s) => s.attendance?.[player.id])
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((s) => ({ sessionId: s.id, date: s.date, session: s.title, status: s.attendance[player.id] }));
  res.json({ attendanceRate: player.attendanceRate, history });
}

// GET /api/training/:id/attendance
export async function getAttendance(req, res) {
  res.json(await buildAttendanceResponse(await findSessionOr404(req.params.id)));
}

// PUT /api/training/:id/attendance
// Body: { "records": { "<playerId>": "PRESENT" | "ABSENT" | "EXCUSED" } }
export async function saveAttendance(req, res) {
  const session = await findSessionOr404(req.params.id);
  const records = req.body?.records;
  if (!records || typeof records !== 'object' || Array.isArray(records)) {
    throw new AppError(400, 'Validation failed', { records: 'records must be an object of { playerId: status }.' });
  }

  const squadIds = new Set((await playerRepository.findAll({ teamId: session.teamId })).map((p) => p.id));
  const errors = {};
  Object.entries(records).forEach(([playerId, status]) => {
    if (!squadIds.has(playerId)) errors[playerId] = 'Player is not in this session\'s team.';
    else if (!ATTENDANCE_STATUSES.includes(status)) errors[playerId] = `Status must be one of: ${ATTENDANCE_STATUSES.join(', ')}.`;
  });
  assertValid(errors);

  const updated = await trainingRepository.update(session.id, { attendance: { ...session.attendance, ...records } });
  res.json(await buildAttendanceResponse(updated));
}
