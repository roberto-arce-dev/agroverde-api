import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Pedido, PedidoDocument } from './schemas/pedido.schema';
import { ClienteProfileService } from '../cliente-profile/cliente-profile.service';
import { ProductoAgricolaService } from '../productoagricola/productoagricola.service';

@Injectable()
export class PedidoService {
  constructor(
    @InjectModel(Pedido.name) private pedidoModel: Model<PedidoDocument>,
    private clienteProfileService: ClienteProfileService,
    private productoAgricolaService: ProductoAgricolaService,
  ) {}

  async create(createPedidoDto: CreatePedidoDto, userId: string): Promise<Pedido> {
    let clienteId: string;

    // 1. Determinar el cliente
    if (createPedidoDto.cliente) {
      clienteId = createPedidoDto.cliente;
    } else {
      const clienteProfile = await this.clienteProfileService.findByUserId(userId);
      clienteId = (clienteProfile as any)._id.toString();
    }

    // 2. Calcular total y verificar productos
    const itemsConPrecio = await Promise.all(
      createPedidoDto.items.map(async (item) => {
        const producto = await this.productoAgricolaService.findOne(item.producto);
        return {
          producto: new Types.ObjectId(item.producto),
          cantidad: item.cantidad,
          precio: producto.precio,
        };
      })
    );

    const total = itemsConPrecio.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    // 3. Crear el pedido
    const nuevoPedido = await this.pedidoModel.create({
      ...createPedidoDto,
      cliente: new Types.ObjectId(clienteId),
      items: itemsConPrecio,
      total,
      ruta: createPedidoDto.ruta ? new Types.ObjectId(createPedidoDto.ruta) : undefined,
    });

    return nuevoPedido;
  }

  async findAll(): Promise<Pedido[]> {
    const pedidos = await this.pedidoModel.find()
      .populate('cliente', 'nombre email telefono')
      .populate('ruta', 'nombre zonas horarios');
    return pedidos;
  }

  async findOne(id: string | number): Promise<Pedido> {
    const pedido = await this.pedidoModel.findById(id)
      .populate('cliente', 'nombre email telefono')
      .populate('items.producto', 'nombre descripcion precio')
      .populate('ruta', 'nombre zonas horarios');
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return pedido;
  }

  async findMyPedidos(userId: string): Promise<Pedido[]> {
    const clienteProfile = await this.clienteProfileService.findByUserId(userId);
    const clienteId = (clienteProfile as any)._id.toString();
    return this.pedidoModel.find({ cliente: new Types.ObjectId(clienteId) })
      .populate('items.producto', 'nombre descripcion precio')
      .populate('ruta', 'nombre zonas horarios')
      .sort({ createdAt: -1 });
  }

  async update(id: string | number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.pedidoModel.findByIdAndUpdate(id, updatePedidoDto, { new: true })
      .populate('cliente', 'nombre email telefono')
      .populate('ruta', 'nombre zonas horarios');
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return pedido;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.pedidoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
  }
}
