import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductorProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombreNegocio: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombreContacto: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  certificaciones?: string[];

}
