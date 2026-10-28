// Builds the Express app (kept separate from server.js so it is easy to test).
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.use(helmet()); // sets safe HTTP headers
// Only the React app may call this API from a browser. CLIENT_URL can list several
// addresses separated by commas, e.g. "http://localhost:5173,https://my-app.onrender.com".
app.use(cors({ origin: env.clientUrl.split(',').map((url) => url.trim().replace(/\/$/, '')) }));
app.use(express.json({ limit: '100kb' })); // parses JSON request bodies into req.body
if (env.nodeEnv !== 'test') app.use(requestLogger);

app.get('/', (req, res) => res.json({ message: 'Sport Team Portal API. See /api/health' }));
app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
