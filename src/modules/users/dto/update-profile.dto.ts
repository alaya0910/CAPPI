import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'])
  gender?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  homeAirport?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  preferences?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  riskTolerance?: string;
}
