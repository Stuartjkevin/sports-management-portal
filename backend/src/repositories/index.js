// =====================================================================
// The ONLY place that decides where data is stored.
// Controllers import these repositories and never touch storage directly.
//
// With MONGODB_URI set, data lives in MongoDB Atlas (one collection per
// repository), and each collection is seeded with the demo data below the
// first time it is empty. Without it, the same demo data is kept in memory
// (resets on restart), so the app also runs with no database at all.
// =====================================================================
import { env } from '../config/env.js';
import { createMongoRepository } from '../store/mongoRepository.js';
import { createMemoryRepository } from '../store/memoryRepository.js';
import { clubs } from '../data/clubs.js';
import { teams } from '../data/teams.js';
import { players } from '../data/players.js';
import { matches } from '../data/matches.js';
import { tournaments, standings } from '../data/tournaments.js';
import { trainingSessions, initialAttendance } from '../data/training.js';
import { notifications } from '../data/notifications.js';
import { users } from '../data/users.js';

// Standings and attendance are stored inside their parent document,
// which is also how they will look in MongoDB.
const tournamentSeed = tournaments.map((t) => ({ ...t, standings: standings[t.id] ?? [] }));
const sessionSeed = trainingSessions.map((s) => ({ ...s, attendance: initialAttendance[s.id] ?? {} }));

// Every user gets their own copy of the starter notifications.
const notificationSeed = users.flatMap((u) =>
  notifications.map((n) => ({ ...n, id: `${n.id}-${u.id}`, userId: u.id })),
);

const createRepository = env.useMongo
  ? createMongoRepository
  : (_collectionName, seed) => createMemoryRepository(seed);

export const userRepository = createRepository('users', users);
export const clubRepository = createRepository('clubs', clubs);
export const teamRepository = createRepository('teams', teams);
export const playerRepository = createRepository('players', players);
export const matchRepository = createRepository('matches', matches);
export const tournamentRepository = createRepository('tournaments', tournamentSeed);
export const trainingRepository = createRepository('training_sessions', sessionSeed);
export const notificationRepository = createRepository('notifications', notificationSeed);
