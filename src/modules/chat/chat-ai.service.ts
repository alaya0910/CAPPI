import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { SafetyService } from '../safety/safety.service';
import { RecommendationEngineService } from '../recommendations/recommendation-engine.service';

interface ChatContext {
  city?: string;
  tripId?: string;
  preferences?: any;
}

@Injectable()
export class ChatAiService {
  constructor(
    private prisma: PrismaService,
    private safetyService: SafetyService,
    private recommendationEngine: RecommendationEngineService,
  ) {}

  async processMessage(
    userId: string,
    sessionId: string,
    message: string,
    context: ChatContext,
  ) {
    // Enrich context
    const enrichedContext = await this.enrichContext(userId, context);

    // Generate AI response (stub - integrate with real AI provider)
    const aiResponse = await this.generateAiResponse(message, enrichedContext);

    return aiResponse;
  }

  private async enrichContext(userId: string, context: ChatContext) {
    const enriched: any = { ...context };

    // Get user profile
    const profile = await this.prisma.travelerProfile.findUnique({
      where: { userId },
    });

    enriched.profile = profile;

    // Get safety info if city provided
    if (context.city) {
      const zones = await this.safetyService.getZonesByCity(context.city);
      const alerts = await this.safetyService.getActiveAlerts(context.city);
      enriched.safety = { zones, alerts };
    }

    // Get current trip if tripId provided
    if (context.tripId) {
      const trip = await this.prisma.trip.findUnique({
        where: { id: context.tripId },
        include: { itineraryItems: true },
      });
      enriched.trip = trip;
    }

    // Get recent recommendations
    const recommendations = await this.recommendationEngine.getLatestRecommendations(userId);
    enriched.recommendations = recommendations.slice(0, 1);

    return enriched;
  }

  private async generateAiResponse(message: string, context: any): Promise<string> {
    // STUB: This should integrate with OpenAI, Anthropic, or your AI provider
    // For MVP, return a template response

    const city = context.city || 'LATAM';
    const safetyZones = context.safety?.zones?.length || 0;
    const activeAlerts = context.safety?.alerts?.length || 0;

    let response = `¡Hola! Soy tu concierge de viaje para ${city}. `;

    if (safetyZones > 0) {
      response += `Tengo información actualizada sobre ${safetyZones} zonas seguras. `;
    }

    if (activeAlerts > 0) {
      response += `⚠️ Hay ${activeAlerts} alertas activas en la zona. `;
    }

    if (message.toLowerCase().includes('recomendar') || message.toLowerCase().includes('dónde')) {
      response +=
        'Te recomiendo explorar nuestras experiencias premium verificadas. ¿Te gustaría ver opciones de gastronomía, vida nocturna o experiencias VIP?';
    } else if (message.toLowerCase().includes('segur')) {
      response +=
        'La seguridad es nuestra prioridad. Todas nuestras recomendaciones están en zonas verificadas como seguras.';
    } else {
      response += '¿En qué puedo ayudarte hoy? Puedo recomendarte lugares, experiencias o ayudarte a planear tu itinerario.';
    }

    return response;
  }
}
