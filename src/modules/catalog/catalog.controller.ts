import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { GetPlacesDto, GetExperiencesDto } from './dto/catalog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Catalog')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @Get('places')
  @ApiOperation({ summary: 'Get all places with filters' })
  async getPlaces(@Query() dto: GetPlacesDto) {
    return this.catalogService.getPlaces(dto);
  }

  @Get('places/:id')
  @ApiOperation({ summary: 'Get place by ID' })
  async getPlace(@Param('id') id: string) {
    return this.catalogService.getPlaceById(id);
  }

  @Get('experiences')
  @ApiOperation({ summary: 'Get all experiences with filters' })
  async getExperiences(@Query() dto: GetExperiencesDto) {
    return this.catalogService.getExperiences(dto);
  }

  @Get('experiences/:id')
  @ApiOperation({ summary: 'Get experience by ID' })
  async getExperience(@Param('id') id: string) {
    return this.catalogService.getExperienceById(id);
  }
}
