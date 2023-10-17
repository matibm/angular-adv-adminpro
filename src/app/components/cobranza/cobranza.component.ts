import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { ContratoService } from './../../services/contrato.service';
import { Producto } from './../../models/producto';
import { UsuarioService } from './../../services/usuario.service';
import { ProductosService } from './../../services/productos.service';
import { FacturaService } from './../../services/factura.service';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Subject } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cobranza',
  templateUrl: './cobranza.component.html',
  styleUrls: ['./cobranza.component.css'],
})
export class CobranzaComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    public _facturaService: FacturaService,
    public _usuarioService: UsuarioService,
    public _contratoSerivce: ContratoService,
    public _productoService: ProductosService,
    notifier: NotifierService,
    public _userService: UsuarioService,
    private router: Router,
    private currency: CurrencyPipe,
  ) {
    this.notifier = notifier;
  }
  ngOnDestroy(): void {
    this.inputClientes.unsubscribe();
    this.inputCobrador.unsubscribe();
  }
  private notifier: NotifierService;
  @ViewChild('search', { static: false }) searchCliente;
  @ViewChild('btnContinuar', { static: false }) btnContinuar;
  ngAfterViewInit() {
    ////console.log(!this._userService.usuario.timbrado.timbrado , this._userService.usuario.role == 'USER_ROLE');

    if (
      !this._userService.usuario.timbrado.timbrado &&
      this._userService.usuario.role == 'USER_ROLE'
    ) {
      swal
        .fire({
          icon: 'warning',
          title: 'No existe timbrado',
          text: `Tu usuario no tiene Nro de Timbrado`,
          confirmButtonText: `Establecer Timbrado`,
          willClose: (e) => {
            this.modalOutput();
          },
        })
        .then(
          (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.goBack = false;
            }
          },
          (op) => {
            ////console.log(op);
          },
        );
    }

    this.searchCliente.focus();
  }
  goBack = true;
  modalOutput() {
    setTimeout(() => {
      if (!this.goBack) {
        this.router.navigateByUrl(
          `/admin/usuario/${this._usuarioService.user_id}`,
        );
      } else {
        window.history.back();
      }
    }, 1);
  }
  showModal = false;
  opciones;
  fondo;
  fondos;
  fechaEmisionStart;
  fechaEmisionEnd;
  fechaVencimientoStart;
  fechaVencimientoEnd;
  fechaPagadoStart;
  fechaPagadoEnd;
  cliente;
  clientes;
  servicio;
  // servicios;
  facturas;
  cobrador: Usuario;
  cobradores;
  vendedor;
  vendedores;
  count;
  contratos;
  contrato;
  facturasAPagar;
  facturasAPagarAux = [];
  montoTotal = 0;
  lista = [];
  sort: any;
  facturaPdf;
  sort_key = 'vencimiento';
  sort_value = 1;
  showPDF = false;
  comentario;
  estados = [
    {
      id: 1,
      estado: 'TODOS',
      color: 'dark',
    },
    {
      id: 2,
      estado: 'PAGADOS',
      color: 'dark',
    },
    {
      id: 3,
      estado: 'PENDIENTES',
      color: 'danger',
    },
  ];
  filtros = [];
  estadoSeleccionado = 'TODOS';

  rangeEmision = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  rangeVencimiento = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  rangePagado = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  loadingConfirmarPago = false;
  inputClientes = new Subject<string>();
  inputCobrador = new Subject<string>();
  loadingClientes = false;
  loadingCobrador = false;

  nombreFactura;
  rucFactura;
  telFactura;
  direccionFactura;
  fechaPago = new Date(
    `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()} 00:00`,
  );
  pruebaValue(variable) {
    ////console.log(getComputedStyle(variable).width);
  }
  async ngOnInit() {
    ////console.log(!this._userService.usuario?.timbrado?.timbrado , this._userService?.usuario?.role == 'USER_ROLE');
    ////console.log(this._userService?.usuario?.role);
    if (this._userService?.usuario?.role == 'USER_ROLE') {
      this.cobrador = await this._userService.inicializarUsuario();
    }
    //   this.inputClientes = new Subject<string>();
    // this.inputCobrador = new Subject<string>();
    this.observableBuscadores();

    // this.servicios = await this._productoService.getProductos();
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', '');
  }

  async filtrar() {
    let pagado = false;
    if (this.estadoSeleccionado == 'PAGADOS') {
      pagado = true;
    } else if (this.estadoSeleccionado == 'PENDIENTES') {
      pagado = false;
    }

    this.opciones = {
      titular: this.cliente ? this.cliente._id : null,
      vendedor: this.vendedor ? this.vendedor._id : null,
      // cobrador: this.cobrador ? this.cobrador._id : null,
      servicio: this.servicio ? this.servicio._id : null,
      fondo: this.fondo ? this.fondo._id : null,
      contrato: this.contrato ? this.contrato._id : null,
      // sin_contrato: "1",
      pagado,
      vencimiento_start: this.rangeVencimiento.value.start
        ? new Date(this.rangeVencimiento.value.start).getTime()
        : null,
      vencimiento_end: this.rangeVencimiento.value.end
        ? new Date(this.rangeVencimiento.value.end).setHours(23, 59, 59, 59)
        : null,
      pagado_start: this.rangePagado.value.start
        ? new Date(this.rangePagado.value.start).getTime()
        : null,
      pagado_end: this.rangePagado.value.end
        ? new Date(this.rangePagado.value.end).setHours(23, 59, 59, 59)
        : null,
      start: this.rangeEmision.value.start
        ? new Date(this.rangeEmision.value.start).getTime()
        : null,
      end: this.rangeEmision.value.end
        ? new Date(this.rangeEmision.value.end).setHours(23, 59, 59, 59)
        : null,
    };

    ////console.log(this.opciones);
    this.sort = {
      key: this.sort_key,
      value: this.sort_value,
    };
    const respF = await this._facturaService.getFacturasOptions(
      this.opciones,
      this.sort,
    );
    this.count = respF.count;
    console.log(respF);

    this.facturas = respF.facturas;
  }

  seleccionarProducto(producto: Producto) {
    this.servicio = producto;
  }

  async searchClientes(val) {
    if (val.term.length > 0) {
      this.clientes = await this._usuarioService.buscarUsuarios(
        'CLIENTES',
        val.term,
      );
    }
  }

  async searchcobradores(val) {
    if (val.term.length > 0) {
      this.cobradores = await this._usuarioService.buscarUsuarios(
        'COBRADORES',
        val.term,
      );
    }
  }
  async searchFondos(val) {
    if (val.term.length > 0) {
      this.fondos = await this._usuarioService.buscarUsuarios(
        'BANCOS',
        val.term,
      );
    }
  }
  async searchvendedores(val) {
    if (val.term.length > 0) {
      this.vendedores = await this._usuarioService.buscarUsuarios(
        'VENDEDORES',
        val.term,
      );
    }
  }
  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return (
      item.NOMBRES.toLowerCase().indexOf(term) > -1 ||
      item.APELLIDOS.toLowerCase().includes(term) ||
      item.RAZON.toLowerCase().includes(term) ||
      item.RUC.toLowerCase().includes(term)
    );
  }

  async onSelectClient(cliente) {
    this.nombreFactura = `${cliente.NOMBRES} ${cliente.APELLIDOS}`;
    this.rucFactura = cliente.RUC;
    this.telFactura = cliente.TELEFONO1;
    this.direccionFactura = cliente.DIRECCION;
    this.contratos = await this._contratoSerivce.getContratosByTitular(
      cliente._id,
    );

    ////console.log(this.contratos);
    this.filtrar();
  }

  onContratoSelected(contrato) {
    this.contrato = contrato;
    ////console.log(contrato);
    this.filtrar();
  }

  async getFacturasApagar(id, monto) {
    if (monto < 1) {
      return;
    }
    //console.log(this.lista);

    let resp = await this._facturaService.pagarPorMonto({
      fecha_pago: this.fechaPago.getTime(),
      lista: [{ contrato: id, monto: parseInt(monto) }],
    });
    this.facturasAPagar = resp.facturas;
    //console.log(this.facturasAPagar);
    if (monto > resp.monto_total) {
      swal.fire({
        title: 'Monto ingresado es superior a la deuda',
        text: `Monto ingresado: ${this.currency.transform(monto, '', '', '2.0')}
         Monto de la deuda pendiente: ${this.currency.transform(
           resp.monto_total,
           '',
           '',
           '2.0',
         )}`,
        icon: 'info',
        showConfirmButton: true,
      });
    }
    this.montoTotal = resp.monto_total;

    let btnContinuar = document.getElementById('btnContinuar');
    btnContinuar.focus();
  }

  async searchBancos(val) {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term);
  }
  sumaTotal = 0;
  async agregarIngreso(id, monto) {
    // this.facturas = null
    this.sumaTotal += this.montoTotal;
    this.facturasAPagar = null;
    // this.montoTotal += parseInt(monto);
    const obj = {
      contrato: id,
      monto: this.montoTotal,
    };
    this.lista.push(obj);
    // this.filtros.push()
    this.facturasAPagarAux = [
      ...this.facturasAPagarAux,
      ...(
        await this._facturaService.pagarPorMonto({
          fecha_pago: this.fechaPago.getTime(),
          lista: this.lista,
        })
      ).facturas,
    ];
    ////console.log(this.facturasAPagarAux);
    this.contrato = null;
    this.filtrar();
    this.facturaPdf = this.crearPDF(this.facturasAPagarAux);

  }
  confirmarPago() {
    swal
      .fire({
        icon: 'warning',
        title:
          'Confirmar Cobro con Fecha de ' +
          new Date(this.fechaPago).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
          }) +
          ' ?',
        // text: `Tu usuario no tiene Nro de Timbrado`,
        confirmButtonText: `Confirmar`,
        cancelButtonText: `Cancelar`,
        showCancelButton: true,
        willClose: (e) => {
          //  this.modalOutput()
        },
      })
      .then(
        (result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.confirmarPagoConfirmado();
          }
        },
        (op) => {
          //console.log(op);
        },
      );
  }

  /**
   * Confirms the payment and performs necessary actions after the payment is confirmed.
   *
   * @return {Promise<void>} The promise that resolves after the payment is confirmed.
   */
  async confirmarPagoConfirmado() {
    if (this.loadingConfirmarPago) return;
    this.loadingConfirmarPago = true;

    let timbrado = this.cobrador.timbrado;

    let pagoresp = await this._facturaService.pagarPorMonto({
      fecha_pago: this.fechaPago.getTime(),
      lista: this.lista,
      montoTotal: this.sumaTotal,
      cliente: this.cliente._id,
      comentario: this.comentario,
      nombre: this.nombreFactura,
      ruc: this.rucFactura,
      tel: this.telFactura,
      direccion: this.direccionFactura,
      cobrador: this.cobrador?._id,
      confirmado: true,
      fondo: this.fondo._id,
      nro_timbrado: this.cobrador.timbrado.timbrado,
      nro_factura: this.cobrador.nro_factura_actual + 1,
      numero: this.cobrador.nro_talonario,
      timbrado,
      selectedItems: (this.facturasAPagarAux.filter((f) => f.is_selected) || []).map((f) => {
        return f._id
      })
    });
    this.loadingConfirmarPago = false;

    ////console.log(pagoresp);
    this.mostrarModal(pagoresp?.pago?._id);
    this.ngOnInit();

    this.reset();
  }

  prueba() {
    ////console.log(this.notifier.getConfig());

    this.notifier.notify('success', 'pasa la edad');
  }
  observableBuscadores() {
    this.inputClientes
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingClientes = true;
        this.clientes = await this._usuarioService.buscarUsuarios(
          'CLIENTES',
          txt,
        );
        this.loadingClientes = false;
      });

    this.inputCobrador
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingCobrador = true;
        this.cobradores = await this._usuarioService.buscarUsuarios(
          'COBRADORES',
          txt,
        );
        this.loadingCobrador = false;
      });
  }

  reset() {
    this.contrato = null;
    this.cobrador = null;
    this.cobradores = null;
    this.fondos = null;
    this.facturaPdf = null;
    this.contrato = null;
    this.facturasAPagar = null;
    this.facturasAPagarAux = [];
    this.clientes = [];
    this.cliente = null;
    this.lista = [];
    this.fondo = null;
    this.cobrador = null;
    this.lista = [];
    this.montoTotal = 0;
    this.facturasAPagar = null;
    this.cliente = null;
    this.comentario = null;
    this.sumaTotal = 0;
    this.ngOnInit();
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
        if (
          element.contrato == factura.contrato &&
          element.haber === factura.haber
        ) {
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
          precioUnitario: factura.precio_unitario
            ? factura.precio_unitario
            : factura.haber,
          precio: factura.haber,
          cincoPorciento: null,
          haber: factura.haber,
          diezPorciento: factura.haber / 11,
        });
      }

      servicios = fsinrepetir;
    }
    // let timbrado = (await this._userService.getConfigurations({ type: 'TIMBRADO' }))[0].body

    const facturaPDF = {
      nombres: this.nombreFactura,
      fecha: this.fechaPago.getTime(),
      direccion: this.direccionFactura,
      ruc: this.rucFactura,
      tel: this.telFactura,
      notaDeRemision: '123123',
      servicios,
      numero: this.cobrador.nro_talonario,
      nro_factura: this.cobrador.nro_factura_actual + 1,
      timbrado: this.cobrador.timbrado,
      comentario: this.comentario,
    };
    ////console.log('-----------------------------------------------');
    ////console.log(facturaPDF);

    return facturaPDF;
  }
  facturapdf;
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
        diezPorciento: factura.haber / 11,
      });
    }
    // let timbrado = (await this._userService.getConfigurations({ type: 'TIMBRADO' }))[0].body

    this.facturapdf = {
      _id: pago._id,
      nombres: `${pago.cliente.NOMBRES} ${pago.cliente.APELLIDOS}`,
      fecha: pago.fecha_creacion,
      direccion: `direccion de prueba`,
      ruc: pago.cliente.RUC,
      tel: pago.cliente.TELEFONO1,
      notaDeRemision: '123123',
      servicios,
      timbrado: pago.timbrado,
    };
    ////console.log(this.facturapdf);
  }

  onSelectedItem(item: any) {
    console.log(item);
    this.facturasAPagarAux.push({...item, is_selected: true});
    this.sumaTotal = this.facturasAPagarAux.reduce((a, b) => a + b.haber, 0);
  }
}
