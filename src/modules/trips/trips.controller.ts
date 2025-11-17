import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto, AddItineraryItemDto } from './dto/trip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Trips & Itinerary')
@Controller('trips')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  async createTrip(@CurrentUser() user: any, @Body() dto: CreateTripDto) {
    return this.tripsService.createTrip(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user trips' })
  async getTrips(@CurrentUser() user: any) {
    return this.tripsService.getUserTrips(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip by ID' })
  async getTrip(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tripsService.getTripById(id, user.id);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add item to trip itinerary' })
  async addItem(
    @CurrentUser() user: any,
    @Param('id') tripId: string,
    @Body() dto: AddItineraryItemDto,
  ) {
    return this.tripsService.addItineraryItem(tripId, user.id, dto);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update itinerary item status' })
  async updateItem(
    @CurrentUser() user: any,
    @Param('itemId') itemId: string,
    @Query('status') status: string,
  ) {
    return this.tripsService.updateItineraryItem(itemId, user.id, status);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Delete itinerary item' })
  async deleteItem(@CurrentUser() user: any, @Param('itemId') itemId: string) {
    return this.tripsService.deleteItineraryItem(itemId, user.id);
  }
}
