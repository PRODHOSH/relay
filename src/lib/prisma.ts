import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

let connectionString = `${process.env.DATABASE_URL}`;
if (connectionString.includes('sslmode=require') && !connectionString.includes('uselibpqcompat')) {
  connectionString = connectionString.replace('sslmode=require', 'sslmode=require&uselibpqcompat=true');
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  global.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
