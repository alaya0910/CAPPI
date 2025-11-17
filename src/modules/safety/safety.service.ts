import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class SafetyService {
  constructor(private prisma: PrismaService) {}

  async getZonesByCity(city: string, country: string = 'Mexico') {
    return this.prisma.safetyZone.findMany({
      where: { city, country },
      include: {
        alerts: {
          where: {
            OR: [{ endAt: null }, { endAt: { gte: new Date() } }],
          },
        },
      },
    });
  }

  async getActiveAlerts(city?: string) {
    const where: any = {
      OR: [{ endAt: null }, { endAt: { gte: new Date() } }],
      startAt: { lte: new Date() },
    };

    if (city) {
      where.zone = {
        city: { contains: city, mode: 'insensitive' },
      };
    }

    return this.prisma.safetyAlert.findMany({
      where,
      include: {
        zone: {
          select: {
            id: true,
            city: true,
            riskLevel: true,
          },
        },
      },
      orderBy: { severity: 'desc' },
    });
  }

  async checkLocationSafety(lat: number, lng: number) {
    // Simplified: In production, implement actual point-in-polygon check
    // This is a placeholder that returns nearby zones
    return {
      lat,
      lng,
      riskLevel: 'SAFE',
      message: 'Location check not fully implemented - placeholder',
    };
  }
}
