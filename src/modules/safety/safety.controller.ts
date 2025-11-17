import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SafetyService } from './safety.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Safety')
@Controller('safety')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SafetyController {
  constructor(private safetyService: SafetyService) {}

  @Get('zones')
  @ApiOperation({ summary: 'Get safety zones by city' })
  async getZones(@Query('city') city: string, @Query('country') country?: string) {
    return this.safetyService.getZonesByCity(city, country);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get active safety alerts' })
  async getAlerts(@Query('city') city?: string) {
    return this.safetyService.getActiveAlerts(city);
  }
}
