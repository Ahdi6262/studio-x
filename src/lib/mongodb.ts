
import { MongoClient, type Db, type Collection } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

if (!MONGODB_DB_NAME) {
  throw new Error(
    'Please define the MONGODB_DB_NAME environment variable inside .env'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    try {
      // Ping the database to ensure the connection is still alive
      await cachedClient.db(MONGODB_DB_NAME).command({ ping: 1 });
      // console.log('Using cached MongoDB connection');
      return { client: cachedClient, db: cachedDb };
    } catch (e) {
      console.warn('Cached MongoDB connection lost, creating new one.', e);
      cachedClient = null;
      cachedDb = null;
    }
  }

  const client = new MongoClient(MONGODB_URI!);
  
  try {
    // console.log('Attempting to connect to MongoDB...');
    await client.connect();
    // console.log('Successfully connected to MongoDB.');
    const db = client.db(MONGODB_DB_NAME);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    // Ensure the client is closed if connection fails partway
    await client.close();
    throw error;
  }
}

// Optional: A helper function to get a specific collection
export async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(collectionName);
}

// Example usage:
// import { getCollection } from '@/lib/mongodb';
// const usersCollection = await getCollection('users');
// const user = await usersCollection.findOne({ name: 'John Doe' });
