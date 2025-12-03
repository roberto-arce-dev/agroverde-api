import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductoAgricolaService } from './productoagricola.service';
import { ProductoAgricolaController } from './productoagricola.controller';
import { UploadModule } from '../upload/upload.module';
import { ProductorProfileModule } from '../productor-profile/productor-profile.module';
import { ProductoAgricola, ProductoAgricolaSchema } from './schemas/productoagricola.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProductoAgricola.name, schema: ProductoAgricolaSchema }]),
    UploadModule,
    ProductorProfileModule,
  ],
  controllers: [ProductoAgricolaController],
  providers: [ProductoAgricolaService],
  exports: [ProductoAgricolaService],
})
export class ProductoAgricolaModule {}
