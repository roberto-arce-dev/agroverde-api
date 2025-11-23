import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRutaEntregaDto } from './dto/create-rutaentrega.dto';
import { UpdateRutaEntregaDto } from './dto/update-rutaentrega.dto';
import { RutaEntrega, RutaEntregaDocument } from './schemas/rutaentrega.schema';

@Injectable()
export class RutaEntregaService {
  constructor(
    @InjectModel(RutaEntrega.name) private rutaentregaModel: Model<RutaEntregaDocument>,
  ) {}

  async create(createRutaEntregaDto: CreateRutaEntregaDto): Promise<RutaEntrega> {
    const nuevoRutaEntrega = await this.rutaentregaModel.create(createRutaEntregaDto);
    return nuevoRutaEntrega;
  }

  async findAll(): Promise<RutaEntrega[]> {
    const rutaentregas = await this.rutaentregaModel.find();
    return rutaentregas;
  }

  async findOne(id: string | number): Promise<RutaEntrega> {
    const rutaentrega = await this.rutaentregaModel.findById(id);
    if (!rutaentrega) {
      throw new NotFoundException(`RutaEntrega con ID ${id} no encontrado`);
    }
    return rutaentrega;
  }

  async update(id: string | number, updateRutaEntregaDto: UpdateRutaEntregaDto): Promise<RutaEntrega> {
    const rutaentrega = await this.rutaentregaModel.findByIdAndUpdate(id, updateRutaEntregaDto, { new: true });
    if (!rutaentrega) {
      throw new NotFoundException(`RutaEntrega con ID ${id} no encontrado`);
    }
    return rutaentrega;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.rutaentregaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`RutaEntrega con ID ${id} no encontrado`);
    }
  }
}
