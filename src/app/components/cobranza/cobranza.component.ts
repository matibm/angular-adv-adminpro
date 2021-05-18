import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { ContratoService } from './../../services/contrato.service';
import { Producto } from './../../models/producto';
import { UsuarioService } from './../../services/usuario.service';
import { ProductosService } from './../../services/productos.service';
import { FacturaService } from './../../services/factura.service';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cobranza',
  templateUrl: './cobranza.component.html',
  styleUrls: ['./cobranza.component.css']
})
export class CobranzaComponent implements OnInit {

  constructor(public _facturaService: FacturaService,
    public _usuarioService: UsuarioService,
    public _contratoSerivce: ContratoService,
    public _productoService: ProductosService,
    notifier: NotifierService

  ) {

    this.notifier = notifier;
  }

  private notifier: NotifierService;

  showModal = false
  opciones
  fondo
  fondos
  fechaEmisionStart
  fechaEmisionEnd
  fechaVencimientoStart
  fechaVencimientoEnd
  fechaPagadoStart
  fechaPagadoEnd
  cliente
  clientes
  servicio
  servicios
  facturas
  cobrador
  cobradores
  vendedor
  vendedores
  count
  contratos
  contrato
  facturasAPagar
  facturasAPagarAux = []
  montoTotal = 0
  lista = []
  sort: any
  facturaPdf
  sort_key = 'vencimiento'
  sort_value = 1
  showPDF = false
  estados = [
    {
      id: 1,
      estado: "TODOS",
      color: 'dark'
    },
    {
      id: 2,
      estado: "PAGADOS",
      color: 'dark'
    },
    {
      id: 3,
      estado: "PENDIENTES",
      color: 'danger'
    },
  ]
  filtros = []
  estadoSeleccionado = 'TODOS'

  rangeEmision = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  rangeVencimiento = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  rangePagado = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });


  async ngOnInit() {
    this.observableBuscadores()
    let respF = await this._facturaService.getFacturasOptions(this.opciones)
    this.count = respF.count
    this.facturas = respF.facturas
    console.log(this.facturas);

    this.servicios = await this._productoService.getProductos()
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', '')
  }

  async filtrar() {
    let pagado: boolean = false
    if (this.estadoSeleccionado == 'PAGADOS') {
      pagado = true
    } else if (this.estadoSeleccionado == 'PENDIENTES') {
      pagado = false
    }



    this.opciones = {
      titular: this.cliente ? this.cliente._id : null,
      vendedor: this.vendedor ? this.vendedor._id : null,
      cobrador: this.cobrador ? this.cobrador._id : null,
      servicio: this.servicio ? this.servicio._id : null,
      fondo: this.fondo ? this.fondo._id : null,
      contrato: this.contrato ? this.contrato._id : null,
      pagado: pagado,
      vencimiento_start: this.rangeVencimiento.value.start ? new Date(this.rangeVencimiento.value.start).getTime() : null,
      vencimiento_end: this.rangeVencimiento.value.end ? new Date(this.rangeVencimiento.value.end).setHours(23, 59, 59, 59) : null,
      pagado_start: this.rangePagado.value.start ? new Date(this.rangePagado.value.start).getTime() : null,
      pagado_end: this.rangePagado.value.end ? new Date(this.rangePagado.value.end).setHours(23, 59, 59, 59) : null,
      start: this.rangeEmision.value.start ? new Date(this.rangeEmision.value.start).getTime() : null,
      end: this.rangeEmision.value.end ? new Date(this.rangeEmision.value.end).setHours(23, 59, 59, 59) : null
    }


    console.log(this.opciones);
    this.sort = {
      key: this.sort_key,
      value: this.sort_value
    }
    let respF = await this._facturaService.getFacturasOptions(this.opciones, this.sort)
    this.count = respF.count
    this.facturas = respF.facturas
  }

  seleccionarProducto(producto: Producto) {

    this.servicio = producto;

  }

  async searchClientes(val) {
    if (val.term.length > 0) {
      this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', val.term)
    }
  }

  async searchcobradores(val) {
    if (val.term.length > 0) {
      this.cobradores = await this._usuarioService.buscarUsuarios('COBRADORES', val.term)

    }
  }
  async searchFondos(val) {
    if (val.term.length > 0) {
      this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term)

    }
  }
  async searchvendedores(val) {
    if (val.term.length > 0) {
      this.vendedores = await this._usuarioService.buscarUsuarios('VENDEDORES', val.term)

    }
  }
  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.NOMBRES.toLowerCase().indexOf(term) > -1 ||
      item.APELLIDOS.toLowerCase().includes(term) ||
      item.RAZON.toLowerCase().includes(term) ||
      item.RUC.toLowerCase().includes(term);
  }

  async onSelectClient(cliente) {
    this.nombreFactura = `${cliente.NOMBRES} ${cliente.APELLIDOS}`
    this.rucFactura = cliente.RUC
    this.telFactura = cliente.TELEFONO1
    this.direccionFactura = cliente.DIRECCION
    this.contratos = await this._contratoSerivce.getContratosByTitular(cliente._id)

    console.log(this.contratos);
    this.filtrar()

  }

  onContratoSelected(contrato) {
    this.contrato = contrato
    console.log(contrato);
    this.filtrar()
  }


  async getFacturasApagar(id, monto) {
    if (monto < 1) {
      return
    }
    this.facturasAPagar = await this._facturaService.pagarPorMonto({ lista: [{ contrato: id, monto: parseInt(monto) }] })
  }

  async searchBancos(val) {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term)
  }
  async agregarIngreso(id, monto) {
    this.facturasAPagar = null;
    this.montoTotal += parseInt(monto)
    let obj = {
      contrato: id,
      monto: monto
    }
    this.lista.push(obj)
    // this.filtros.push()
    this.facturasAPagarAux = await this._facturaService.pagarPorMonto({ lista: this.lista })
    this.contrato = null
    this.filtrar()
    this.facturaPdf = this.crearPDF(this.facturasAPagarAux)

  }
  async confirmarPago() {
    await this._facturaService.pagarPorMonto({
      lista: this.lista,
      montoTotal: this.montoTotal,
      cliente: this.cliente._id,
      cobrador: this.cobrador?._id,
      confirmado: true,
      fondo: this.fondo._id,
      nro_timbrado: '144542331',
      nro_factura: '4544352',
      numero: '002-004'
    })
    this.ngOnInit()
    this.contrato = null;
    this.facturasAPagar = null
  }



  prueba() {
    console.log(this.notifier.getConfig());

    this.notifier.notify('success', 'pasa la edad')
  }


  inputClientes = new Subject<string>();
  inputCobrador = new Subject<string>();
  loadingClientes = false;
  loadingCobrador = false;
  observableBuscadores() {
    this.inputClientes.pipe(debounceTime(200), distinctUntilChanged()).subscribe(async (txt) => {
      if (!txt) {
        return
      }
      this.loadingClientes = true
      this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', txt)
      this.loadingClientes = false
    });

    this.inputCobrador.pipe(debounceTime(200), distinctUntilChanged()).subscribe(async (txt) => {
      if (!txt) {
        return
      }
      this.loadingCobrador = true
      this.cobradores = await this._usuarioService.buscarUsuarios('COBRADORES', txt)
      this.loadingCobrador = false
    });
  }

  reset() {
    this.contrato = null
    this.lista = []
    this.montoTotal = 0
    this.facturasAPagar = null
    this.cliente = null
    this.ngOnInit()
  }

  async crearPDF(facturas) {
    let servicios = []
    let contratosSinRepetir = []
    let fsinrepetir = []
     
    for (let i = 0; i < facturas.length; i++) {
      const factura = facturas[i];
      let existe = false

      for (let m = 0; m < fsinrepetir.length; m++) {
        const element = fsinrepetir[m];
        if (element.contrato == factura.contrato && element.haber === factura.haber) {
          element.cantidad++
          element.precio += factura.haber
          element.diezPorciento += factura.haber * 0.1
          existe = true
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
          diezPorciento: factura.haber * 0.1
        })
      }

      // if (contratosSinRepetir.includes(factura.contrato) && !factura.parcial) {
      //   for (let j = 0; j < servicios.length; j++) {
      //     const element = servicios[j];
      //     element.cantidad++
      //     element.precio += factura.haber
      //     element.diezPorciento += factura.haber * 0.1
      //   }
      // } else {
      //   servicios.push({
      //     contrato: factura.contrato,
      //     cantidad: 1,
      //     concepto: `${factura.servicio.NOMBRE}`,
      //     precioUnitario: factura.precio_unitario ? factura.precio_unitario : factura.haber,
      //     precio: factura.haber,
      //     cincoPorciento: null,
      //     diezPorciento: factura.haber * 0.1
      //   })
      //   contratosSinRepetir.push(factura.contrato)
      // }
      servicios = fsinrepetir
    }
    let facturaPDF = {
      nombres: this.nombreFactura,
      fecha: Date.now(),
      direccion: this.direccionFactura,
      ruc: this.rucFactura,
      tel: this.telFactura,
      notaDeRemision: '123123',
      servicios: servicios
    }
    console.log("-----------------------------------------------");
    console.log(facturaPDF);
    
    return facturaPDF
  }

  nombreFactura
  rucFactura
  telFactura
  direccionFactura

}
