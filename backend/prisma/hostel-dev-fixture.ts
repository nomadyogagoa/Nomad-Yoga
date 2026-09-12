import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { readFileSync } from 'node:fs';
import { Pool } from 'pg';

const connectionUrl = new URL(process.env.DATABASE_URL!);
for (const parameter of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey']) connectionUrl.searchParams.delete(parameter);
const pool = new Pool({
  connectionString: connectionUrl.toString(),
  ssl: { ca: readFileSync(process.env.DATABASE_CA_CERT_PATH!, 'utf8'), rejectUnauthorized: true },
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

type UsableHostel = { id: string; slug: string; name: string; created: boolean };

async function findUsableHostel(): Promise<UsableHostel | null> {
  const hostels = await prisma.hostel.findMany({
    include: { roomTypes: { include: { rooms: { include: { beds: true } } } } },
    orderBy: { name: 'asc' },
  });
  const hostel = hostels.find((item) => item.roomTypes.length >= 3 && item.roomTypes.every((roomType) =>
    roomType.isPrivate ? roomType.rooms.length > 0 : roomType.rooms.some((room) => room.beds.length > 0),
  ));
  return hostel ? { id: hostel.id, slug: hostel.slug, name: hostel.name, created: false } : null;
}

async function ensureFixture(): Promise<UsableHostel> {
  const existing = await findUsableHostel();
  if (existing) return existing;

  const hostel = await prisma.hostel.upsert({
    where: { slug: 'nomad-yoga-development-hostel' },
    update: {},
    create: {
      slug: 'nomad-yoga-development-hostel',
      name: 'Nomad Yoga Development Hostel',
      description: 'DEVELOPMENT-ONLY fixture for public hostel availability testing.',
      city: 'Agonda',
      country: 'India',
    },
  });

  const amenities = await Promise.all(['Wi-Fi', 'Shared Kitchen', 'Yoga Space', 'Personal Storage', 'Hot Water'].map((name) =>
    prisma.amenity.upsert({ where: { name }, update: {}, create: { name } }),
  ));

  const types = await Promise.all([
    { name: 'Shared Dorm', description: 'DEVELOPMENT-ONLY shared dorm fixture.', isPrivate: false, capacity: 1, basePrice: '950.00', rooms: [{ number: 'DEV-D1', beds: 6 }] },
    { name: 'Twin / Shared Room', description: 'DEVELOPMENT-ONLY twin room fixture.', isPrivate: true, capacity: 2, basePrice: '2400.00', rooms: [{ number: 'DEV-T1', beds: undefined }, { number: 'DEV-T2', beds: undefined }] },
    { name: 'Private Room', description: 'DEVELOPMENT-ONLY private room fixture.', isPrivate: true, capacity: 2, basePrice: '3800.00', rooms: [{ number: 'DEV-P1', beds: undefined }, { number: 'DEV-P2', beds: undefined }] },
  ].map(async (definition) => {
    const roomType = await prisma.roomType.upsert({
      where: { hostelId_name: { hostelId: hostel.id, name: definition.name } },
      update: {},
      create: { hostelId: hostel.id, name: definition.name, description: definition.description, isPrivate: definition.isPrivate, capacity: definition.capacity, basePrice: definition.basePrice, currency: 'INR' },
    });
    await Promise.all(amenities.map((amenity) => prisma.roomTypeAmenity.upsert({
      where: { roomTypeId_amenityId: { roomTypeId: roomType.id, amenityId: amenity.id } },
      update: {},
      create: { roomTypeId: roomType.id, amenityId: amenity.id },
    })));
    await Promise.all(definition.rooms.map(async (roomDefinition) => {
      const room = await prisma.room.upsert({
        where: { roomTypeId_roomNumber: { roomTypeId: roomType.id, roomNumber: roomDefinition.number } },
        update: {},
        create: { roomTypeId: roomType.id, name: `${definition.name} ${roomDefinition.number}`, roomNumber: roomDefinition.number },
      });
      if (roomDefinition.beds) {
        await Promise.all(Array.from({ length: roomDefinition.beds }, (_, index) => prisma.bed.upsert({
          where: { roomId_label: { roomId: room.id, label: `Bed ${index + 1}` } },
          update: {},
          create: { roomId: room.id, label: `Bed ${index + 1}` },
        })));
      }
    }));
    return roomType;
  }));

  await Promise.all(types.map((roomType) => prisma.roomPriceRule.upsert({
    where: { id: `development-rule-${roomType.id}` },
    update: {},
    create: { id: `development-rule-${roomType.id}`, roomTypeId: roomType.id, name: 'Development test rate', startsOn: new Date('2020-01-01T00:00:00.000Z'), endsOn: new Date('2100-12-31T00:00:00.000Z'), nightlyRate: roomType.basePrice },
  })));

  return { id: hostel.id, slug: hostel.slug, name: hostel.name, created: true };
}

ensureFixture()
  .then((hostel) => console.log(JSON.stringify(hostel)))
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
