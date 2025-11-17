import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AppConfigModule } from './config/app-config.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { SafetyModule } from './modules/safety/safety.module';
import { TripsModule } from './modules/trips/trips.module';
import { ChatModule } from './modules/chat/chat.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ReviewsModule } from './modules/reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests
      },
    ]),
    PrismaModule,
    AppConfigModule,
    AuthModule,
    UsersModule,
    CatalogModule,
    SafetyModule,
    TripsModule,
    ChatModule,
    RecommendationsModule,
    BookingsModule,
    ReviewsModule,
  ],
})
export class AppModule {}
