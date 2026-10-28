// An error with an HTTP status code. Throw it anywhere; errorHandler turns it into JSON.
// Example: throw new AppError(404, 'Team not found');
export default class AppError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details; // e.g. validation errors { name: 'Name is required.' }
  }
}

// Throws a 400 error if the validator returned any errors.
export function assertValid(errors) {
  if (Object.keys(errors).length > 0) throw new AppError(400, 'Validation failed', errors);
}
