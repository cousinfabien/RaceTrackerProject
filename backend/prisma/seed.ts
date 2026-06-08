import { PrismaClient, VehicleCategory } from '@prisma/client';
import tracks from './seeds/tracks.json';
import vehicles from './seeds/vehicles.json';

// Use the typed PrismaClient instance instead of casting to `any`
const prisma = new PrismaClient();

function isVehicleCategory(category: any): category is VehicleCategory {
  return ['GR1', 'GR2', 'GR3', 'GR4', 'GRB'].includes(category);
}

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

  console.log(`Seeding ${vehicles.length} vehicles...`);
  for (const vehicle of vehicles) {
    await prisma.vehicleModel.upsert({
      where: {
        manufacturer_model: {
          manufacturer: vehicle.manufacturer,
          model: vehicle.model,
        },
      },
      update: {},
      create: {
        manufacturer: vehicle.manufacturer,
        model: vehicle.model,
        basePower: vehicle.basePower ?? 0,
        baseWeight: vehicle.baseWeight ?? 0,
        category: isVehicleCategory(vehicle.category) ? vehicle.category : null,
      },
    });
  }
  console.log('Vehicles seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
