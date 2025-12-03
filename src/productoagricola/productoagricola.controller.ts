import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ProductoAgricolaService } from './productoagricola.service';
import { CreateProductoAgricolaDto } from './dto/create-productoagricola.dto';
import { UpdateProductoAgricolaDto } from './dto/update-productoagricola.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('ProductoAgricola')
@ApiBearerAuth('JWT-auth')
@Controller('producto-agricola')
export class ProductoAgricolaController {
  constructor(
    private readonly productoagricolaService: ProductoAgricolaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo ProductoAgricola' })
  @ApiBody({ type: CreateProductoAgricolaDto })
  @ApiResponse({ status: 201, description: 'ProductoAgricola creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createProductoAgricolaDto: CreateProductoAgricolaDto) {
    const data = await this.productoagricolaService.create(createProductoAgricolaDto);
    return {
      success: true,
      message: 'ProductoAgricola creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Productoagricola' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Productoagricola' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Productoagricola no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.productoagricolaService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { productoagricola: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los ProductoAgricolas' })
  @ApiResponse({ status: 200, description: 'Lista de ProductoAgricolas' })
  async findAll() {
    const data = await this.productoagricolaService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get('productor/:productorId')
  @ApiOperation({ summary: 'Listar productos por productor (ProductorProfileId o userId)' })
  @ApiParam({ name: 'productorId', description: 'ID de ProductorProfile o userId del productor' })
  @ApiResponse({ status: 200, description: 'Lista de productos del productor' })
  async findByProductor(@Param('productorId') productorId: string) {
    const data = await this.productoagricolaService.findByProductorIdentifier(productorId);
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ProductoAgricola por ID' })
  @ApiParam({ name: 'id', description: 'ID del ProductoAgricola' })
  @ApiResponse({ status: 200, description: 'ProductoAgricola encontrado' })
  @ApiResponse({ status: 404, description: 'ProductoAgricola no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.productoagricolaService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar ProductoAgricola' })
  @ApiParam({ name: 'id', description: 'ID del ProductoAgricola' })
  @ApiBody({ type: UpdateProductoAgricolaDto })
  @ApiResponse({ status: 200, description: 'ProductoAgricola actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'ProductoAgricola no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateProductoAgricolaDto: UpdateProductoAgricolaDto
  ) {
    const data = await this.productoagricolaService.update(id, updateProductoAgricolaDto);
    return {
      success: true,
      message: 'ProductoAgricola actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar ProductoAgricola' })
  @ApiParam({ name: 'id', description: 'ID del ProductoAgricola' })
  @ApiResponse({ status: 200, description: 'ProductoAgricola eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'ProductoAgricola no encontrado' })
  async remove(@Param('id') id: string) {
    const productoagricola = await this.productoagricolaService.findOne(id);
    if (productoagricola.imagen) {
      const filename = productoagricola.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.productoagricolaService.remove(id);
    return { success: true, message: 'ProductoAgricola eliminado exitosamente' };
  }
}
