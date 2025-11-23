import { PartialType } from '@nestjs/swagger';
import { CreateProductorProfileDto } from './create-productor-profile.dto';

export class UpdateProductorProfileDto extends PartialType(CreateProductorProfileDto) {}
