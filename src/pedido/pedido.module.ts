import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { UploadModule } from '../upload/upload.module';
import { Pedido, PedidoSchema } from './schemas/pedido.schema';
import { ClienteProfileModule } from '../cliente-profile/cliente-profile.module';
import { ProductoAgricolaModule } from '../productoagricola/productoagricola.module';
import { RutaEntregaModule } from '../rutaentrega/rutaentrega.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pedido.name, schema: PedidoSchema }]),
    UploadModule,
    ClienteProfileModule,
    ProductoAgricolaModule,
    RutaEntregaModule,
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
})
export class PedidoModule {}
