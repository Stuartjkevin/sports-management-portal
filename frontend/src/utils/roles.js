// Role constants and role-based navigation rules.
// The role comes from the backend inside the JWT. These rules only hide pages
// in the UI; the backend enforces the same permissions with authorize(...).

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CLUB_ADMIN: 'CLUB_ADMIN',
  COACH: 'COACH',
  PLAYER: 'PLAYER',
};

export const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  CLUB_ADMIN: 'Club Admin',
  COACH: 'Coach',
  PLAYER: 'Player',
};

export const ROLE_BADGE_CLASS = {
  SUPER_ADMIN: 'text-bg-danger',
  CLUB_ADMIN: 'text-bg-primary',
  COACH: 'text-bg-success',
  PLAYER: 'text-bg-secondary',
};

const { SUPER_ADMIN, CLUB_ADMIN, COACH, PLAYER } = ROLES;
const STAFF = [SUPER_ADMIN, CLUB_ADMIN, COACH];
const ALL = [SUPER_ADMIN, CLUB_ADMIN, COACH, PLAYER];

// One entry per dashboard page. The sidebar AND the route guards both use this list,
// so a page's permissions are defined in exactly one place.
export const NAV_ITEMS = [
  { path: '/dashboard/overview', label: 'Dashboard', icon: 'bi-speedometer2', roles: STAFF },
  { path: '/dashboard/me', label: 'My Dashboard', icon: 'bi-person-badge', roles: [PLAYER] },
  { path: '/dashboard/clubs', label: 'Clubs', icon: 'bi-building', roles: [SUPER_ADMIN] },
  { path: '/dashboard/teams', label: 'Teams', icon: 'bi-people', roles: STAFF },
  { path: '/dashboard/players', label: 'Players', icon: 'bi-person-lines-fill', roles: STAFF },
  { path: '/dashboard/matches', label: 'Matches', icon: 'bi-calendar-event', roles: ALL },
  { path: '/dashboard/tournaments', label: 'Tournaments', icon: 'bi-trophy', roles: ALL },
  { path: '/dashboard/training', label: 'Training & Attendance', icon: 'bi-clipboard-check', roles: STAFF },
  { path: '/dashboard/analytics', label: 'Performance Analytics', icon: 'bi-graph-up', roles: STAFF },
  { path: '/dashboard/team-selection', label: 'Smart Team Selection', icon: 'bi-stars', roles: STAFF },
  { path: '/dashboard/notifications', label: 'Notifications', icon: 'bi-bell', roles: ALL },
  { path: '/dashboard/profile', label: 'Profile Settings', icon: 'bi-gear', roles: ALL },
];

export function getNavItems(role) {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function getRolesForPath(path) {
  return NAV_ITEMS.find((item) => item.path === path)?.roles ?? [];
}

export function getHomePath(role) {
  return role === PLAYER ? '/dashboard/me' : '/dashboard/overview';
}
