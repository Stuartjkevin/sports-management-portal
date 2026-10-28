// Shared constants. Keep these in sync with the frontend (src/utils/roles.js, src/data/sports.js).
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CLUB_ADMIN: 'CLUB_ADMIN',
  COACH: 'COACH',
  PLAYER: 'PLAYER',
};

const { SUPER_ADMIN, CLUB_ADMIN, COACH, PLAYER } = ROLES;
export const ALL_ROLES = [SUPER_ADMIN, CLUB_ADMIN, COACH, PLAYER];
export const STAFF_ROLES = [SUPER_ADMIN, CLUB_ADMIN, COACH];
export const ADMIN_ROLES = [SUPER_ADMIN, CLUB_ADMIN];
// Roles a user may pick when signing up. Super Admins are created manually.
export const SELF_REGISTER_ROLES = [CLUB_ADMIN, COACH, PLAYER];

export const SPORTS = ['CRICKET', 'FOOTBALL', 'BASKETBALL', 'VOLLEYBALL'];
export const ACTIVE_SPORTS = ['CRICKET', 'FOOTBALL'];

export const POSITIONS = {
  CRICKET: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'],
  FOOTBALL: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
};

export const AGE_GROUPS = ['U-15', 'U-17', 'U-19', 'Senior'];
export const CLUB_STATUSES = ['ACTIVE', 'INACTIVE'];
export const MATCH_STATUSES = ['UPCOMING', 'COMPLETED'];
export const MATCH_RESULTS = ['WON', 'LOST', 'DRAW'];
export const TOURNAMENT_STATUSES = ['UPCOMING', 'ONGOING', 'COMPLETED'];
export const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'EXCUSED'];
