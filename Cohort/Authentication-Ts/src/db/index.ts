import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
4;
const db = drizzle(process.env.DATABASE_URL!);

export default db;
