import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductoAgricolaDocument = ProductoAgricola & Document;

@Schema({ timestamps: true })
export class ProductoAgricola {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: Types.ObjectId, ref: 'Productor', required: true })
  productor: Types.ObjectId;

  @Prop({ enum: ['frutas', 'verduras', 'hortalizas', 'legumbres'], default: 'verduras' })
  categoria?: string;

  @Prop({ min: 0 })
  precioKg: number;

  @Prop({ default: 0, min: 0 })
  stockKg?: number;

  @Prop({ default: false })
  organico?: boolean;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const ProductoAgricolaSchema = SchemaFactory.createForClass(ProductoAgricola);

ProductoAgricolaSchema.index({ productor: 1 });
ProductoAgricolaSchema.index({ categoria: 1 });
ProductoAgricolaSchema.index({ organico: 1 });
