import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import BetterSqlite3 from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const sqlite = new BetterSqlite3(dbPath);
const adapter = new PrismaBetterSqlite3(sqlite as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    include: { group: true, administeredGroup: true },
  });
  console.log("USERS:", JSON.stringify(users, null, 2));

  const groups = await prisma.group.findMany({
    include: { admin: true, members: true },
  });
  console.log("GROUPS:", JSON.stringify(groups, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
