import { MongoClient } from "mongodb";

export const connectToDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI;
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    const db = client.db();
    console.log("MongoDB spojen:", db.databaseName);
    return db;
  } catch (error) {
    console.error("Greška pri povezivanju na bazu podataka:", error);
    throw error;
  }
};
