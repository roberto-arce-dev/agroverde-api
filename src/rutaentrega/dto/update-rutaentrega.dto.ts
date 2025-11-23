import { PartialType } from '@nestjs/swagger';
import { CreateRutaEntregaDto } from './create-rutaentrega.dto';

export class UpdateRutaEntregaDto extends PartialType(CreateRutaEntregaDto) {}
