import { Usuario } from './../../models/usuario';
import { UsuarioService } from './../../services/usuario.service';
import { Factura } from '../../models/factura';
import { FacturaService } from '../../services/factura.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CuotaService } from '../../services/cuota.service';
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
    public _cuotaService: CuotaService,
    public _facturaService: FacturaService,
    public _usuarioService: UsuarioService,
    public router: Router,

  ) { }
  fondo: Usuario;
  fondos: Usuario[];
  id;
  factura: Factura;
  crearParcial = false;
  primeraEjecucion = true;
  montoparcial = 0;
  montoparcialCorrecto = true;
  parciales: Factura[];
  facturaPdf;
  isOnline = false;
  facturapdf
  async ngOnInit() {
    if (this.primeraEjecucion) {
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
        this.ngOnInit();

      });
      this.primeraEjecucion = false;
    }


    this.id = this.route.snapshot.paramMap.get('id');

    await this.initialize();
    this.facturaPdf = {
      nombres: `${this.factura.titular.NOMBRES} ${this.factura.titular.APELLIDOS}`,
      fecha: this.factura.fecha_pagado_unix,
      direccion: `${this.factura.titular.direccion_particular}`,
      ruc: this.factura.titular.RUC,
      tel: this.factura.titular.TELEFONO1,
      notaDeRemision: '123123',
      servicios: [
        {
          cantidad: 1,
          concepto: this.factura.servicio.NOMBRE,
          precioUnitario: this.factura.haber,
          cincoPorciento: null,
          diezPorciento: this.factura.haber / 11,
        }
      ]
    };
  }

  async initialize() {
    this.fondo = null;

    if (this.id) {
      this.factura = await this._facturaService.getFacturaById(this.id);
      this.parciales = (await this._facturaService.getFacturasParcial(this.id)).facturas;
      if (this.factura.fondo) {
        this.fondo = this.factura.fondo;
      }
      console.log(this.factura);

      this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', '');

    }
  }
  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.NOMBRES.toLowerCase().indexOf(term) > -1 ||
      item.APELLIDOS.toLowerCase().includes(term) ||
      item.RAZON.toLowerCase().includes(term) ||
      item.RUC.toLowerCase().includes(term);
  }

  async pagar() {
    const any: any = this.factura;
    const factura: Factura = any;
    factura.fondo = this.fondo;
    if (this.crearParcial && this.montoparcial > 0) {
      await this._facturaService.pagarFactura(factura, true, this.montoparcial);
    } else {
      await this._facturaService.pagarFactura(factura);

    }
  }
  async searchBancos(val) {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term);
  }

  verificarMontoParcial(monto) {
    if (monto > this.factura.haber && monto > 0) {
      this.montoparcialCorrecto = false;
    } else {
      this.montoparcialCorrecto = true;

    }
  }

  printFactura() {
    const wopen = window.open('/factura-pdf/' + this.id);
    wopen.onafterprint = (event) => {
      wopen.close();
    };
  }

  async crearLink(){
    this.factura = await this._facturaService.crearLinkDePago(this.id, this.fondo._id);
    this.fondo = this.factura.fondo;
  }

  onSelectFondo() {
    console.log(this.fondo);

    this.isOnline = this.fondo.fondo_online == '1' ? true : false;
  }


  async mostrarModal(id) {
    const resp = await this._facturaService.getDetallePago(id);

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
      activo: pago.activo,
      nombres: `${pago.cliente.NOMBRES} ${pago.cliente.APELLIDOS}`,
      fecha: pago.fecha_creacion,
      direccion: `direccion de prueba`,
      ruc: pago.cliente.RUC,
      tel: pago.cliente.TELEFONO1,
      notaDeRemision: '123123',
      servicios
    };
    console.log(this.facturapdf);

  }

}
