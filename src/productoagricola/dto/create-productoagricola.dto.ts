import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductoAgricolaDto {
  @ApiProperty({
    example: 'Nombre del ProductoAgricola',
    description: 'Nombre del ProductoAgricola',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    example: '64b0c5af12ab340001234567',
    description: 'ID del Productor propietario del producto',
  })
  @IsNotEmpty()
  @IsString()
  productor: string;

  @ApiProperty({
    example: 4.5,
    description: 'Precio por kilogramo',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioKg: number;

  @ApiPropertyOptional({
    example: 'verduras',
    description: 'Categoría del producto',
    enum: ['frutas', 'verduras', 'hortalizas', 'legumbres'],
  })
  @IsOptional()
  @IsEnum(['frutas', 'verduras', 'hortalizas', 'legumbres'])
  categoria?: string;

  @ApiPropertyOptional({
    example: 120,
    description: 'Stock disponible en kilogramos',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockKg?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el producto es orgánico',
  })
  @IsOptional()
  @IsBoolean()
  organico?: boolean;

  @ApiPropertyOptional({
    example: 'Descripción del ProductoAgricola',
    description: 'Descripción opcional',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/imagen.jpg',
    description: 'URL de la imagen',
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/thumbnail.jpg',
    description: 'URL del thumbnail',
  })
  @IsOptional()
  @IsString()
  imagenThumbnail?: string;
}
