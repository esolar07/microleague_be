import { PrismaClient } from '../generated/prisma';
import { Sport } from '../src/types/sports';

const prisma = new PrismaClient();

const sportTypes: Sport[] = ['football', 'basketball', 'baseball'];

async function main() {
  for (const name of sportTypes) {
        await prisma.sports.createMany({
      data: [{ name }],
      skipDuplicates: true,
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });