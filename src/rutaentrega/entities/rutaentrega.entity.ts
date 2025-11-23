export class RutaEntrega {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<RutaEntrega>) {
    Object.assign(this, partial);
  }
}
