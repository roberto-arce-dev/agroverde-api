import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RutaEntregaDocument = RutaEntrega & Document;

@Schema({ timestamps: true })
export class RutaEntrega {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: [String], default: [] })
  zonas?: any;

  @Prop()
  vehiculo?: string;

  @Prop({ default: 0, min: 0 })
  capacidadKg?: number;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const RutaEntregaSchema = SchemaFactory.createForClass(RutaEntrega);

RutaEntregaSchema.index({ nombre: 1 });
