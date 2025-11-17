import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateTripDto, AddItineraryItemDto } from './dto/trip.dto';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async createTrip(userId: string, dto: CreateTripDto) {
    return this.prisma.trip.create({
      data: {
        userId,
        title: dto.title,
        city: dto.city,
        country: dto.country,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        partySize: dto.partySize,
        budgetLevel: dto.budgetLevel as any,
        notes: dto.notes,
      },
    });
  }

  async getUserTrips(userId: string) {
    return this.prisma.trip.findMany({
      where: { userId },
      include: {
        itineraryItems: {
          orderBy: [{ dayIndex: 'asc' }, { startTime: 'asc' }],
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async getTripById(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        itineraryItems: {
          orderBy: [{ dayIndex: 'asc' }, { startTime: 'asc' }],
        },
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return trip;
  }

  async addItineraryItem(tripId: string, userId: string, dto: AddItineraryItemDto) {
    // Verify trip ownership
    const trip = await this.getTripById(tripId, userId);

    return this.prisma.itineraryItem.create({
      data: {
        tripId,
        dayIndex: dto.dayIndex,
        entityType: dto.entityType as any,
        entityId: dto.entityId,
        startTime: dto.startTime ? new Date(dto.startTime) : null,
        endTime: dto.endTime ? new Date(dto.endTime) : null,
        customNote: dto.customNote,
      },
    });
  }

  async updateItineraryItem(itemId: string, userId: string, status: string) {
    const item = await this.prisma.itineraryItem.findUnique({
      where: { id: itemId },
      include: { trip: true },
    });

    if (!item || item.trip.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.itineraryItem.update({
      where: { id: itemId },
      data: { status: status as any },
    });
  }

  async deleteItineraryItem(itemId: string, userId: string) {
    const item = await this.prisma.itineraryItem.findUnique({
      where: { id: itemId },
      include: { trip: true },
    });

    if (!item || item.trip.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.itineraryItem.delete({
      where: { id: itemId },
    });
  }
}
