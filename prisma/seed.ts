import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const sportTypes = ['football', 'basketball', 'baseball'];

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