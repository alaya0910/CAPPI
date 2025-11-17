import { Controller, Post, Get, Patch, Query, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a review' })
  async createReview(@CurrentUser() user: any, @Body() data: any) {
    return this.reviewsService.createReview(user.id, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get reviews by entity' })
  async getReviews(@Query('entityType') entityType: string, @Query('entityId') entityId: string) {
    return this.reviewsService.getReviews(entityType, entityId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN' as any)
  @ApiOperation({ summary: 'Moderate review (Admin only)' })
  async moderateReview(@Param('id') id: string, @Query('status') status: string) {
    return this.reviewsService.moderateReview(id, status);
  }
}
