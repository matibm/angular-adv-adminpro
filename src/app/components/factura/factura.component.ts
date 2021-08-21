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
  nombreFactura;
  rucFactura;
  telFactura;
  fechaPago = new Date()
  direccionFactura;
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
      fecha: this.fechaPago.getTime(),
      direccion: `${this.factura.titular.direccion_particular}`,
      ruc: this.factura.titular.RUC,
      tel: this.factura.titular.TELEFONO1,
      notaDeRemision: '123123',
      nro_factura: this.factura.cobrador.nro_factura_actual,
      numero: this.factura.cobrador.nro_talonario,
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

    console.log(this.factura);


    this.nombreFactura = `${this.factura.titular.NOMBRES} ${this.factura.titular.APELLIDOS}`;
    this.rucFactura = this.factura.titular.RUC;
    this.telFactura = this.factura.titular.TELEFONO1;
    this.direccionFactura = this.factura.titular.DIRECCION;
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
    let id 

    if (this.crearParcial && this.montoparcial > 0) {
      let body = {
        factura,
        fecha_pago: this.fechaPago,
        comentario: '',
        nombre: this.nombreFactura,
        ruc: this.rucFactura,
        tel: this.telFactura,
        direccion: this.direccionFactura,
        nro_timbrado: Date.now(),
        nro_factura: this.factura.cobrador.nro_factura_actual + 1,
        nro_talonario: this.factura.cobrador.nro_talonario,
      }
     let data = await this._facturaService.pagarFactura(body, true, this.montoparcial);
    console.log(data);

     id = data.pago

    } else {
      let body = {
        factura,
        fecha_pago: this.fechaPago,
        comentario: '',
        nombre: this.nombreFactura,
        ruc: this.rucFactura,
        tel: this.telFactura,
        direccion: this.direccionFactura,
        nro_timbrado: Date.now(),
        nro_factura: this.factura.cobrador.nro_factura_actual + 1,
        nro_talonario: this.factura.cobrador.nro_talonario,
      }
      let data = await this._facturaService.pagarFactura(body)
      id = data.pago
    }
    
    if (id) {
      this.mostrarModal(id)
    }


this.ngOnInit()
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

  async crearLink() {
    this.factura = await this._facturaService.crearLinkDePago(this.id, this.fondo._id);
    this.fondo = this.factura.fondo;
  }

  onSelectFondo() {
    console.log(this.fondo);

    this.isOnline = this.fondo.fondo_online == '1' ? true : false;
  }


  async mostrarModal(id) {
    const resp = await this._facturaService.getDetallePago(id);
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




  async crearPDF(facturas) {
    let servicios = [];
    const contratosSinRepetir = [];
    const fsinrepetir = [];

    for (let i = 0; i < facturas.length; i++) {
      const factura = facturas[i];
      let existe = false;

      for (let m = 0; m < fsinrepetir.length; m++) {
        const element = fsinrepetir[m];
        if (element.contrato == factura.contrato && element.haber === factura.haber) {
          element.cantidad++;
          element.precio += factura.haber;
          element.diezPorciento += factura.haber / 11;
          existe = true;
        }
      }
      if (!existe) {
        fsinrepetir.push({
          contrato: factura.contrato,
          cantidad: 1,
          concepto: `${factura.servicio.NOMBRE}`,
          precioUnitario: factura.precio_unitario ? factura.precio_unitario : factura.haber,
          precio: factura.haber,
          cincoPorciento: null,
          haber: factura.haber,
          diezPorciento: factura.haber / 11
        });
      }
 
      servicios = fsinrepetir;
    }
    const facturaPDF = {
      nombres: this.nombreFactura,
      fecha: Date.now(),
      direccion: this.direccionFactura,
      ruc: this.rucFactura,
      tel: this.telFactura,
      notaDeRemision: '123123',
      servicios,
      numero: this.factura.cobrador.nro_talonario,
      nro_factura: this.factura.cobrador.nro_factura_actual +1
    };
    console.log('-----------------------------------------------');
    console.log(facturaPDF);

    return facturaPDF;
  }





}
