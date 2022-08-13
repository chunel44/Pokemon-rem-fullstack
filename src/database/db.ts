import { DatabaseClient } from "@/database";
import { MongoConnection } from '@/database/mongoConnection';


const db = new DatabaseClient(new MongoConnection({
  url: process.env.MONGO_URL_Dev || '',
}));

export default db.dbAdapter;