// Reads settings from the .env file into one object.
// Never hard-code secrets in code - keep them in .env (which is git-ignored).
import 'dotenv/config';

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  mongoUri: process.env.MONGODB_URI,
  mongoDbName: process.env.MONGODB_DB_NAME ?? 'sports_team_portal',
};

// No MONGODB_URI -> the demo data is kept in memory instead (see repositories/index.js).
env.useMongo = Boolean(env.mongoUri);

if (!env.jwtSecret || env.jwtSecret.length < 32) {
  throw new Error('JWT_SECRET is missing or too short in backend/.env (use at least 32 random characters).');
}
