import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductoAgricolaDto } from './dto/create-productoagricola.dto';
import { UpdateProductoAgricolaDto } from './dto/update-productoagricola.dto';
import { ProductoAgricola, ProductoAgricolaDocument } from './schemas/productoagricola.schema';

@Injectable()
export class ProductoAgricolaService {
  constructor(
    @InjectModel(ProductoAgricola.name) private productoagricolaModel: Model<ProductoAgricolaDocument>,
  ) {}

  async create(createProductoAgricolaDto: CreateProductoAgricolaDto): Promise<ProductoAgricola> {
    const nuevoProductoAgricola = await this.productoagricolaModel.create(createProductoAgricolaDto);
    return nuevoProductoAgricola;
  }

  async findAll(): Promise<ProductoAgricola[]> {
    const productoagricolas = await this.productoagricolaModel.find();
    return productoagricolas;
  }

  async findOne(id: string | number): Promise<ProductoAgricola> {
    const productoagricola = await this.productoagricolaModel.findById(id)
    .populate('productor', 'nombre ubicacion telefono');
    if (!productoagricola) {
      throw new NotFoundException(`ProductoAgricola con ID ${id} no encontrado`);
    }
    return productoagricola;
  }

  async update(id: string | number, updateProductoAgricolaDto: UpdateProductoAgricolaDto): Promise<ProductoAgricola> {
    const productoagricola = await this.productoagricolaModel.findByIdAndUpdate(id, updateProductoAgricolaDto, { new: true })
    .populate('productor', 'nombre ubicacion telefono');
    if (!productoagricola) {
      throw new NotFoundException(`ProductoAgricola con ID ${id} no encontrado`);
    }
    return productoagricola;
  }

  async findByProductor(productorId: string): Promise<ProductoAgricola[]> {
    return this.productoagricolaModel.find({ productor: new Types.ObjectId(productorId) })
      .populate('productor', 'nombre ubicacion telefono');
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.productoagricolaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`ProductoAgricola con ID ${id} no encontrado`);
    }
  }
}
