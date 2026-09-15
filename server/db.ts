import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_URI = 'mongodb://nitinc3114_db_user:j11PlmouL492JNRX@ac-3st3182-shard-00-00.utwzmif.mongodb.net:27017,ac-3st3182-shard-00-01.utwzmif.mongodb.net:27017,ac-3st3182-shard-00-02.utwzmif.mongodb.net:27017/?ssl=true&replicaSet=atlas-10fd0n-shard-0&authSource=admin&appName=Cluster0';
const MONGO_URI = process.env.MONGO_URI || DEFAULT_URI;
const DB_NAME = process.env.DB_NAME || 'sca';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) return db;
  try {
    client = new MongoClient(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected successfully to database: "${DB_NAME}"`);

    // Ensure indexes
    const posts = db.collection('posts');
    await posts.createIndex({ id: 1 }, { unique: true, sparse: true });
    await posts.createIndex({ createdAt: -1 });

    const clicks = db.collection('clicks');
    await clicks.createIndex({ postId: 1, timestamp: -1 });

    const settings = db.collection('settings');
    await settings.createIndex({ businessId: 1 }, { unique: true, sparse: true });

    return db;
  } catch (error) {
    console.error('[MongoDB] Connection failed:', error);
    throw error;
  }
}

export async function getDb(): Promise<Db> {
  if (!db) {
    return await connectToDatabase();
  }
  return db;
}

export async function getPostsCollection() {
  const database = await getDb();
  return database.collection('posts');
}

export async function getClicksCollection() {
  const database = await getDb();
  return database.collection('clicks');
}

export async function getSettingsCollection() {
  const database = await getDb();
  return database.collection('settings');
}
