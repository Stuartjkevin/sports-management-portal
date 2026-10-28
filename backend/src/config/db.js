// One shared MongoDB connection for the whole app.
// The promise is cached so every request reuses the same connection.
import { MongoClient } from 'mongodb';
import { env } from './env.js';

let clientPromise;

export function getClient() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is missing (backend/.env locally, Environment Variables on the host).');
  }
  if (!clientPromise) {
    const client = new MongoClient(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
    clientPromise = client.connect().catch((error) => {
      clientPromise = undefined; // let the next request try again
      throw error;
    });
  }
  return clientPromise;
}

export async function getDb() {
  return (await getClient()).db(env.mongoDbName);
}

export async function closeDb() {
  if (clientPromise) await (await clientPromise).close();
  clientPromise = undefined;
}
