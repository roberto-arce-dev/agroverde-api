export class ProductoAgricola {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ProductoAgricola>) {
    Object.assign(this, partial);
  }
}
