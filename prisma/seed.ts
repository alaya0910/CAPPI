import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await argon2.hash('Admin123!');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cappi.com' },
    update: {},
    create: {
      email: 'admin@cappi.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      country: 'Mexico',
      locale: 'es-MX',
    },
  });

  console.log('✅ Admin user created');

  // Create traveler users
  const traveler1Password = await argon2.hash('Traveler123!');
  const traveler1 = await prisma.user.upsert({
    where: { email: 'traveler@example.com' },
    update: {},
    create: {
      email: 'traveler@example.com',
      passwordHash: traveler1Password,
      role: 'TRAVELER',
      status: 'ACTIVE',
      country: 'Mexico',
      locale: 'es-MX',
      profile: {
        create: {
          fullName: 'Juan Pérez',
          homeAirport: 'CUN',
          riskTolerance: 'MEDIUM',
          loyaltyTier: 'SILVER',
          preferences: {
            cuisines: ['Mexican', 'Mediterranean', 'Japanese'],
            activities: ['Beach', 'Nightlife', 'Gastronomy'],
            ambiance: ['Luxury', 'Trendy'],
          },
        },
      },
    },
  });

  console.log('✅ Traveler users created');

  // Create partners
  const partner1 = await prisma.partner.create({
    data: {
      type: 'HOTEL',
      name: 'Grand Velas Riviera Maya',
      contactEmail: 'contact@grandvelas.com',
      phone: '+52 998 123 4567',
      website: 'https://grandvelas.com',
      status: 'ACTIVE',
    },
  });

  const partner2 = await prisma.partner.create({
    data: {
      type: 'RESTAURANT',
      name: 'Grupo Rosa Negra',
      contactEmail: 'info@rosanegra.com',
      phone: '+52 998 765 4321',
      website: 'https://rosanegra.com.mx',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Partners created');

  // Create safety zones - Cancún
  const cancunSafeZone = await prisma.safetyZone.create({
    data: {
      city: 'Cancún',
      country: 'Mexico',
      polygon: JSON.stringify({
        type: 'Polygon',
        coordinates: [
          [
            [-86.8515, 21.1619],
            [-86.7466, 21.1619],
            [-86.7466, 21.0881],
            [-86.8515, 21.0881],
            [-86.8515, 21.1619],
          ],
        ],
      }),
      riskLevel: 'SAFE',
      source: 'local_authorities',
    },
  });

  // Create safety zones - Medellín
  const medellinSafeZone = await prisma.safetyZone.create({
    data: {
      city: 'Medellín',
      country: 'Colombia',
      polygon: JSON.stringify({
        type: 'Polygon',
        coordinates: [
          [
            [-75.5812, 6.2476],
            [-75.5562, 6.2476],
            [-75.5562, 6.2088],
            [-75.5812, 6.2088],
            [-75.5812, 6.2476],
          ],
        ],
      }),
      riskLevel: 'SAFE',
      source: 'local_authorities',
    },
  });

  console.log('✅ Safety zones created');

  // Create places - Cancún
  const place1 = await prisma.place.create({
    data: {
      type: 'ROOFTOP',
      name: 'Rooftop 22',
      description: 'Bar de rooftop premium con vista al mar Caribe',
      address: 'Blvd. Kukulcan Km 9, Zona Hotelera',
      lat: 21.1333,
      lng: -86.7467,
      city: 'Cancún',
      country: 'Mexico',
      images: [
        { url: 'https://example.com/rooftop22-1.jpg', alt: 'Vista panorámica' },
        { url: 'https://example.com/rooftop22-2.jpg', alt: 'Bar' },
      ],
      tags: ['premium', 'sunset', 'cocktails', 'ocean-view'],
      safetyScore: 95,
      verified: true,
    },
  });

  const place2 = await prisma.place.create({
    data: {
      type: 'RESTAURANT',
      name: 'RosaNegra',
      description: 'Restaurante de alta cocina latinoamericana',
      address: 'Blvd. Kukulcan Km 14.2, Zona Hotelera',
      lat: 21.0975,
      lng: -86.7693,
      city: 'Cancún',
      country: 'Mexico',
      images: [
        { url: 'https://example.com/rosanegra-1.jpg', alt: 'Entrada' },
        { url: 'https://example.com/rosanegra-2.jpg', alt: 'Plato signature' },
      ],
      tags: ['fine-dining', 'latin-cuisine', 'live-music', 'premium'],
      safetyScore: 92,
      verified: true,
    },
  });

  const place3 = await prisma.place.create({
    data: {
      type: 'CLUB',
      name: 'Mandala Beach Club',
      description: 'Beach club de día y club nocturno de noche',
      address: 'Blvd. Kukulcan Km 9.5, Zona Hotelera',
      lat: 21.1289,
      lng: -86.7478,
      city: 'Cancún',
      country: 'Mexico',
      images: [{ url: 'https://example.com/mandala-1.jpg', alt: 'Beach club' }],
      tags: ['beach-club', 'nightlife', 'dj', 'party'],
      safetyScore: 88,
      verified: true,
    },
  });

  const place4 = await prisma.place.create({
    data: {
      type: 'BEACH',
      name: 'Playa Delfines',
      description: 'Playa pública icónica de Cancún',
      address: 'Blvd. Kukulcan Km 17.5, Zona Hotelera',
      lat: 21.0733,
      lng: -86.7733,
      city: 'Cancún',
      country: 'Mexico',
      images: [{ url: 'https://example.com/delfines-1.jpg', alt: 'Playa' }],
      tags: ['public-beach', 'scenic', 'swimming', 'free'],
      safetyScore: 85,
      verified: true,
    },
  });

  // Create places - Medellín
  const place5 = await prisma.place.create({
    data: {
      type: 'ROOFTOP',
      name: 'Envy Rooftop',
      description: 'Rooftop bar con vista 360° de Medellín',
      address: 'Calle 10 # 38-48, El Poblado',
      lat: 6.2088,
      lng: -75.5687,
      city: 'Medellín',
      country: 'Colombia',
      images: [{ url: 'https://example.com/envy-1.jpg', alt: 'Vista nocturna' }],
      tags: ['rooftop', 'cocktails', 'city-view', 'trendy'],
      safetyScore: 90,
      verified: true,
    },
  });

  const place6 = await prisma.place.create({
    data: {
      type: 'RESTAURANT',
      name: 'Carmen',
      description: 'Restaurante gourmet en casa colonial',
      address: 'Carrera 36 # 10A-27, El Poblado',
      lat: 6.2102,
      lng: -75.5665,
      city: 'Medellín',
      country: 'Colombia',
      images: [{ url: 'https://example.com/carmen-1.jpg', alt: 'Patio colonial' }],
      tags: ['fine-dining', 'colombian-fusion', 'romantic', 'colonial'],
      safetyScore: 93,
      verified: true,
    },
  });

  console.log('✅ Places created');

  // Create experiences
  const exp1 = await prisma.experience.create({
    data: {
      placeId: place2.id,
      title: 'Cena VIP en RosaNegra con show en vivo',
      shortDesc: 'Cena de 5 tiempos con espectáculo latino',
      longDesc:
        'Experiencia gastronómica premium con menú degustación de 5 tiempos, maridaje de vinos y show en vivo de percusión latina.',
      category: 'DINNER',
      durationMins: 180,
      priceMin: 2500,
      priceMax: 4000,
      currency: 'MXN',
      includes: ['Menú 5 tiempos', 'Maridaje', 'Show en vivo', 'Mesa VIP'],
      requirements: { minAge: 18, maxGuests: 8, dressCode: 'Elegante' },
      cancellationPolicy: { cancelBefore: 48, refundPercentage: 100 },
      ratingAvg: 4.8,
      ratingCount: 127,
    },
  });

  const exp2 = await prisma.experience.create({
    data: {
      placeId: place1.id,
      title: 'Sunset Premium en Rooftop 22',
      shortDesc: 'Atardecer con cócteles premium y música live',
      longDesc:
        'Disfruta del mejor atardecer de Cancún con cócteles artesanales, tabla gourmet y música en vivo. Incluye mesa reservada con vista al mar.',
      category: 'VIP_EVENT',
      durationMins: 120,
      priceMin: 1500,
      priceMax: 2500,
      currency: 'MXN',
      includes: ['2 cócteles', 'Tabla gourmet', 'Mesa premium', 'Música en vivo'],
      requirements: { minAge: 21, maxGuests: 6 },
      cancellationPolicy: { cancelBefore: 24, refundPercentage: 50 },
      ratingAvg: 4.9,
      ratingCount: 89,
    },
  });

  const exp3 = await prisma.experience.create({
    data: {
      placeId: place5.id,
      title: 'Tour gastronómico en El Poblado',
      shortDesc: 'Recorrido por los mejores restaurantes de Medellín',
      longDesc:
        'Tour privado por 5 restaurantes top de El Poblado con degustaciones y transporte incluido. Guía especializado en gastronomía colombiana.',
      category: 'GASTRONOMY',
      durationMins: 240,
      priceMin: 180000,
      priceMax: 250000,
      currency: 'COP',
      includes: ['5 degustaciones', 'Transporte', 'Guía experto', 'Bebidas'],
      requirements: { minAge: 18, maxGuests: 10 },
      cancellationPolicy: { cancelBefore: 72, refundPercentage: 100 },
      ratingAvg: 4.7,
      ratingCount: 64,
    },
  });

  console.log('✅ Experiences created');

  // Create a sample trip
  const trip = await prisma.trip.create({
    data: {
      userId: traveler1.id,
      title: 'Escapada a Cancún',
      city: 'Cancún',
      country: 'Mexico',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-05'),
      partySize: 2,
      budgetLevel: 'LUXURY',
      notes: 'Aniversario - buscar experiencias románticas',
      itineraryItems: {
        create: [
          {
            dayIndex: 0,
            entityType: 'PLACE',
            entityId: place1.id,
            status: 'PLANNED',
            customNote: 'Primer día - sunset',
          },
          {
            dayIndex: 1,
            entityType: 'EXPERIENCE',
            entityId: exp1.id,
            status: 'PLANNED',
            customNote: 'Cena especial aniversario',
          },
        ],
      },
    },
  });

  console.log('✅ Sample trip created');

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
