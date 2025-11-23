import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RutaEntregaService } from './rutaentrega.service';
import { RutaEntregaController } from './rutaentrega.controller';
import { UploadModule } from '../upload/upload.module';
import { RutaEntrega, RutaEntregaSchema } from './schemas/rutaentrega.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RutaEntrega.name, schema: RutaEntregaSchema }]),
    UploadModule,
  ],
  controllers: [RutaEntregaController],
  providers: [RutaEntregaService],
  exports: [RutaEntregaService],
})
export class RutaEntregaModule {}
