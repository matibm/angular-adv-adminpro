import { EdadPipe } from './../../pipes/edad.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { Inhumado } from './../../models/unhumado';
import { Contrato } from './../../models/contrato';
import { Producto } from './../../models/producto';
import { Usuario } from './../../models/usuario';
import { ContratoService } from './../../services/contrato.service';
import { UsuarioService } from './../../services/usuario.service';
import { ProductosService } from './../../services/productos.service';
import { Component, OnInit } from '@angular/core';
import { SwalPortalTargets, SwalDirective } from '@sweetalert2/ngx-sweetalert2';
import swal from 'sweetalert2';
import { FacturaService } from 'src/app/services/factura.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-editar-contrato',
  templateUrl: './editar-contrato.component.html',
  styleUrls: ['./editar-contrato.component.css']
})
export class EditarContratoComponent implements OnInit {

  constructor(
    public _productoService: ProductosService,
    public _usuarioService: UsuarioService,
    public readonly swalTargets: SwalPortalTargets,
    public _contratoService: ContratoService,
    public route: ActivatedRoute,
    public router: Router,
    public edadPipe: EdadPipe,
    public _facturaService: FacturaService,

  ) { }

  opacity = 'disable';
  cliente: Usuario;
  clientes: Usuario[] = null;
  alternativos: Usuario[] = null;
  productos: Producto[] = null;
  vendedores: Usuario[] = null;
  clientesSearch = this.clientes;
  prodductosSearch = this.productos;
  vendedoresSearch = this.vendedores;
  cobradoresSearch = this.vendedores;
  entrega = 0;
  fechaMantenimiento;
  stringFechaMantenimiento;
  producto: Producto;
  saldo = 0;
  vendedor: Usuario;
  nro_contrato;
  cobrador: Usuario;
  plazo: number;
  contrato: Contrato;
  clientesAlternativo: Usuario[] = null;
  montoCuotas;
  model = '2020-03-12';
  radioLugarCobranza = 'particular';
  manzana;
  fila;
  parcela;
  sector;
  guardando = false;
  esPsm = false;
  esPsv = false;
  beneficiarioVacio = {
    nombre: '',
    doc: '',
    fecha_nacimiento: '',
    edad: '',
    plus_edad: 0
  };
  precioOriginal = 0
  fecha_creacion: Date;
  cobradores;

  tipos_pago = [
    {
      name: 'Oficina',
      value: 'OFICINA'
    },
    {
      name: 'PAGOPAR',
      value: 'PAGOPAR'
    },
    {
      name: 'COBRADOR',
      value: 'COBRADOR'
    },
    {
      name: 'Débito Automático',
      value: 'DEBITO'
    },
    {
      name: 'Transferencia Bancaria',
      value: 'BANCARIA'
    }
  ];
  esUdp = false;
  beneficiarios = [
    {
      nombre: '',
      doc: '',
      fecha_nacimiento: '',
      edad: '',
      plus_edad: 0
    }
  ];
  inhumadoVacio = {
    fecha_fallecimiento: '',
    fecha_inhumacion: '',
    nombre: '',
    ci: '',

  };
  inhumados: Inhumado[];
  facturas;
  radioValue;
  fechaPago;
  pagoradioValue = 'contado';
  stringFechaPago;
  servicioCMP: Producto;
  numeroFactura;
  editarproducto = false;
  respaldoProducto;
  id;
  saldoOriginal = 0
  facturaMantenimiento;
  montoTotal: any = {}
  facturaOptions
  inputClientes = new Subject<string>();
  loadingClientes = false;
  inputAlternativo = new Subject<string>();
  loadingAlternativo = false;
  inputVendedor = new Subject<string>();
  loadingVendedor = false;
  inputCobrador = new Subject<string>();
  loadingCobrador = false;
   async ngOnInit() {
    const date = new Date();
    this.observableBuscadores()
    this.id = this.route.snapshot.paramMap.get('id');
    this.contrato = await this._contratoService.getContratoById(this.id);
    this.saldoOriginal = this.calcularSaldoPendiente(this.contrato)
    this.precioOriginal = this.contrato.saldo_pendiente || this.contrato.precio_total || 0
    this.fecha_creacion = new Date(this.contrato.fecha_creacion_unix);
    // log(this.contrato);
    this.radioValue = this.contrato.tipo_pago;

    this.inhumados = this.contrato.inhumados;
    this.vendedor = this.contrato.vendedor;
    this.cobrador = this.contrato.cobrador;
    this.seleccionarProducto(this.contrato.producto);
    this.fechaMantenimiento = new Date(new Date(new Date().setFullYear(date.getFullYear() + 1, 0, 5)).setHours(0, 0, 0, 0));
    console.log(this.fechaMantenimiento);

    this.facturaOptions = { contrato: this.contrato._id, get_total: '1' };
    const respFacturas = await this._facturaService.getFacturasOptions(this.facturaOptions, { key: 'vencimiento', value: 1 });

    this.montoTotal = respFacturas.montoTotal;

    this.cliente = this.contrato.titular;

    this.productos = await this._productoService.getProductos();
    for (let i = 0; i < this.productos.length; i++) {
      const element = this.productos[i];
      if (element.COD_CORTO == 'C.M.P.') {
        this.servicioCMP = element;
      }
    }
    if (this.contrato.producto.COD_CORTO == 'P.S.M.') {
      this.esPsm = true;
    }
    if (this.contrato.producto.COD_CORTO == 'P.S.V.') {
      this.esPsv = true;
    }
  }

  calcularEdad(date) {

    if (date.length > 4) {
      const hoy = new Date();
      const fechaNacimiento = new Date(date);
      fechaNacimiento.setHours(5);
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
      if (
        diferenciaMeses < 0 ||
        (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
      ) {
        edad--;
      }

      return edad;
    } else { return 0; }

  }

  beneficiarioPush() {
    this.contrato.beneficiarios.push({
      nombre: '',
      doc: '',
      fecha_nacimiento: '',
      plus_edad: null
    });
  }

  inhumadoPush() {
    this.contrato.inhumados.push({
      fecha_fallecimiento: '',
      fecha_inhumacion: '',
      nombre: '',
      ci: '',
      producto: null
    });
  }

  calcularSaldo(entrega) {
    // log(entrega);

    if (entrega) {
      // this.saldo = this.producto.PRECIO_MAYORISTA - parseInt(entrega);
    } else {
      // this.saldo = this.producto.PRECIO_MAYORISTA;
    }
  }

  calcularCuotas() {
    if (this.plazo > 0) {
      if (this.esPsm) {
        this.pagoradioValue = 'cuota';
        this.montoCuotas = this.saldo
        this.facturas = this.crearFacturas(this.montoCuotas, this.plazo);
      } else {
        this.pagoradioValue = 'cuota';
        this.montoCuotas = (this.montoTotal.deuda || this.saldo) / this.plazo;
        this.facturas = this.crearFacturas(this.montoCuotas, this.plazo);
      }

    } else {
      this.resetPlazo();
    }
  }
  resetPlazo() {
    this.plazo = null;
    this.facturas = null;
    this.montoCuotas = null;
    this.pagoradioValue = 'contado';

  }
  calcularFechaPago() {

    this.facturas = this.crearFacturas(this.montoCuotas, this.plazo);

  }
  calcularFechaMantenimiento() {

    const d = new Date(this.stringFechaMantenimiento);
    d.setUTCHours(5);

    if (Object.prototype.toString.call(d) === '[object Date]') {
      // it is a date
      if (isNaN(d.getTime())) {  // d.valueOf() could also work
        // date is not valid
      } else {
        // date is valid
        this.fechaMantenimiento = d;
        // this.facturas = this.crearFacturas(this.montoCuotas, this.plazo);

      }
    } else {
      // not a date
    }
  }
  currencyInputChanged(value) {
    const num = value.replace(/[$,]/g, '');
    this.calcularSaldo(num);
    return Number(num);
  }
  async editarContrato() {
    let tipoContrato = ''

    if (this.esPsm && this.saldoOriginal != this.saldo) {

      this.editarproducto = true
      this.contrato.saldo_pendiente = this.saldo

      if (!this.plazo) {
        return swal.fire({
          title: 'Error, no existe plazo',
          icon: 'error',
          text: 'por favor edite el producto e introdizca la cantidad de cuotas a crear'
        })
      }
    }
    if (this.esPsm && this.saldoOriginal == this.saldo) {
 
      this.contrato.saldo_pendiente = this.saldo
 
    }
    if (this.editarproducto && !this.esPsm) {
      this.contrato.saldo_pendiente = this.montoTotal.deuda

    }
    if (!this.facturas && this.pagoradioValue === 'contado' && this.fechaPago) {
      this.plazo = 1;
      this.facturas = this.crearFacturas(this.contrato.saldo_pendiente, 1);
    }


    if (this.esPsm) {
      tipoContrato = 'psm'

    }
    if (this.esPsv) {
      tipoContrato = 'psv'

    }
    this.contrato.id_contrato = new Date().getTime().toString(),   // se puede quitar
      // this.contrato.cobrador = this.cobrador || {},
      this.contrato.cuota = this.montoCuotas,
      this.contrato.entrega = this.entrega,
      this.contrato.id_servicio = this.producto.ID_PRODUCTO, // se puede quitar
      this.contrato.nombre_servicio = this.producto.NOMBRE,
      this.contrato.plazo = this.plazo,
      // this.contrato.precio_total = this.producto.PRECIO_MAYORISTA,

      this.contrato.producto = this.producto,
      // this.contrato.titular = this.cliente,
      this.contrato.activo = '1',
      // this.contrato.vendedor = this.vendedor,
      this.contrato.fecha_creacion_unix = this.fecha_creacion.getTime();  // falta poner campode fecha para poder modificar
      this.contrato.nro_contrato_relacionado = parseInt(this.contrato?.nro_contrato_relacionado?.toString() ||'0') || 0
    
      console.log(this.saldo);
      console.log(this.contrato);
      

    const send = {
      contrato: this.contrato,
      fechaPago: this.fechaPago ? this.fechaPago : new Date()
    };
    this.guardando = true;
    await this._contratoService.updateContrato(send, this.editarproducto, tipoContrato).then(() => {
      // swal.fire({
      //   icon: 'success',
      //   title: 'Contrato actualizado',
      //   // text: 'I will close in 2 seconds.',
      //   timer: 2000,
      // });
    });
    this.guardando = false;

  }
  async searchCobradores(val: any) {
    if (val.term.length > 0) {
      this.cobradores = await this._usuarioService.buscarUsuarios('COBRADORES', val.term);
    }
  }

  async searchClientes(val: any) {
    if (val.term.length > 0) {
      this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', val.term);

    }
  }
  async searchClientesAlternativos(val: any) {
    if (val.term.length > 0) {
      this.alternativos = await this._usuarioService.buscarUsuarios('CLIENTES', val.term);

    }
  }

  async searchVendedores(val: any) {
    if (val.term.length > 0) {
      this.vendedores = await this._usuarioService.buscarUsuarios('VENDEDORES', val.term);
    }
  }

  onFocused(e) {
    // do something when input is focused
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.NOMBRES.toLowerCase().indexOf(term) > -1 ||
      item.APELLIDOS.toLowerCase().includes(term) ||
      item.RAZON.toLowerCase().includes(term) ||
      item.RUC.toLowerCase().includes(term);
  }


  seleccionarVendedor(vendedor) {
    this.vendedor = vendedor;
  }
  seleccionarProducto(producto: Producto) {
    this.beneficiarios = [
      {
        nombre: '',
        doc: '',
        fecha_nacimiento: '',
        edad: '',
        plus_edad: 0
      }
    ];

    this.inhumados = [
      {
        fecha_fallecimiento: '',
        fecha_inhumacion: '',
        nombre: '',
        ci: '',

      }
    ];
    if (this.cobrador) {
      this.radioValue = 'cobrador';
    }
    this.producto = producto;
    // this.saldo = producto.PRECIO_MAYORISTA;
    if (producto.COD_CORTO == 'U.D.P.') {
      this.esUdp = true;
    } else { this.esUdp = false; }
    this.respaldoProducto = this.producto;
  }
  seleccionarCliente(cliente) {
    this.cliente = cliente;
  }
  seleccionarCobrador(cobrador) {
    this.cobrador = cobrador;
  }

  disableCrearContrato() {
    if (this.producto && this.cliente && this.vendedor  ) {
      return false;
    }
    return true;
  }

  crearFacturas(monto, cantidad) {
    if (!cantidad) {
      return null;
    }
    const factura = [];
    let mes = this.fechaPago.getMonth() + 1;
    let year = this.fechaPago.getFullYear();
    const dia = this.fechaPago.getDate();
    for (let i = 0; i < cantidad; i++) {
      if (mes > 12) {
        year++;
        mes = 1;
      }
      factura.push({
        numero: i + 1,
        vencimiento: new Date(`${year}/${mes}/${dia}`),
        monto,
        haber: monto,
        titular: this.cliente,
        servicio: this.producto._id,
        fecha_creacion_unix: new Date().getTime()
      });
      mes++;
    }
    return factura;
  }

  refactor() {
    this.producto = null;

  }

  cancelarEdiciondeProducto() {
    this.editarproducto = false;
    this.producto = this.respaldoProducto;
    this.facturas = null
    this.plazo = null
  }

  editarProducto() {
    swal.fire({
      icon: 'warning',
      title: 'Modificar Producto',
      text: 'Si modifica se eliminarán todas las facturas correspondientes al contrato',
      showCancelButton: true,
      cancelButtonText: 'cancelar',
      cancelButtonColor: '#ef5350',
      confirmButtonText: 'modificar',
      confirmButtonColor: '#06d79c',
      showConfirmButton: true
    }).then(res => {

      if (res.isConfirmed == true) {
        this.fechaPago = new Date();
        this.editarproducto = true;
      } else {

      }
    });
  }

  removerProducto() {
    this.esPsm = false;
    this.esUdp = false;
  }

  eliminarContrato() {
    swal.fire({
      icon: 'warning',
      title: 'Eliminar Contrato',
      text: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      cancelButtonText: 'cancelar',
      cancelButtonColor: '#ef5350',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#06d79c',
      showConfirmButton: true
    }).then(res => {

      if (res.isConfirmed == true) {
        this.contrato.eliminado = true

        this.editarContrato()
      } else {

      }
    });
  }
  cancelar() {
    window.history.back();
  }

  calcularSaldoPendiente(contrato) {
    this.saldo = 0

    for (let i = 0; i < contrato.beneficiarios.length; i++) {
      const beneficiario = contrato.beneficiarios[i];
      this.saldo += parseInt((beneficiario.plus_edad || '0').toString()) || 0
    }


    this.saldo += contrato.precio_total || 0
    return this.saldo
  }

  calcularPrecioConPlusPorEdad() {
    if (this.saldoOriginal != this.saldo) {
      this.editarproducto = true

    }
    this.calcularSaldoPendiente(this.contrato)

  }

  observableBuscadores() {
    this.inputClientes.pipe(

      debounceTime(200),
      distinctUntilChanged()
    )
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingClientes = true;
        this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', txt);
        this.loadingClientes = false;
      });

    this.inputAlternativo.pipe(

      debounceTime(200),
      distinctUntilChanged()
    )
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingAlternativo = true;
        this.clientesAlternativo = await this._usuarioService.buscarUsuarios('CLIENTES', txt);
        this.loadingAlternativo = false;
      });
    this.inputVendedor.pipe(

      debounceTime(200),
      distinctUntilChanged()
    )
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingVendedor = true;
        this.vendedores = await this._usuarioService.buscarUsuarios('VENDEDORES', txt);
        console.log(this.vendedores);

        this.loadingVendedor = false;
      });
    this.inputCobrador.pipe(

      debounceTime(200),
      distinctUntilChanged()
    )
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingCobrador = true;
        this.cobradores = await this._usuarioService.buscarUsuarios('COBRADORES', txt);
        this.loadingCobrador = false;
      });
  }


}
