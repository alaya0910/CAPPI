import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatAiService } from './chat-ai.service';
import { SafetyModule } from '../safety/safety.module';
import { RecommendationsModule } from '../recommendations/recommendations.module';

@Module({
  imports: [SafetyModule, RecommendationsModule],
  controllers: [ChatController],
  providers: [ChatService, ChatAiService],
  exports: [ChatService],
})
export class ChatModule {}
