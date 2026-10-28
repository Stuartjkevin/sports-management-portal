// JWT authentication and role-based authorisation.
//   authenticate      -> requires "Authorization: Bearer <token>", sets req.user
//   authorize(roles)  -> allows only the listed roles (use AFTER authenticate)
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import AppError from '../utils/AppError.js';

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, name: user.name }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function authenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) return next(new AppError(401, 'Please log in to continue.'));

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, role: payload.role, name: payload.name };
    return next();
  } catch {
    return next(new AppError(401, 'Your session is invalid or has expired. Please log in again.'));
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) return next(new AppError(403, 'You do not have permission to do this.'));
    return next();
  };
}
