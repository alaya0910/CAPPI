import {
  IsString,
  IsDateString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTripDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  partySize: number = 1;

  @ApiProperty({ enum: ['BUDGET', 'MODERATE', 'LUXURY', 'ULTRA_LUXURY'] })
  @IsEnum(['BUDGET', 'MODERATE', 'LUXURY', 'ULTRA_LUXURY'])
  budgetLevel: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AddItineraryItemDto {
  @ApiProperty()
  @IsNumber()
  dayIndex: number;

  @ApiProperty({ enum: ['PLACE', 'EXPERIENCE'] })
  @IsEnum(['PLACE', 'EXPERIENCE'])
  entityType: string;

  @ApiProperty()
  @IsString()
  entityId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customNote?: string;
}
