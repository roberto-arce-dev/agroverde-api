import { Controller, Get, Post, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductorProfileService } from './productor-profile.service';
import { CreateProductorProfileDto } from './dto/create-productor-profile.dto';
import { UpdateProductorProfileDto } from './dto/update-productor-profile.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('productor-profile')
@ApiBearerAuth('JWT-auth')
@Controller('productor-profile')
export class ProductorProfileController {
  constructor(private readonly productorprofileService: ProductorProfileService) {}

  @Get('me')
  @Roles(Role.PRODUCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Obtener mi perfil' })
  async getMyProfile(@CurrentUser() user: any) {
    return this.productorprofileService.findOrCreateByUserId(user.userId);
  }

  @Put('me')
  @Roles(Role.PRODUCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar mi perfil' })
  async updateMyProfile(@CurrentUser() user: any, @Body() dto: UpdateProductorProfileDto) {
    return this.productorprofileService.update(user.userId, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los perfiles (Admin)' })
  async findAll() {
    return this.productorprofileService.findAll();
  }

  @Get(':userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener perfil por userId (Admin)' })
  async findByUserId(@Param('userId') userId: string) {
    return this.productorprofileService.findByUserId(userId);
  }
}
