import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type ProductorProfileDocument = ProductorProfile & Document;

/**
 * ProductorProfile - Profile de negocio para rol PRODUCTOR
 * Siguiendo el patrón DDD: User maneja auth, Profile maneja datos de negocio
 */
@Schema({ timestamps: true })
export class ProductorProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  nombreNegocio: string;

  @Prop({ required: true })
  nombreContacto: string;

  @Prop()
  telefono?: string;

  @Prop()
  direccion?: string;

  @Prop({ type: [String], default: [] })
  certificaciones?: string[];

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  })
  ubicacion?: {
    type: string;
    coordinates: number[];
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductorProfileSchema = SchemaFactory.createForClass(ProductorProfile);

// Indexes para optimizar queries
ProductorProfileSchema.index({ user: 1 });
ProductorProfileSchema.index({ ubicacion: '2dsphere' }, { sparse: true });
