import { IsString, IsOptional, IsNumber, IsArray, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetPlacesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum([
    'VILLA',
    'HOTEL',
    'RESTAURANT',
    'BAR',
    'CLUB',
    'TOUR',
    'LANDMARK',
    'BEACH',
    'ROOFTOP',
    'SPA',
    'SHOPPING',
    'NIGHTLIFE',
  ])
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  safetyScoreMin?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;
}

export class GetExperiencesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum([
    'DINNER',
    'SPA',
    'ADVENTURE',
    'VIP_EVENT',
    'PRIVATE_TOUR',
    'NIGHTLIFE',
    'WELLNESS',
    'CULTURAL',
    'WATER_SPORTS',
    'GASTRONOMY',
  ])
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMin?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMax?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ratingMin?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;
}
