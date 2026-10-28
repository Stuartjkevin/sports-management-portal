// Demo accounts (one per role). All use the password: Demo@123
// Passwords are stored ONLY as bcrypt hashes, never as plain text.
import bcrypt from 'bcryptjs';

export const DEMO_PASSWORD = 'Demo@123';
const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

export const users = [
  { id: 'u1', name: 'Arjun Mehta', email: 'superadmin@stp.demo', role: 'SUPER_ADMIN', playerId: null, phone: '', bio: '', passwordHash },
  { id: 'u2', name: 'Priya Raman', email: 'clubadmin@stp.demo', role: 'CLUB_ADMIN', playerId: null, phone: '', bio: '', passwordHash },
  { id: 'u3', name: 'Daniel Joseph', email: 'coach@stp.demo', role: 'COACH', playerId: null, phone: '', bio: '', passwordHash },
  { id: 'u4', name: 'Rohit Kumar', email: 'player@stp.demo', role: 'PLAYER', playerId: 'p1', phone: '', bio: '', passwordHash },
];
