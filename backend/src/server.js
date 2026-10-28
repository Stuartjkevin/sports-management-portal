// Entry point: connects to MongoDB (if configured) and starts the API server.
import app from './app.js';
import { env } from './config/env.js';
import { getDb, closeDb } from './config/db.js';

try {
  if (env.useMongo) {
    await (await getDb()).command({ ping: 1 });
    console.log(`MongoDB connected (database: ${env.mongoDbName})`);
  }
  const storage = env.useMongo ? 'MongoDB Atlas' : 'in-memory demo data, resets on restart';

  const server = app.listen(env.port, () => {
    console.log(`API running at http://localhost:${env.port}  (storage: ${storage})`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${env.port} is already in use. Stop the other process or change PORT in backend/.env.`);
      process.exitCode = 1;
    } else {
      throw err;
    }
  });

  const shutdown = async () => {
    await closeDb();
    server.close();
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
} catch (error) {
  await closeDb();
  console.error(`MongoDB connection failed: ${error.message}`);
  console.error('Check MONGODB_URI in backend/.env, or remove it to run with in-memory demo data.');
  process.exitCode = 1;
}
