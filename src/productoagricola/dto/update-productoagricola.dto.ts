import { PartialType } from '@nestjs/swagger';
import { CreateProductoAgricolaDto } from './create-productoagricola.dto';

export class UpdateProductoAgricolaDto extends PartialType(CreateProductoAgricolaDto) {}
