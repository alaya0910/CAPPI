import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  async createBooking(@CurrentUser() user: any, @Body() data: any) {
    return this.bookingsService.createBooking(user.id, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get user bookings' })
  async getBookings(@CurrentUser() user: any) {
    return this.bookingsService.getUserBookings(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  async getBooking(@CurrentUser() user: any, @Param('id') id: string) {
    return this.bookingsService.getBookingById(id, user.id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  async cancelBooking(@CurrentUser() user: any, @Param('id') id: string) {
    return this.bookingsService.cancelBooking(id, user.id);
  }
}
