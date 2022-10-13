import { ActivatedRoute, Params, Router } from '@angular/router';
import { Producto } from './../../models/producto';
import { ProductosService } from './../../services/productos.service';
import { UsuarioService } from './../../services/usuario.service';
import { Usuario } from './../../models/usuario';
import { ContratoService } from './../../services/contrato.service';
import { Contrato } from './../../models/contrato';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IDatePickerConfig } from 'ng2-date-picker';
import { DatepickerOptions } from 'ng2-datepicker';
import locale from 'date-fns/locale/es';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';

@Component({
  selector: 'app-lista-contratos',
  templateUrl: './lista-contratos.component.html',
  styleUrls: ['./lista-contratos.component.css']
})
export class ListaContratosComponent implements OnInit {

  constructor(public _contratoService: ContratoService,
    public _usuarioService: UsuarioService,
    public _productoService: ProductosService,
    public router: Router,
    public route: ActivatedRoute


  ) { }

  @Input() showFilter = true;
  @Input() selectable = false;
  @Output() selected = new EventEmitter();
  @Input() cliente: Usuario;
  rangeReporteBajas = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  loadingGenerarReporteBajas = false

  inputClientes = new Subject<string>();
  loadingClientes = false
  inputCobradores = new Subject<string>();
  loadingCobradores = false
  inputVendedores = new Subject<string>();
  loadingVendedores = false
  inputNroContrato = new Subject<string>();
  loadingNroContrato = false
  clientes: Usuario[];
  proveedor: Usuario;
  proveedores: Usuario[];
  cobrador: Usuario;
  cobradores: Usuario[];
  vendedor: Usuario;
  vendedores: Usuario[];
  servicio;
  servicios;
  fila;
  parcela;
  manzana;
  page = 1;
  date_start_StiringTemporal;
  date_end_StiringTemporal;
  nro_contrato;
  date_start;
  date_end;
  sort_key = 'fecha_creacion_unix';
  sort_value = -1;
  @Input() options: any = {};
  sort;
  count = 0;
  model = new Date();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  beneficiarioNombre
  beneficiarioCi
  inhumadoNombre
  inhumadoCi
  codSeleccionado
  estadoSeleccionado = 'TODOS'
  rangeInhumado = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  // wait .5s between keyups to emit current value
  cod_servicios = ['P.S.V.', 'P.S.M.', 'C.M.P.', 'A.C.F.', 'U.D.P.']
  optionsDP: DatepickerOptions = {
    // minYear: getYear(new Date()) - 30, // minimum available and selectable year
    // maxYear: getYear(new Date()) + 30, // maximum available and selectable year
    placeholder: '', // placeholder in case date model is null | undefined, example: 'Please pick a date'
    format: 'LLLL do yyyy', // date format to display in input
    formatTitle: 'LLLL yyyy',
    formatDays: 'EEEEE',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale, // date-fns locale
    position: 'bottom',
    inputClass: '', // custom input CSS class to be applied
    calendarClass: 'datepicker-default', // custom datepicker calendar CSS class to be applied
    scrollBarColor: '#dfe3e9', // in case you customize you theme, here you define scroll bar color
    // keyboardEvents: true // enable keyboard events
  };

  configDP: IDatePickerConfig = {

  };
  cantidadServicios
  algo = false
  @Input() contratos: Contrato[];
  async ngOnInit() {
    this.observableBuscadores()

    if (this.route.snapshot.queryParams.cliente) {
      this.options.cliente = this.route.snapshot.queryParams.cliente
    }
    if (this.route.snapshot.queryParams.cobrador) {
      this.options.cobrador = this.route.snapshot.queryParams.cobrador
      this.cobrador = await this._usuarioService.getUsuarioPorId(this.options.cobrador)
    }













    this.servicios = await this._productoService.getProductos();
    console.log(this.options);
    // if (!this.options.de_baja) this.options.de_baja = false
    // if (!this.options.utilizado) this.options.utilizado = false

    if (!this.options.cliente) {
      this.options = {
        fecha_inicio: this.date_start ? this.date_start : null,
        fecha_fin: this.date_end ? this.date_end : null,
        cliente: this.cliente ? this.cliente._id : null,
        fila: this.fila,
        manzana: this.manzana,
        parcela: this.parcela,
        producto: this.servicio ? this.servicio._id : null,
        nro_contrato: '',
        // utilizado: false,
        // de_baja: false,
        cobrador: this.cobrador ? this.cobrador._id : null,
        vendedor: this.vendedor ? this.vendedor._id : null
      };
    } else {
      if (this.options.cliente) {
        this.cliente = await this._usuarioService.getUsuarioPorId(this.options.cliente)
      }

    }
    this.sort = {
      key: this.sort_key,
      value: this.sort_value
    };
    const resp = await this._contratoService.getContratos(null, this.options, this.sort);
    this.count = resp.count;


    this.contratos = resp.contratos;
    this.cantidadServicios = resp.cantidadServicios;

    // this.filtrar()

    // console.log(this.contratos);
    //(this.count);

  }

  async pageChanged(page) {
    const resp = await this._contratoService.getContratos(page, this.options, this.sort);


    this.contratos = resp.contratos;
    this.cantidadServicios = resp.cantidadServicios;

    // this.count = resp.count
    //(page);

  }
  seleccionarProducto(producto: Producto) {
    this.filtrar();
    this.servicio = producto;

  }


  async searchClientes(val) {
    if (val.term.length > 0) {
      this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', val.term);
    }
  }

  async searchcobradores(val) {
    if (val.term.length > 0) {
      this.cobradores = await this._usuarioService.buscarUsuarios('COBRADORES', val.term);

    }
  }
  async searchvendedores(val) {
    if (val.term.length > 0) {
      this.vendedores = await this._usuarioService.buscarUsuarios('VENDEDORES', val.term);

    }
  }

  async filtrar() {

    this.options.inhumados_date_start = this.rangeInhumado.value.start ? new Date(
      new Date(`${new Date(this.rangeInhumado.value.start).getFullYear()}-${new Date(this.rangeInhumado.value.start).getMonth() + 1}-${new Date(this.rangeInhumado.value.start).getDate()} 00:00`)
    ).toISOString() : null
    this.options.inhumados_date_end = this.rangeInhumado.value.end ? new Date(
      new Date(`${new Date(this.rangeInhumado.value.end).getFullYear()}-${new Date(this.rangeInhumado.value.end).getMonth() + 1}-${new Date(this.rangeInhumado.value.end).getDate()} 23:59:59`)
    ).toISOString() : null
    this.options.inhumados_nombre = this.inhumadoNombre ? this.inhumadoNombre : null
    this.options.inhumados_ci = this.inhumadoCi ? this.inhumadoCi : null
    this.options.beneficiarios_ci = this.beneficiarioCi ? this.beneficiarioCi : null
    this.options.beneficiarios_nombre = this.beneficiarioNombre ? this.beneficiarioNombre : null
    this.options.fecha_inicio = this.range.value.start ? new Date(`${new Date(this.range.value.start).toLocaleDateString('en-US')} 00:00`).getTime() : null
    this.options.fecha_fin = this.range.value.end ? new Date(`${new Date(this.range.value.end).toLocaleDateString('en-US')} 23:59:59`).getTime() : null
    this.options.cliente = this.cliente ? this.cliente._id : null
    this.options.fila = this.fila
    this.options.manzana = this.manzana
    this.options.parcela = this.parcela
    this.options.producto = this.servicio ? this.servicio._id : null
    this.options.nro_contrato = this.nro_contrato ? this.nro_contrato : null
    this.options.cobrador = this.cobrador ? this.cobrador._id : null
    this.options.vendedor = this.vendedor ? this.vendedor._id : null
    this.options.codigo_producto = this.codSeleccionado ? this.codSeleccionado : null

    this.sort = {
      key: this.sort_key,
      value: this.sort_value
    };
    console.log(this.options);

    if (this.estadoSeleccionado == 'TODOS') {
      delete this.options.utilizado 
      delete this.options.de_baja 
    }

    if (this.estadoSeleccionado == 'UTILIZADO') {
      this.options.utilizado = true
      this.options.de_baja = false

    }
    if (this.estadoSeleccionado == 'DE BAJA') {
      this.options.de_baja = true
      this.options.utilizado = false
    }




    const resp = await this._contratoService.getContratos(null, this.options, this.sort);
    this.servicios = await this._productoService.getProductos();

    this.contratos = resp.contratos;
    this.cantidadServicios = resp.cantidadServicios;

    //(resp);

    this.count = resp.count;
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.NOMBRES.toLowerCase().indexOf(term) > -1 ||
      item.APELLIDOS.toLowerCase().includes(term) ||
      item.RAZON.toLowerCase().includes(term) ||
      item.RUC.toLowerCase().includes(term);
  }

  calcularFecha(stringDate) {

    const d = new Date(stringDate);
    d.setUTCHours(5);

    if (Object.prototype.toString.call(d) === '[object Date]') {
      // it is a date
      if (isNaN(d.getTime())) {  // d.valueOf() could also work
        // date is not valid
      } else {
        // date is valid
        return d.getTime();

      }
    } else {
      // not a date
    }
  }

  async ordenar(value) {
    if (value === this.sort_key) {
      this.sort_value > 0 ? this.sort_value = -1 : this.sort_value = 1;
    } else {
      this.sort_value = 1;
    }
    // const oldKeyAsc = document.getElementsByClassName('fa-sort-asc').item(0);
    // if (oldKeyAsc) {
    //   oldKeyAsc.classList.remove('fa-sort-asc');
    //   oldKeyAsc.classList.add('fa-sort');
    // }
    // const oldKeyDesc = document.getElementsByClassName('fa-sort-desc').item(0);
    // if (oldKeyDesc) {
    //   oldKeyDesc.classList.remove('fa-sort-desc');
    //   oldKeyDesc.classList.add('fa-sort');
    // }
    this.sort_key = value;
    this.sort = {
      key: this.sort_key,
      value: this.sort_value
    };
    //(document.getElementById(value));

    // const newKey: any = document.getElementById(value).childNodes.item(1);
    // if (!newKey) {
    //   return;
    // }
    // newKey.classList.remove('fa-sort');
    // newKey.classList.add(`fa-sort-${this.sort_value > 0 ? 'asc' : 'desc'}`);

    const resp = await this._contratoService.getContratos(null, this.options, this.sort);

    this.contratos = resp.contratos;
    this.cantidadServicios = resp.cantidadServicios;

    //(resp);

    // this.count = resp.count
  }


  onSelectContrato(contrato) {
    if (this.selectable) {
      this.selected.emit(contrato);
    } else {
      this.router.navigateByUrl('/admin/info_contrato/' + contrato._id);
    }
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

    this.inputCobradores.pipe(
      debounceTime(200),
      distinctUntilChanged()
    )
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingCobradores = true;
        this.cobradores = await this._usuarioService.buscarUsuarios('COBRADORES', txt);
        this.loadingCobradores = false;
      });

    this.inputVendedores.pipe(
      debounceTime(200),
      distinctUntilChanged()
    )
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingVendedores = true;
        this.vendedores = await this._usuarioService.buscarUsuarios('VENDEDORES', txt);
        this.loadingVendedores = false;
      });
    this.inputNroContrato.pipe(
      debounceTime(200),
      distinctUntilChanged()
    )
      .subscribe(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingNroContrato = true;
        this.nro_contrato = txt
        console.log("filtrando :", txt);

        await this.filtrar()
        this.loadingNroContrato = false;
      });
  }

  exportarPDF() {
    this.options.unlimit = true
    localStorage.setItem('options_extracto_contratos', JSON.stringify(this.options))
    const wopen = window.open('/extracto-contratos');
  }
  exportarEXCEL() {
    this._contratoService.getContratosEXCEL(null, this.options, this.sort)
  }

  generarReporteBajas() {
    console.log(this.rangeReporteBajas);
    let date_start = new Date(`${new Date(this.rangeReporteBajas.value.start).toLocaleDateString('en-US')} 00:00`).getTime()
    let date_end = new Date(`${new Date(this.rangeReporteBajas.value.end).toLocaleDateString('en-US')} 23:59:59`).getTime()
    let body = {
      date_end,
      date_start
    }
    this._contratoService.getReporteBajas(body)
  }

  async reporteVendededoresUlt() {
    let body = {
      vendedor: this.vendedor._id,
      rango_fecha: {
        start: new Date(`${new Date(this.range.value.start).toLocaleDateString('en-US')} 00:00`).getTime(),
        end: new Date(`${new Date(this.range.value.end).toLocaleDateString('en-US')} 23:59:59`).getTime(),
      }

    }
    await this._contratoService.reporteVendededoresUlt(body)
  }
  saveClienteToRoute() {
    this.cambiarQueryParams([{ cliente: this.cliente._id }])
  }

  cambiarQueryParams(paths) {
    let queryParams: Params = { ... this.route.snapshot.queryParams }
    for (let i = 0; i < paths.length; i++) {
      const element = paths[i];
      Object.keys(element).forEach((key, index) => {
        queryParams[key] = element[key]

      })

    }
    console.log(queryParams);

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        // skipLocationChange: true
        // queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }
  switchContratoRevisado(contrato) {
    console.log(contrato.revisado);
    this._contratoService.revisarContrato({ contrato_id: contrato._id, revisado: contrato.revisado })

  }

  reporte_inhumados() {
    this._contratoService.reporte_inhumados({})

  }
}
