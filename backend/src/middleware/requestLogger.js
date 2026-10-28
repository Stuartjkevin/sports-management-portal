// Prints one line per request, e.g.  GET /api/teams 200 - 3 ms
export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start} ms`);
  });
  next();
}
