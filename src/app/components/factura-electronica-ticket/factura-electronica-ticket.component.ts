import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contrato } from 'src/app/models/contrato';
import { FacturaService } from 'src/app/services/factura.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-factura-electronica-ticket',
  templateUrl: './factura-electronica-ticket.component.html',
  styleUrls: ['./factura-electronica-ticket.component.css'],
})
export class FacturaElectronicaTicketComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public _facturaService: FacturaService,
    private _userService: UsuarioService,
  ) {}

  total = 0;
  totalIva = 0;
  factura;
  @Input() facturaPDF;
  @Input() printAltoke = true;
  @Input() existe = true;

  totalTexto = '';
  @Input() contrato: Contrato;
  tipo_contrato = '';
  id;
  nro_factura;
  nro_talonario;
  items: any[] = [];
  qrData: string;
  qrCodeImage: string;
  pago: any;

  // timbrado;
  cdc = ''
  async ngOnInit() {
    const id = this.route.snapshot.params.id;
    const pagoresp = await this._facturaService.getDetallePago(id);
    this.pago = pagoresp.pago;
 
    const resp: any = await this._facturaService.getTicketKUDE(id);
    console.log(resp);
    this.qrData = resp.pdfExists.qr_link
    this.factura = resp.pdfExists.invoice
    this.cdc = resp.pdfExists.cdc.match(/.{1,4}/g).join(' ');
 
    setTimeout(() => {
      window.print();
    }, 500);
  }

  get getTotalIVA() {
    // Calcular el IVA solo para items no exentos (ivaTipo !== 3)
    let totalGravado = 0;
    for (let index = 0; index < this.factura.data.items.length; index++) {
      const item = this.factura.data.items[index];
      if (item.ivaTipo !== 3) {
        totalGravado += item.cantidad * item.precioUnitario;
      }
    }
    // Calcular el IVA como el total gravado dividido por 11, redondeado a número entero
    return Math.round(totalGravado / 11);
  }

  get getTotalExento() {
    let total = 0;
    for (let index = 0; index < this.factura.data.items.length; index++) {
      const item = this.factura.data.items[index];
      // Sumar solo items exentos (ivaTipo === 3)
      if (item.ivaTipo === 3) {
        total += item.cantidad * item.precioUnitario;
      }
    }
    return total;
  }

  get getTotalGravado() {
    let total = 0;
    for (let index = 0; index < this.factura.data.items.length; index++) {
      const item = this.factura.data.items[index];
      // Sumar solo items gravados (ivaTipo !== 3)
      if (item.ivaTipo !== 3) {
        total += item.cantidad * item.precioUnitario;
      }
    }
    return total;
  }

  get isExenta() {
    // Verificar si todos los items son exentos
    return this.factura?.data?.items?.every(item => item.ivaTipo === 3) || false;
  }

  get getTotal() {
    let total = 0;
    for (let index = 0; index < this.factura.data.items.length; index++) {
      const item = this.factura.data.items[index];
      total += item.cantidad * item.precioUnitario;
    }
    return total;
  }
}
