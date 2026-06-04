import { PrismaClient } from '@prisma/client';
import tracks from './seeds/tracks.json';

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${tracks.length} tracks...`);

  for (const track of tracks) {
    await prisma.track.upsert({
      where: {
        name_layout: {
          name: track.name,
          layout: track.layout ?? '',
        },
      },
      update: {},
      create: {
        name: track.name,
        layout: track.layout ?? '',
        country: track.country ?? '',
        trackLength: track.trackLength,
      },
    });
  }

  console.log('Tracks seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
