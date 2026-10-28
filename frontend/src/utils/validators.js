// Client-side validation helpers.
// Each validateX function returns an object like { fieldName: 'error message' }.
// An empty object means the form is valid.
// NOTE: the backend must validate again in a later phase - never trust only the browser.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s]{7,15}$/;

export const isEmpty = (value) => value === undefined || value === null || String(value).trim() === '';
export const isEmail = (value) => EMAIL_REGEX.test(String(value).trim());

export function validateLogin(values) {
  const errors = {};
  if (isEmpty(values.email)) errors.email = 'Email is required.';
  else if (!isEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (isEmpty(values.password)) errors.password = 'Password is required.';
  return errors;
}

export function validateRegister(values) {
  const errors = {};
  if (isEmpty(values.fullName)) errors.fullName = 'Full name is required.';
  else if (values.fullName.trim().length < 3) errors.fullName = 'Name must be at least 3 characters.';
  if (isEmpty(values.email)) errors.email = 'Email is required.';
  else if (!isEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (isEmpty(values.password)) errors.password = 'Password is required.';
  else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  else if (!/[0-9]/.test(values.password) || !/[A-Za-z]/.test(values.password)) {
    errors.password = 'Password must contain letters and numbers.';
  }
  if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.';
  if (isEmpty(values.role)) errors.role = 'Select your role.';
  if (!values.agree) errors.agree = 'You must accept the terms.';
  return errors;
}

export function validateClub(values) {
  const errors = {};
  const year = Number(values.founded);
  const currentYear = new Date().getFullYear();
  if (isEmpty(values.name)) errors.name = 'Club name is required.';
  else if (values.name.trim().length < 3) errors.name = 'Club name must be at least 3 characters.';
  if (isEmpty(values.city)) errors.city = 'City is required.';
  if (isEmpty(values.founded)) errors.founded = 'Founded year is required.';
  else if (!Number.isInteger(year) || year < 1850 || year > currentYear) {
    errors.founded = `Enter a year between 1850 and ${currentYear}.`;
  }
  if (isEmpty(values.contactEmail)) errors.contactEmail = 'Contact email is required.';
  else if (!isEmail(values.contactEmail)) errors.contactEmail = 'Enter a valid email address.';
  if (!values.sports || values.sports.length === 0) errors.sports = 'Select at least one sport.';
  return errors;
}

export function validateTeam(values) {
  const errors = {};
  if (isEmpty(values.name)) errors.name = 'Team name is required.';
  if (isEmpty(values.clubId)) errors.clubId = 'Select a club.';
  if (isEmpty(values.sport)) errors.sport = 'Select a sport.';
  if (isEmpty(values.coach)) errors.coach = 'Coach name is required.';
  if (isEmpty(values.ageGroup)) errors.ageGroup = 'Select an age group.';
  return errors;
}

// existingPlayers (optional) lets the browser check jersey numbers early; the server always checks too.
export function validatePlayer(values, existingPlayers = [], editingId = null) {
  const errors = {};
  const jersey = Number(values.jerseyNumber);
  const age = Number(values.age);
  if (isEmpty(values.name)) errors.name = 'Player name is required.';
  if (isEmpty(values.sport)) errors.sport = 'Select a sport.';
  if (isEmpty(values.teamId)) errors.teamId = 'Select a team.';
  if (isEmpty(values.position)) errors.position = 'Select a position.';
  if (isEmpty(values.jerseyNumber)) errors.jerseyNumber = 'Jersey number is required.';
  else if (!Number.isInteger(jersey) || jersey < 1 || jersey > 99) errors.jerseyNumber = 'Jersey number must be 1-99.';
  else if (existingPlayers.some((p) => p.teamId === values.teamId && p.jerseyNumber === jersey && p.id !== editingId)) {
    errors.jerseyNumber = 'This jersey number is already used in this team.';
  }
  if (isEmpty(values.age)) errors.age = 'Age is required.';
  else if (!Number.isInteger(age) || age < 10 || age > 60) errors.age = 'Age must be between 10 and 60.';
  return errors;
}

export function validateProfile(values) {
  const errors = {};
  if (isEmpty(values.name)) errors.name = 'Name is required.';
  if (isEmpty(values.email)) errors.email = 'Email is required.';
  else if (!isEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (!isEmpty(values.phone) && !PHONE_REGEX.test(values.phone)) errors.phone = 'Enter a valid phone number.';
  if (values.bio && values.bio.length > 200) errors.bio = 'Bio must be 200 characters or less.';
  return errors;
}

export function validatePasswordChange(values) {
  const errors = {};
  if (isEmpty(values.currentPassword)) errors.currentPassword = 'Current password is required.';
  if (isEmpty(values.newPassword)) errors.newPassword = 'New password is required.';
  else if (values.newPassword.length < 8) errors.newPassword = 'New password must be at least 8 characters.';
  else if (values.newPassword === values.currentPassword) errors.newPassword = 'New password must be different.';
  if (values.confirmPassword !== values.newPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}

export function validateSelection(values, squadSize) {
  const errors = {};
  const count = Number(values.count);
  if (isEmpty(values.teamId)) errors.teamId = 'Select a team.';
  if (isEmpty(values.count)) errors.count = 'Enter the number of players.';
  else if (!Number.isInteger(count) || count < 1) errors.count = 'Enter a whole number greater than 0.';
  else if (squadSize && count > squadSize) errors.count = `This team only has ${squadSize} players.`;
  return errors;
}
