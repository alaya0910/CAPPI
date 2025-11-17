import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecureP@ssw0rd' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'TRAVELER', enum: ['TRAVELER', 'PARTNER', 'ADMIN'], required: false })
  @IsOptional()
  @IsEnum(['TRAVELER', 'PARTNER', 'ADMIN'])
  role?: string;

  @ApiProperty({ example: '+52 998 123 4567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecureP@ssw0rd' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
