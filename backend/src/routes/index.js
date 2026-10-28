// All API routes, mounted under /api in app.js.
// Role rules match the frontend sidebar (frontend/src/utils/roles.js).
import { Router } from 'express';
import authRoutes from './authRoutes.js';
import { addCrudRoutes } from './crudRoutes.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ADMIN_ROLES, ALL_ROLES, ROLES, STAFF_ROLES } from '../utils/constants.js';

import { clubController } from '../controllers/clubController.js';
import { teamController, getTeamRoster } from '../controllers/teamController.js';
import { playerController, getMyPlayerProfile } from '../controllers/playerController.js';
import { matchController } from '../controllers/matchController.js';
import { tournamentController, getStandings } from '../controllers/tournamentController.js';
import { trainingController, getAttendance, getMyAttendance, saveAttendance } from '../controllers/trainingController.js';
import { listNotifications, markAsRead, markAllAsRead, deleteNotification } from '../controllers/notificationController.js';
import { getOverview, getSportAnalytics } from '../controllers/analyticsController.js';
import { recommend } from '../controllers/selectionController.js';

const api = Router();

// ---------- Public ----------
api.get('/health', (req, res) => res.json({ status: 'ok', storage: 'mongodb', time: new Date().toISOString() }));
api.use('/auth', authRoutes);

// ---------- Everything below needs a valid JWT ----------
api.use(authenticate);

const clubs = Router();
addCrudRoutes(clubs, clubController, { readRoles: STAFF_ROLES, writeRoles: [ROLES.SUPER_ADMIN] });
api.use('/clubs', clubs);

const teams = Router();
teams.get('/:id/players', authorize(...ALL_ROLES), getTeamRoster);
addCrudRoutes(teams, teamController, { readRoles: ALL_ROLES, writeRoles: ADMIN_ROLES });
api.use('/teams', teams);

const players = Router();
players.get('/me', authorize(ROLES.PLAYER), getMyPlayerProfile); // must come before /:id
addCrudRoutes(players, playerController, { readRoles: STAFF_ROLES, writeRoles: STAFF_ROLES });
api.use('/players', players);

const matches = Router();
addCrudRoutes(matches, matchController, { readRoles: ALL_ROLES, writeRoles: STAFF_ROLES });
api.use('/matches', matches);

const tournaments = Router();
tournaments.get('/:id/standings', authorize(...ALL_ROLES), getStandings);
addCrudRoutes(tournaments, tournamentController, { readRoles: ALL_ROLES, writeRoles: ADMIN_ROLES });
api.use('/tournaments', tournaments);

const training = Router();
training.get('/me/attendance', authorize(ROLES.PLAYER), getMyAttendance); // must come before /:id
training.get('/:id/attendance', authorize(...STAFF_ROLES), getAttendance);
training.put('/:id/attendance', authorize(...STAFF_ROLES), saveAttendance);
addCrudRoutes(training, trainingController, { readRoles: STAFF_ROLES, writeRoles: STAFF_ROLES });
api.use('/training', training);

const notifications = Router();
notifications.get('/', listNotifications);
notifications.patch('/read-all', markAllAsRead); // must come before /:id
notifications.patch('/:id/read', markAsRead);
notifications.delete('/:id', deleteNotification);
api.use('/notifications', notifications);

api.get('/analytics/overview', authorize(...STAFF_ROLES), getOverview);
api.get('/analytics/sport/:sport', authorize(...STAFF_ROLES), getSportAnalytics);

api.post('/team-selection', authorize(...STAFF_ROLES), recommend);

export default api;
