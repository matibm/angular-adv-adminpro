import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contrato } from 'src/app/models/contrato';
import { FacturaService } from 'src/app/services/factura.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as QRCode from 'qr-image';

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
  // timbrado;


  async ngOnInit() {

  }
  pago;

  get getTotalIVA() {
    let total = 0;
    for (let index = 0; index < this.factura.data.items.length; index++) {
      const item = this.factura.data.items[index];
      total += (item.cantidad * item.precioUnitario) / 11;
    }
    return total;
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
