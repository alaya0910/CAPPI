import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ChatAiService } from './chat-ai.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private chatAi: ChatAiService,
  ) {}

  async sendMessage(userId: string, sessionId: string | null, message: string, context: any) {
    // Create or get session
    let session;
    if (sessionId) {
      session = await this.prisma.conversationSession.findUnique({
        where: { id: sessionId },
      });
    }

    if (!session) {
      session = await this.prisma.conversationSession.create({
        data: {
          userId,
          context: context || {},
          active: true,
        },
      });
    }

    // Save user message
    await this.prisma.message.create({
      data: {
        sessionId: session.id,
        userId,
        role: 'USER',
        content: message,
      },
    });

    // Get AI response
    const aiResponse = await this.chatAi.processMessage(userId, session.id, message, context);

    // Save AI message
    const assistantMessage = await this.prisma.message.create({
      data: {
        sessionId: session.id,
        role: 'ASSISTANT',
        content: aiResponse,
      },
    });

    // Update session
    await this.prisma.conversationSession.update({
      where: { id: session.id },
      data: { lastMessageAt: new Date() },
    });

    return {
      sessionId: session.id,
      message: assistantMessage,
    };
  }

  async getHistory(sessionId: string, limit: number = 50) {
    return this.prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }
}
