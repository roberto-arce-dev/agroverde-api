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
import { RutaEntregaService } from './rutaentrega.service';
import { CreateRutaEntregaDto } from './dto/create-rutaentrega.dto';
import { UpdateRutaEntregaDto } from './dto/update-rutaentrega.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('RutaEntrega')
@ApiBearerAuth('JWT-auth')
@Controller('ruta-entrega')
export class RutaEntregaController {
  constructor(
    private readonly rutaentregaService: RutaEntregaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo RutaEntrega' })
  @ApiBody({ type: CreateRutaEntregaDto })
  @ApiResponse({ status: 201, description: 'RutaEntrega creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createRutaEntregaDto: CreateRutaEntregaDto) {
    const data = await this.rutaentregaService.create(createRutaEntregaDto);
    return {
      success: true,
      message: 'RutaEntrega creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Rutaentrega' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Rutaentrega' })
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
  @ApiResponse({ status: 404, description: 'Rutaentrega no encontrado' })
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
    const updated = await this.rutaentregaService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { rutaentrega: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los RutaEntregas' })
  @ApiResponse({ status: 200, description: 'Lista de RutaEntregas' })
  async findAll() {
    const data = await this.rutaentregaService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener RutaEntrega por ID' })
  @ApiParam({ name: 'id', description: 'ID del RutaEntrega' })
  @ApiResponse({ status: 200, description: 'RutaEntrega encontrado' })
  @ApiResponse({ status: 404, description: 'RutaEntrega no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.rutaentregaService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar RutaEntrega' })
  @ApiParam({ name: 'id', description: 'ID del RutaEntrega' })
  @ApiBody({ type: UpdateRutaEntregaDto })
  @ApiResponse({ status: 200, description: 'RutaEntrega actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'RutaEntrega no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateRutaEntregaDto: UpdateRutaEntregaDto
  ) {
    const data = await this.rutaentregaService.update(id, updateRutaEntregaDto);
    return {
      success: true,
      message: 'RutaEntrega actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar RutaEntrega' })
  @ApiParam({ name: 'id', description: 'ID del RutaEntrega' })
  @ApiResponse({ status: 200, description: 'RutaEntrega eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'RutaEntrega no encontrado' })
  async remove(@Param('id') id: string) {
    const rutaentrega = await this.rutaentregaService.findOne(id);
    if (rutaentrega.imagen) {
      const filename = rutaentrega.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.rutaentregaService.remove(id);
    return { success: true, message: 'RutaEntrega eliminado exitosamente' };
  }
}
