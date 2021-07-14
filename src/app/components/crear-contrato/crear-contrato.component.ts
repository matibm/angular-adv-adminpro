import { Router } from '@angular/router';
import { Contrato } from '../../models/contrato';
import { Inhumado } from '../../models/unhumado';
import { ContratoService } from '../../services/contrato.service';
import { UsuarioService } from '../../services/usuario.service';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/producto';
import { Usuario } from '../../models/usuario';
import { Component, OnInit } from '@angular/core';
// import { Options } from 'select2';
import { SwalPortalTargets, SwalDirective } from '@sweetalert2/ngx-sweetalert2';
import swal from 'sweetalert2';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-crear-contrato',
  templateUrl: './crear-contrato.component.html',
  styleUrls: ['./crear-contrato.component.css']
})
export class CrearContratoComponent implements OnInit {
  constructor(
    public _productoService: ProductosService,
    public _usuarioService: UsuarioService,
    public readonly swalTargets: SwalPortalTargets,
    public _contratoService: ContratoService,
    public router: Router,

  ) { }


  cliente: Usuario;
  clientes: Usuario[] = null;
  clientesAlternativo: Usuario[] = null;

  titularAlternativo: Usuario;
  fecha_creacion = new Date();
  fecha_primer_pago = new Date().getTime();
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
  nro_contrato = '';
  cobrador: Usuario;
  plazo: number;
  contrato: Contrato;
  montoCuotas;
  model = '2020-03-12';
  radioLugarCobranza = 'particular';
  manzana;
  fila;
  parcela;
  sector;
  cobradores;
  saldoPlusEdad = 0;
  esUdp = false;
  esPsm = false;
  beneficiarios = [

  ];

  inhumados = [

  ];
  pagoInicial: any = {};
  facturas;
  radioValue = 'OFICINA';
  fechaPago = new Date();
  pagoradioValue = 'contado';
  stringFechaPago;
  servicioCMP;
  numeroFactura;
  esPsv;
  inputClientes = new Subject<string>();
  loadingClientes = false;
  inputAlternativo = new Subject<string>();
  loadingAlternativo = false;
  inputVendedor = new Subject<string>();
  loadingVendedor = false;
  inputCobrador = new Subject<string>();
  loadingCobrador = false;
  cantidadCuotaPSM = 120;
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
  precioTotal;
  showInfoContrato = false;
  radioDebito = false;
  radioAdministracion = false;
  radioCobrador = false;
  selectedDate;

  facturaMantenimiento;
  trackItem(index, item) {

    // log(item);

    return index;
  }

  pruebalog() {

    // log(this.radioValue);

  }


  async ngOnInit() {
    this.observableBuscadores();

    const date = new Date();

    this.fechaMantenimiento = new Date(`${date.getFullYear() + 1}-01-05`);
    this.fechaMantenimiento.setUTCHours(5);

    // log(this.fechaMantenimiento);

    this.productos = await this._productoService.getProductos();
    for (let i = 0; i < this.productos.length; i++) {
      const element = this.productos[i];
      if (element.COD_CORTO == 'C.M.P.') {
        this.servicioCMP = element;
      }

    }
    // log(this.servicioCMP);

    // this.clientes = await this._usuarioService.getClientes()
    // this.vendedores = await this._usuarioService.getVendedores()
    // this.cobradores = await this._usuarioService.getVendedores()

  }
  calcularEdad(date) {
    console.log(date);



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
    // log(edad);

    return edad;

  }

  beneficiarioPush() {
    this.beneficiarios.push({
      nombre: '',
      doc: '',
      fecha_nacimiento: '',
      edad: '',
      plus_edad: null
    });
  }

  inhumadoPush() {
    this.inhumados.push({
      fecha_fallecimiento: '',
      fecha_inhumacion: '',
      nombre: '',
      ci: '',
      nro: ''
    });
  }

  calcularSaldo(entrega) {
    // log(entrega);

    if (entrega) {
      this.saldo = this.producto.PRECIO_MAYORISTA - parseInt(entrega);
    } else {
      this.saldo = parseInt(this.producto.PRECIO_MAYORISTA.toString());
    }

    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setHours(0, 0, 0, 0);
    this.fechaPago = d;
    console.log(d);

    console.log(d.getMonth(), d.getUTCMonth());

    // this.fechaPago = new Date(`${d.getFullYear()}-${d.getUTCMonth()}-${d.getDate()}`)
    // console.log(new Date(`${d.getFullYear()}-${d.getUTCMonth()}-${d.getDate()}`));

  }

  calcularCuotas() {
    this.saldo = this.precioTotal - this.entrega;
    if (this.plazo > 0) {

      this.pagoradioValue = 'cuota';
      this.montoCuotas = this.saldo / this.plazo;
      this.facturas = this.crearFacturas(this.montoCuotas, this.plazo);
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
    console.log('se cambio fecha', this.fecha_primer_pago);

    // this.fechaPago = this.fecha_primer_pago
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
  async crearContrato() {
    if ((await this.verificar_nro_contrato(this.nro_contrato)) === false) {
      swal.fire('Número de contrato ya existe', '', 'error') 
      return
    }
  
    if (!this.facturas && this.pagoradioValue === 'contado') {
      this.plazo = 1;
      this.facturas = this.crearFacturas(this.saldo, 1);
    }
    let utilizado = false;
    this.inhumados.length > 0 && this.esPsv ? utilizado = true : false;

    const nuevo_contrato: Contrato = {
      id_contrato: new Date().getTime().toString(),   // se puede quitar
      cobrador: this.cobrador || {},
      cuota: this.montoCuotas,
      entrega: this.entrega,
      id_servicio: this.producto.ID_PRODUCTO, // se puede quitar
      nombre_servicio: this.producto.NOMBRE,
      plazo: this.plazo,
      precio_total: this.precioTotal + this.saldoPlusEdad,
      producto: this.producto,
      titular: this.cliente,
      titular_alternativo: this.titularAlternativo,
      nro_contrato: this.nro_contrato,
      activo: '1',
      vendedor: this.vendedor,
      beneficiarios: this.beneficiarios,
      saldo_pendiente: this.precioTotal + this.saldoPlusEdad - this.entrega,
      tipo_pago: this.radioValue,
      inhumados: this.inhumados,
      fecha_creacion_unix: this.fecha_creacion.getTime(),
      utilizado
    };
    if (this.esUdp) {
      nuevo_contrato.manzana = this.manzana;
      nuevo_contrato.fila = this.fila;
      nuevo_contrato.parcela = this.parcela;
      nuevo_contrato.sector = this.sector;

    }
    // this.facturas.push({
    //   vencimiento: this.fechaMantenimiento,
    //   monto: 150000,
    //   haber: 150000,
    //   titular: this.cliente,
    //   iscmp: true,
    //   servicio: this.servicioCMP._id,
    //   fecha_creacion_unix: new Date().getTime()
    // })
    
    const send = {
      contrato: nuevo_contrato,
      facturas: null,
      fechaPago: this.fechaPago,
      crearCMP: this.esUdp,
      cantidadCoutas: this.cantidadCuotaPSM,
      pagoInicial: this.pagoInicial,
      facturaIngreso: this.crearFacturaEntregaInicial(this.entrega, this.cliente._id, this.producto._id, this.cobrador?._id)
    };

    console.log(send);


    const contratoCreado = await this._contratoService.newContrato(send);
    this.router.navigateByUrl(`/admin/info_contrato/${contratoCreado._id}`);

  }
  async searchCobradores(val: any) {
    if (val.term.length > 0) {
      this.cobradores = await this._usuarioService.buscarUsuarios('COBRADORES', val.term);
    }
  }

  async searchClientes(val: any) {
    if (val.term.length > 0) {
      //   this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', val.term)

      //   const searchBox = document.getElementById('search');

      // // streams
      // const keyup$ = fromEvent(searchBox, 'keyup');

      // wait .5s between keyups to emit current value
      this.inputClientes.pipe(

        debounceTime(3000),
        distinctUntilChanged()
      )
        .subscribe(async (txt) => {
          // this.isSearching = true
          this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', txt);
          // this.isSearching = false
        });

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
      item.APELLIDOS?.toLowerCase().includes(term) ||
      item.RAZON?.toLowerCase().includes(term) ||
      item.RUC?.toLowerCase().includes(term);
  }


  seleccionarVendedor(vendedor) {
    this.vendedor = vendedor;
  }
  seleccionarProducto(producto: Producto) {
    this.beneficiarios = [

    ];

    this.inhumados = [


    ];
    this.precioTotal = parseInt(producto.PRECIO_MAYORISTA.toString());
    this.producto = producto;
    this.saldo = parseInt(producto.PRECIO_MAYORISTA.toString());
    this.manzana = producto.MANZANA;
    this.esUdp = false;
    this.esPsm = false;
    this.esPsv = false;
    if (producto.COD_CORTO == 'U.D.P.') {
      this.esUdp = true;
    } else if (producto.COD_CORTO == 'P.S.M.') {
      this.esPsm = true;
    } else if (producto.COD_CORTO == 'P.S.V.') {
      this.esPsv = true;
    }


  }
  seleccionarCliente(cliente) {
    this.cliente = cliente;
  }
  seleccionarCobrador(cobrador) {
    this.cobrador = cobrador;
  }

  disableCrearContrato() {
    if (this.producto && this.cliente && this.vendedor && this.radioValue) {
      if (this.esUdp) {
        if (this.manzana && this.fila && this.parcela) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
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



  removeInhumaciones(index) {
    this.inhumados.splice(index, 1);
  }

  sumarPlusPorEdad(beneficiarios) {
    this.saldoPlusEdad = 0;


    for (let i = 0; i < beneficiarios.length; i++) {
      const beneficiario = beneficiarios[i];

      this.saldoPlusEdad += beneficiario.plus_edad;

    }

    console.log(this.saldoPlusEdad);

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


  cargarDatosPagoInicial(usuario) {
    this.pagoInicial.nombre = `${usuario.NOMBRES} ${usuario.APELLIDOS}`;
    this.pagoInicial.ruc = usuario.RUC;
    this.pagoInicial.tel = usuario.TELEFONO1;
    this.pagoInicial.direccion = usuario.DIRECCION;
    this.pagoInicial.nro_timbrado = 123123;
    this.pagoInicial.nro_factura = 999999;
  }

  crearFacturaEntregaInicial(monto, cliente, producto, cobrador?) {
    const f: any = {
      nro_factura: 0,
      vencimiento: this.fecha_creacion.getTime(),
      monto,
      haber: monto,
      precio_unitario: monto,
      titular: cliente,
      servicio: producto,
      fecha_creacion_unix: this.fecha_creacion.getTime()
    };
    cobrador ? f.cobrador = cobrador : '';
    return f;
  }

  async verificar_nro_contrato(nro_contrato) {
    let resp = await this._contratoService.getContratos(1, { nro_contrato: nro_contrato })
    if (resp.count === 0) {
      return true
    } else return false
  }

}
