import { env } from '../config/env.js';

// Runs when no route matched the request.
export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error handler: every thrown error ends up here and is sent as JSON.
// Express 5 forwards errors from async route handlers automatically.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Broken JSON in the request body.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body is not valid JSON.' });
  }

  const status = err.statusCode ?? 500;
  if (status === 500) console.error(err);

  return res.status(status).json({
    message: status === 500 ? 'Something went wrong on the server.' : err.message,
    ...(err.details && { errors: err.details }),
    ...(status === 500 && env.nodeEnv === 'development' && { debug: err.message }),
  });
}
