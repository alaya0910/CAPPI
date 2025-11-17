import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { GetPlacesDto, GetExperiencesDto } from './dto/catalog.dto';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async getPlaces(dto: GetPlacesDto) {
    const where: any = {};

    if (dto.type) where.type = dto.type;
    if (dto.city) where.city = { contains: dto.city, mode: 'insensitive' };
    if (dto.tags && dto.tags.length > 0) where.tags = { hasSome: dto.tags };
    if (dto.safetyScoreMin) where.safetyScore = { gte: dto.safetyScoreMin };
    if (dto.q) {
      where.OR = [
        { name: { contains: dto.q, mode: 'insensitive' } },
        { description: { contains: dto.q, mode: 'insensitive' } },
      ];
    }

    const [places, total] = await Promise.all([
      this.prisma.place.findMany({
        where,
        skip: (dto.page - 1) * dto.limit,
        take: dto.limit,
        orderBy: [{ safetyScore: 'desc' }, { verified: 'desc' }],
      }),
      this.prisma.place.count({ where }),
    ]);

    return {
      data: places,
      meta: {
        total,
        page: dto.page,
        limit: dto.limit,
        totalPages: Math.ceil(total / dto.limit),
      },
    };
  }

  async getPlaceById(id: string) {
    return this.prisma.place.findUnique({
      where: { id },
      include: {
        experiences: true,
        menuItems: true,
        media: true,
      },
    });
  }

  async getExperiences(dto: GetExperiencesDto) {
    const where: any = {};

    if (dto.category) where.category = dto.category;
    if (dto.priceMin) where.priceMin = { gte: dto.priceMin };
    if (dto.priceMax) where.priceMax = { lte: dto.priceMax };
    if (dto.ratingMin) where.ratingAvg = { gte: dto.ratingMin };
    if (dto.city) {
      where.place = {
        city: { contains: dto.city, mode: 'insensitive' },
      };
    }
    if (dto.q) {
      where.OR = [
        { title: { contains: dto.q, mode: 'insensitive' } },
        { shortDesc: { contains: dto.q, mode: 'insensitive' } },
      ];
    }

    const [experiences, total] = await Promise.all([
      this.prisma.experience.findMany({
        where,
        skip: (dto.page - 1) * dto.limit,
        take: dto.limit,
        include: {
          place: {
            select: {
              id: true,
              name: true,
              city: true,
              safetyScore: true,
            },
          },
        },
        orderBy: { ratingAvg: 'desc' },
      }),
      this.prisma.experience.count({ where }),
    ]);

    return {
      data: experiences,
      meta: {
        total,
        page: dto.page,
        limit: dto.limit,
        totalPages: Math.ceil(total / dto.limit),
      },
    };
  }

  async getExperienceById(id: string) {
    return this.prisma.experience.findUnique({
      where: { id },
      include: {
        place: true,
        media: true,
      },
    });
  }
}
