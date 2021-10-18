import { Producto } from "./producto";

export class Inhumado {
    constructor(

      public nombre: string,
      public fecha_fallecimiento?: string,
      public fecha_inhumacion?: string,
      public ci?: string,
      public nro?: string,
      public producto?: Producto
    ) {

    }
}
