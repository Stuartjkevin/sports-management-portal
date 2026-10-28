// Server-side validation. The frontend validates too, but the server must
// never trust incoming data. Each function returns { field: 'message' } ({} = valid).
import {
  ACTIVE_SPORTS, AGE_GROUPS, CLUB_STATUSES, MATCH_RESULTS, MATCH_STATUSES,
  POSITIONS, SELF_REGISTER_ROLES, SPORTS, TOURNAMENT_STATUSES,
} from './constants.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const isEmpty = (v) => v === undefined || v === null || String(v).trim() === '';
const isString = (v) => typeof v === 'string' && v.trim() !== '';
const isIntBetween = (v, min, max) => Number.isInteger(v) && v >= min && v <= max;
const isValidDate = (v) => typeof v === 'string' && DATE_REGEX.test(v) && !Number.isNaN(Date.parse(v));

export function validateRegister(v) {
  const e = {};
  if (!isString(v.name) || v.name.trim().length < 3) e.name = 'Name must be at least 3 characters.';
  if (!isString(v.email) || !EMAIL_REGEX.test(v.email)) e.email = 'A valid email is required.';
  if (typeof v.password !== 'string' || v.password.length < 8) e.password = 'Password must be at least 8 characters.';
  else if (!/[0-9]/.test(v.password) || !/[A-Za-z]/.test(v.password)) e.password = 'Password must contain letters and numbers.';
  if (!SELF_REGISTER_ROLES.includes(v.role)) e.role = `Role must be one of: ${SELF_REGISTER_ROLES.join(', ')}.`;
  return e;
}

export function validateLogin(v) {
  const e = {};
  if (!isString(v.email)) e.email = 'Email is required.';
  if (!isString(v.password)) e.password = 'Password is required.';
  return e;
}

export function validateProfile(v) {
  const e = {};
  if (!isString(v.name)) e.name = 'Name is required.';
  if (!isString(v.email) || !EMAIL_REGEX.test(v.email)) e.email = 'A valid email is required.';
  if (!isEmpty(v.phone) && !/^[0-9+\-\s]{7,15}$/.test(v.phone)) e.phone = 'Enter a valid phone number.';
  if (v.bio && String(v.bio).length > 200) e.bio = 'Bio must be 200 characters or less.';
  return e;
}

export function validateClub(v) {
  const e = {};
  const year = new Date().getFullYear();
  if (!isString(v.name) || v.name.trim().length < 3) e.name = 'Club name must be at least 3 characters.';
  if (!isString(v.city)) e.city = 'City is required.';
  if (!isIntBetween(v.founded, 1850, year)) e.founded = `Founded must be a year between 1850 and ${year}.`;
  if (!isString(v.contactEmail) || !EMAIL_REGEX.test(v.contactEmail)) e.contactEmail = 'A valid contact email is required.';
  if (!Array.isArray(v.sports) || v.sports.length === 0 || !v.sports.every((s) => SPORTS.includes(s))) {
    e.sports = `Sports must be a non-empty list of: ${SPORTS.join(', ')}.`;
  }
  if (!CLUB_STATUSES.includes(v.status)) e.status = `Status must be one of: ${CLUB_STATUSES.join(', ')}.`;
  return e;
}

// ctx.clubExists is passed in by the controller (needs a database lookup).
export function validateTeam(v, ctx) {
  const e = {};
  if (!isString(v.name)) e.name = 'Team name is required.';
  if (!isString(v.clubId) || !ctx.clubExists) e.clubId = 'clubId must be an existing club.';
  if (!ACTIVE_SPORTS.includes(v.sport)) e.sport = `Sport must be one of: ${ACTIVE_SPORTS.join(', ')}.`;
  if (!isString(v.coach)) e.coach = 'Coach name is required.';
  if (!AGE_GROUPS.includes(v.ageGroup)) e.ageGroup = `Age group must be one of: ${AGE_GROUPS.join(', ')}.`;
  ['wins', 'draws', 'losses'].forEach((k) => {
    if (!isIntBetween(v[k], 0, 10000)) e[k] = `${k} must be a whole number of 0 or more.`;
  });
  return e;
}

// ctx.team = the player's team (or null), ctx.jerseyTaken = true if another player in that team has the number.
export function validatePlayer(v, ctx) {
  const e = {};
  if (!isString(v.name)) e.name = 'Player name is required.';
  if (!ACTIVE_SPORTS.includes(v.sport)) e.sport = `Sport must be one of: ${ACTIVE_SPORTS.join(', ')}.`;
  if (!ctx.team) e.teamId = 'teamId must be an existing team.';
  else if (ctx.team.sport !== v.sport) e.teamId = 'Team sport does not match the player sport.';
  if (!(POSITIONS[v.sport] ?? []).includes(v.position)) e.position = `Position must be one of: ${(POSITIONS[v.sport] ?? []).join(', ') || 'choose a sport first'}.`;
  if (!isIntBetween(v.jerseyNumber, 1, 99)) e.jerseyNumber = 'Jersey number must be 1-99.';
  else if (ctx.jerseyTaken) e.jerseyNumber = 'This jersey number is already used in this team.';
  if (!isIntBetween(v.age, 10, 60)) e.age = 'Age must be between 10 and 60.';
  ['rating', 'form', 'attendanceRate'].forEach((k) => {
    if (!isIntBetween(v[k], 0, 100)) e[k] = `${k} must be 0-100.`;
  });
  return e;
}

export function validateMatch(v, ctx) {
  const e = {};
  if (!ACTIVE_SPORTS.includes(v.sport)) e.sport = `Sport must be one of: ${ACTIVE_SPORTS.join(', ')}.`;
  if (!ctx.team) e.teamId = 'teamId must be an existing team.';
  else if (ctx.team.sport !== v.sport) e.teamId = 'Team sport does not match the match sport.';
  if (!isString(v.opponent)) e.opponent = 'Opponent is required.';
  if (!isValidDate(v.date)) e.date = 'Date must be YYYY-MM-DD.';
  if (!TIME_REGEX.test(v.time ?? '')) e.time = 'Time must be HH:MM (24-hour).';
  if (!isString(v.venue)) e.venue = 'Venue is required.';
  if (!isString(v.competition)) e.competition = 'Competition is required.';
  if (!MATCH_STATUSES.includes(v.status)) e.status = `Status must be one of: ${MATCH_STATUSES.join(', ')}.`;
  if (v.status === 'COMPLETED') {
    if (!isString(v.score)) e.score = 'Score is required for completed matches.';
    if (!MATCH_RESULTS.includes(v.result)) e.result = `Result must be one of: ${MATCH_RESULTS.join(', ')}.`;
  }
  return e;
}

export function validateTournament(v) {
  const e = {};
  if (!isString(v.name)) e.name = 'Tournament name is required.';
  if (!ACTIVE_SPORTS.includes(v.sport)) e.sport = `Sport must be one of: ${ACTIVE_SPORTS.join(', ')}.`;
  if (!isValidDate(v.startDate)) e.startDate = 'Start date must be YYYY-MM-DD.';
  if (!isValidDate(v.endDate)) e.endDate = 'End date must be YYYY-MM-DD.';
  else if (isValidDate(v.startDate) && v.endDate < v.startDate) e.endDate = 'End date must be after the start date.';
  if (!isIntBetween(v.teamsCount, 2, 64)) e.teamsCount = 'Teams count must be 2-64.';
  if (!TOURNAMENT_STATUSES.includes(v.status)) e.status = `Status must be one of: ${TOURNAMENT_STATUSES.join(', ')}.`;
  if (!Array.isArray(v.standings)) e.standings = 'Standings must be a list.';
  return e;
}

export function validateTrainingSession(v, ctx) {
  const e = {};
  if (!ctx.team) e.teamId = 'teamId must be an existing team.';
  if (!isString(v.title)) e.title = 'Title is required.';
  if (!isValidDate(v.date)) e.date = 'Date must be YYYY-MM-DD.';
  if (!TIME_REGEX.test(v.time ?? '')) e.time = 'Time must be HH:MM (24-hour).';
  if (!isIntBetween(v.duration, 15, 480)) e.duration = 'Duration must be 15-480 minutes.';
  if (!isString(v.location)) e.location = 'Location is required.';
  if (!isString(v.focus)) e.focus = 'Focus is required.';
  return e;
}

export function validateSelectionRequest(v, squadSize) {
  const e = {};
  if (!isString(v.teamId)) e.teamId = 'teamId is required.';
  if (!Number.isInteger(v.count) || v.count < 1) e.count = 'count must be a whole number greater than 0.';
  else if (squadSize !== null && v.count > squadSize) e.count = `This team only has ${squadSize} players.`;
  return e;
}
