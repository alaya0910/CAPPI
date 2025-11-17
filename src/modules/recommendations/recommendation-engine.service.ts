import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { SafetyService } from '../safety/safety.service';

interface RecommendationContext {
  city: string;
  country?: string;
  budgetLevel?: string;
  preferences?: any;
  partySize?: number;
  riskTolerance?: string;
}

@Injectable()
export class RecommendationEngineService {
  constructor(
    private prisma: PrismaService,
    private safetyService: SafetyService,
  ) {}

  async generateRecommendations(userId: string, context: RecommendationContext) {
    // Get user profile
    const profile = await this.prisma.travelerProfile.findUnique({
      where: { userId },
    });

    const riskTolerance = profile?.riskTolerance || context.riskTolerance || 'MEDIUM';
    const budgetLevel = context.budgetLevel || 'MODERATE';

    // Step 1: Get safety zones
    const safetyZones = await this.safetyService.getZonesByCity(
      context.city,
      context.country || 'Mexico',
    );

    // Calculate minimum safety score based on risk tolerance
    const minSafetyScore = riskTolerance === 'LOW' ? 70 : riskTolerance === 'MEDIUM' ? 50 : 30;

    // Step 2: Get places (Safe-First strategy)
    const places = await this.prisma.place.findMany({
      where: {
        city: { contains: context.city, mode: 'insensitive' },
        safetyScore: { gte: minSafetyScore },
        verified: true,
      },
      take: 10,
      orderBy: [{ safetyScore: 'desc' }, { verified: 'desc' }],
    });

    // Step 3: Get experiences
    const experiences = await this.prisma.experience.findMany({
      where: {
        place: {
          city: { contains: context.city, mode: 'insensitive' },
          safetyScore: { gte: minSafetyScore },
        },
        ratingAvg: { gte: 4.0 },
      },
      include: {
        place: {
          select: {
            name: true,
            safetyScore: true,
            city: true,
          },
        },
      },
      take: 10,
      orderBy: { ratingAvg: 'desc' },
    });

    // Step 4: Score and rank items
    const items = [
      ...places.map((p) => ({
        entityType: 'PLACE',
        entityId: p.id,
        name: p.name,
        score: this.calculateScore(p, budgetLevel, riskTolerance),
        reasons: this.generateReasons(p, budgetLevel),
        safetyScore: p.safetyScore,
      })),
      ...experiences.map((e) => ({
        entityType: 'EXPERIENCE',
        entityId: e.id,
        name: e.title,
        score: this.calculateExperienceScore(e, budgetLevel, riskTolerance),
        reasons: this.generateExperienceReasons(e, budgetLevel),
        safetyScore: e.place?.safetyScore || 50,
      })),
    ].sort((a, b) => b.score - a.score);

    // Step 5: Save recommendation
    const recommendation = await this.prisma.recommendation.create({
      data: {
        userId,
        context: context as any,
        items: items as any,
        modelVersion: 'v1-safe-first',
      },
    });

    return {
      ...recommendation,
      safetyInfo: {
        zones: safetyZones.length,
        minSafetyScore,
        riskTolerance,
      },
    };
  }

  private calculateScore(place: any, budgetLevel: string, riskTolerance: string): number {
    let score = 0;

    // Safety is paramount (40%)
    score += place.safetyScore * 0.4;

    // Verification (20%)
    if (place.verified) score += 20;

    // Budget fit (20%)
    // Simplified - in production, match price levels
    score += 20;

    // Location quality (20%)
    score += Math.random() * 20; // Placeholder for location quality metric

    return Math.round(score);
  }

  private calculateExperienceScore(
    experience: any,
    budgetLevel: string,
    riskTolerance: string,
  ): number {
    let score = 0;

    // Safety (40%)
    score += (experience.place?.safetyScore || 50) * 0.4;

    // Rating (30%)
    score += (experience.ratingAvg / 5) * 30;

    // Budget fit (20%)
    score += 20;

    // Popularity (10%)
    score += (experience.ratingCount > 10 ? 10 : experience.ratingCount / 2);

    return Math.round(score);
  }

  private generateReasons(place: any, budgetLevel: string): string[] {
    const reasons = [];

    if (place.safetyScore >= 70) {
      reasons.push('Zona segura verificada');
    }

    if (place.verified) {
      reasons.push('Partner verificado');
    }

    if (place.tags.includes('premium')) {
      reasons.push('Experiencia premium');
    }

    return reasons;
  }

  private generateExperienceReasons(experience: any, budgetLevel: string): string[] {
    const reasons = [];

    if (experience.ratingAvg >= 4.5) {
      reasons.push('Altamente calificado');
    }

    if (experience.place?.safetyScore >= 70) {
      reasons.push('Ubicación segura');
    }

    if (experience.ratingCount > 50) {
      reasons.push('Muy popular');
    }

    return reasons;
  }

  async getLatestRecommendations(userId: string) {
    return this.prisma.recommendation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  }
}
