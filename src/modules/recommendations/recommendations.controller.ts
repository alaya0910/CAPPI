import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecommendationEngineService } from './recommendation-engine.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Recommendations')
@Controller('recommendations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecommendationsController {
  constructor(private recommendationEngine: RecommendationEngineService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate personalized recommendations' })
  async generate(@CurrentUser() user: any, @Body() context: any) {
    return this.recommendationEngine.generateRecommendations(user.id, context);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest recommendations' })
  async getLatest(@CurrentUser() user: any) {
    return this.recommendationEngine.getLatestRecommendations(user.id);
  }
}
