import { Module } from '@nestjs/common';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationEngineService } from './recommendation-engine.service';
import { SafetyModule } from '../safety/safety.module';

@Module({
  imports: [SafetyModule],
  controllers: [RecommendationsController],
  providers: [RecommendationEngineService],
  exports: [RecommendationEngineService],
})
export class RecommendationsModule {}
