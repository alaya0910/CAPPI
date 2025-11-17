import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send a chat message' })
  async send(
    @CurrentUser() user: any,
    @Body() body: { sessionId?: string; message: string; context?: any },
  ) {
    return this.chatService.sendMessage(user.id, body.sessionId || null, body.message, body.context);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get chat history' })
  async getHistory(@Query('sessionId') sessionId: string, @Query('limit') limit?: number) {
    return this.chatService.getHistory(sessionId, limit ? +limit : 50);
  }
}
