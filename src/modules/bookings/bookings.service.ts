import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(userId: string, data: any) {
    // Validate entity exists
    if (data.entityType === 'PLACE') {
      const place = await this.prisma.place.findUnique({
        where: { id: data.entityId },
      });
      if (!place) {
        throw new BadRequestException('Place not found');
      }
    } else if (data.entityType === 'EXPERIENCE') {
      const experience = await this.prisma.experience.findUnique({
        where: { id: data.entityId },
      });
      if (!experience) {
        throw new BadRequestException('Experience not found');
      }
    }

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        entityType: data.entityType,
        entityId: data.entityId,
        partnerId: data.partnerId,
        quantity: data.quantity || 1,
        price: data.price,
        currency: data.currency || 'MXN',
        meta: data.meta,
        status: 'PENDING',
      },
    });

    // Create payment (stub)
    const payment = await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: data.price,
        currency: data.currency || 'MXN',
        status: 'INITIATED',
        provider: 'DUMMY',
      },
    });

    // Simulate payment success (in production, this would be async)
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'SUCCEEDED' },
    });

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CONFIRMED' },
    });

    return {
      ...booking,
      payment,
    };
  }

  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        payments: true,
        place: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        experience: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingById(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
      include: {
        payments: true,
        place: true,
        experience: true,
      },
    });

    return booking;
  }

  async cancelBooking(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
    });

    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    if (booking.status === 'CANCELED') {
      throw new BadRequestException('Booking already canceled');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELED' },
    });
  }
}
