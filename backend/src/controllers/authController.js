import bcrypt from 'bcryptjs';
import { userRepository, notificationRepository } from '../repositories/index.js';
import { signToken } from '../middleware/auth.js';
import AppError, { assertValid } from '../utils/AppError.js';
import { validateLogin, validateProfile, validateRegister } from '../utils/validators.js';

// Never send passwordHash to the client.
export function toPublicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase();

// POST /api/auth/register
export async function register(req, res) {
  const { name, email, password, role } = req.body ?? {};
  assertValid(validateRegister({ name, email, password, role }));

  if (await userRepository.findOne({ email: normalizeEmail(email) })) {
    throw new AppError(409, 'An account with this email already exists.', { email: 'Email is already registered.' });
  }

  const user = await userRepository.create({
    name: name.trim(),
    email: normalizeEmail(email),
    role,
    playerId: null,
    phone: '',
    bio: '',
    passwordHash: await bcrypt.hash(password, 10),
  });

  await notificationRepository.create({
    userId: user.id, type: 'SYSTEM', title: 'Welcome to the portal', message: 'Complete your profile to get personalised updates.', time: 'Just now', read: false,
  });

  res.status(201).json({ token: signToken(user), user: toPublicUser(user) });
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body ?? {};
  assertValid(validateLogin({ email, password }));

  const user = await userRepository.findOne({ email: normalizeEmail(email) });
  // Same message for "no user" and "wrong password" so attackers cannot guess emails.
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError(401, 'Incorrect email or password.');
  }

  res.json({ token: signToken(user), user: toPublicUser(user) });
}

// GET /api/auth/me
export async function getMe(req, res) {
  const user = await userRepository.findById(req.user.id);
  if (!user) throw new AppError(404, 'User not found.');
  res.json(toPublicUser(user));
}

// PUT /api/auth/me
export async function updateMe(req, res) {
  const user = await userRepository.findById(req.user.id);
  if (!user) throw new AppError(404, 'User not found.');

  const changes = {
    name: String(req.body?.name ?? user.name).trim(),
    email: normalizeEmail(req.body?.email ?? user.email),
    phone: String(req.body?.phone ?? user.phone).trim(),
    bio: String(req.body?.bio ?? user.bio).trim(),
  };
  assertValid(validateProfile(changes));

  const sameEmailUser = await userRepository.findOne({ email: changes.email });
  if (sameEmailUser && sameEmailUser.id !== user.id) {
    throw new AppError(409, 'Email is already used by another account.', { email: 'Email is already registered.' });
  }

  res.json(toPublicUser(await userRepository.update(user.id, changes)));
}

// PUT /api/auth/me/password
export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body ?? {};
  const errors = {};
  if (typeof currentPassword !== 'string' || !currentPassword) errors.currentPassword = 'Current password is required.';
  if (typeof newPassword !== 'string' || newPassword.length < 8) errors.newPassword = 'New password must be at least 8 characters.';
  else if (newPassword === currentPassword) errors.newPassword = 'New password must be different.';
  assertValid(errors);

  const user = await userRepository.findById(req.user.id);
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    throw new AppError(400, 'Validation failed', { currentPassword: 'Current password is incorrect.' });
  }

  await userRepository.update(user.id, { passwordHash: await bcrypt.hash(newPassword, 10) });
  res.json({ message: 'Password updated.' });
}
