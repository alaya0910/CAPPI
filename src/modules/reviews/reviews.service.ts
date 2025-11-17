import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: string, data: any) {
    return this.prisma.review.create({
      data: {
        userId,
        entityType: data.entityType,
        entityId: data.entityId,
        rating: data.rating,
        title: data.title,
        body: data.body,
        photos: data.photos,
        status: 'PENDING',
      },
    });
  }

  async getReviews(entityType: string, entityId: string) {
    return this.prisma.review.findMany({
      where: {
        entityType: entityType as any,
        entityId,
        status: 'PUBLISHED',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async moderateReview(reviewId: string, status: string) {
    return this.prisma.review.update({
      where: { id: reviewId },
      data: { status: status as any },
    });
  }
}
