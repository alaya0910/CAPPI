import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.travelerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            country: true,
            locale: true,
          },
        },
      },
    });

    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Check if profile exists
    let profile = await this.prisma.travelerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Create profile if doesn't exist
      profile = await this.prisma.travelerProfile.create({
        data: {
          userId,
          fullName: dto.fullName || '',
          birthdate: dto.birthdate ? new Date(dto.birthdate) : null,
          gender: dto.gender as any,
          homeAirport: dto.homeAirport,
          preferences: dto.preferences,
          riskTolerance: (dto.riskTolerance as any) || 'MEDIUM',
        },
      });
    } else {
      // Update existing profile
      profile = await this.prisma.travelerProfile.update({
        where: { userId },
        data: {
          fullName: dto.fullName,
          birthdate: dto.birthdate ? new Date(dto.birthdate) : undefined,
          gender: dto.gender as any,
          homeAirport: dto.homeAirport,
          preferences: dto.preferences,
          riskTolerance: dto.riskTolerance as any,
        },
      });
    }

    return profile;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        country: true,
        locale: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
