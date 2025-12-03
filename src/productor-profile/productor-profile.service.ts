import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductorProfile, ProductorProfileDocument } from './schemas/productor-profile.schema';
import { CreateProductorProfileDto } from './dto/create-productor-profile.dto';
import { UpdateProductorProfileDto } from './dto/update-productor-profile.dto';

@Injectable()
export class ProductorProfileService {
  constructor(
    @InjectModel(ProductorProfile.name) private productorprofileModel: Model<ProductorProfileDocument>,
  ) {}

  async create(userId: string, dto: CreateProductorProfileDto): Promise<ProductorProfile> {
    const profile = await this.productorprofileModel.create({
      user: new Types.ObjectId(userId),
      ...dto,
    });
    return profile;
  }

  async findByUserId(userId: string): Promise<ProductorProfile | null> {
    return this.productorprofileModel.findOne({ user: new Types.ObjectId(userId) }).populate('user', 'email role').exec();
  }

  async findOrCreateByUserId(userId: string): Promise<ProductorProfile> {
    let profile = await this.findByUserId(userId);
    if (!profile) {
      profile = await this.create(userId, {
        nombreNegocio: 'Negocio Sin Nombre',
        nombreContacto: '',
        telefono: '',
        direccion: '',
        certificaciones: [],
      });
    }
    return profile;
  }

  async findAll(): Promise<ProductorProfile[]> {
    return this.productorprofileModel.find().populate('user', 'email role').exec();
  }

  async update(userId: string, dto: UpdateProductorProfileDto): Promise<ProductorProfile> {
    const profile = await this.productorprofileModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { $set: dto },
      { new: true },
    );
    if (!profile) {
      throw new NotFoundException('Profile no encontrado');
    }
    return profile;
  }

  async delete(userId: string): Promise<void> {
    const result = await this.productorprofileModel.deleteOne({ user: new Types.ObjectId(userId) });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Profile no encontrado');
    }
  }
}
