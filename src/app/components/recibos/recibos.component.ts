import { Component, OnInit } from '@angular/core';
import { FacturaService } from 'src/app/services/factura.service';

@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.component.html',
  styleUrls: ['./recibos.component.css']
})
export class RecibosComponent implements OnInit {
  items: any[] = []
  reciboSeleccionado: any
  facturas: any[] = []
  facturasOptions: any
  facturapdf:any
  constructor(
    private readonly recibosService: FacturaService
  ) { }

  async ngOnInit() {
    const recibos:any = await this.recibosService.getRecibos()
    this.items = recibos.recibos
    console.log(recibos);
  }

  async verCuotas(item) {
    this.facturasOptions = {
      tipo_factura: 'CREDITO',
      pago: item.pago?._id
    }
    const facturas = await this.recibosService.getFacturasOptions(this.facturasOptions)
    console.log(facturas);
    this.facturas = facturas.facturas
    this.reciboSeleccionado = item

  }

  async mostrarModal(id) {
    const resp = await this.recibosService.getDetallePago(id);
    console.log(resp);

    const pago = resp.pago;
    const facturas = resp.facturas;
    const servicios = [];
    for (let i = 0; i < facturas.length; i++) {
      const factura = facturas[i];
      servicios.push({
        cantidad: 1,
        concepto: factura.servicio.NOMBRE,
        precioUnitario: factura.haber,
        cincoPorciento: null,
        diezPorciento: factura.haber / 11
      });
    }
    this.facturapdf = {
      _id: pago._id,
      comentario: pago.comentario,
      activo: pago.activo,
      nombres: `${pago.cliente.NOMBRES} ${pago.cliente.APELLIDOS}`,
      fecha: pago.fecha_creacion,
      direccion: `direccion de prueba`,
      ruc: pago.cliente.RUC,
      tel: pago.cliente.TELEFONO1,
      notaDeRemision: '123123',
      servicios,
      nro_talonario: 'tukii',
      nro_factura: 'tuki'
    };
    console.log(this.facturapdf);

  }

}
