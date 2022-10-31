import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-edit-gasto',
  templateUrl: './edit-gasto.component.html',
  styleUrls: ['./edit-gasto.component.css']
})
export class EditGastoComponent implements OnInit, OnDestroy {
  proveedor
  inputProveedores = new Subject<string>();
  inputcuentaAbacos = new Subject<string>();
  inputcategorias = new Subject<string>();
  loadingcuentaAbacos
  loadingProveedores
  loadingcategorias
  cuentasAbaco
  proveedores
  categorias
  fondo
  fondos
  cliente
  clientes
  nro
  nroFacturaProveedor
  comentario
  monto
  fechaVencimientoTimbrado
  contrato
  showModal
  cuentaGasto
  showModalCuentas
  tipoIva
  cuentaAbaco
  fechaCreacion
  constructor(
    private egresoService: MovimientoService,
    private route: ActivatedRoute,
    public _usuarioService: UsuarioService,

  ) { }

ngOnDestroy(): void {
  this.inputProveedores.unsubscribe()
  this.inputcuentaAbacos.unsubscribe()
  this.inputcategorias.unsubscribe()
}

  gasto
  async ngOnInit() {
    this.observableBuscadores()
    this.route.snapshot.params.id
    let resp = await this.egresoService.getMovimientoById(this.route.snapshot.params.id)
    console.log(resp);
    this.gasto = resp
    this.fondo = resp.fondo
    this.proveedor = resp.proveedor
    this.cliente = resp.cliente
    this.nroFacturaProveedor = resp.nro_comp_banco
    this.nro = resp.nro_factura
    this.comentario = resp.comentario
    this.monto = resp.monto_total
    this.fechaVencimientoTimbrado = new Date(resp.vencimiento_timbrado)
    this.contrato = resp.contrato

    console.log(await this.egresoService.getCuentaGastoByCtaPadre(resp.id_cuentacaja));
    console.log(this.cuentaGasto = resp.tipo_movimiento);

    let cuenta = await this.egresoService.getCuentaGastoById(this.cuentaGasto._id)
    console.log(cuenta);
    this.cuentaAbaco = cuenta.cuentaGasto

    this.fechaCreacion = new Date(resp.fecha_creacion_unix)


    let tipoIVA = resp.tipo_iva
    if (tipoIVA == 'iva10') this.tipoIva = 'IVA 10%'
    if (tipoIVA == 'iva5') this.tipoIva = 'IVA 5%'
    if (tipoIVA == 'exenta') this.tipoIva = 'EXENTAS'

    // if (this.tipoIva == 'IVA 10%') tipoIVA = 'iva10'
    // if (this.tipoIva == 'IVA 5%') tipoIVA = 'iva5'
    // if (this.tipoIva == 'EXENTAS') tipoIVA = 'exenta'
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return (
      item?.NOMBRES?.toLowerCase().indexOf(term) > -1 ||
      item?.APELLIDOS?.toLowerCase().includes(term) ||
      item?.RAZON?.toLowerCase().includes(term) ||
      item?.RUC?.toLowerCase().includes(term)
    );
  }
  inputcuentaAbacosPromise
  inputProveedoresPromise
  observableBuscadores() {
    this.inputcuentaAbacosPromise = this.inputcuentaAbacos.pipe(

      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(async (txt) => {
      console.log(txt);

      if (!txt) {
        return;
      }
      this.loadingcuentaAbacos = true;
      this.cuentasAbaco = await this.egresoService.searchCuentasAbaco(txt)
      //this.cuentasAbaco);

      this.loadingcuentaAbacos = false;
    })
    this.inputProveedoresPromise = this.inputProveedores.pipe(

      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((async (txt) => {
      if (!txt) {
        return;
      }

      this.loadingProveedores = true;
      this.proveedores = await this._usuarioService.buscarUsuarios(
        'PROVEEDORES',
        txt
      );

      this.loadingProveedores = false;
    })
    )

    this.inputcategorias.pipe(

      debounceTime(300),
      distinctUntilChanged()
    )
      .toPromise().then(async (txt) => {
        if (!txt) {
          return;
        }
        this.loadingcategorias = true;
        this.categorias = await this.egresoService.searchCategorias(txt)
        //this.categorias);

        this.loadingcategorias = false;
      });

  }


  async searchBancos(val) {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term);
  }


  async searchClientes(val) {
    if (val.term.length > 0) {
      this.clientes = await this._usuarioService.buscarUsuarios(
        'CLIENTES',
        val.term
      );
    }
  }


  async guardar() {
    if(this.fondo?._id ) this.gasto.fondo = this.fondo._id
    if(this.proveedor?._id ) this.gasto.proveedor = this.proveedor._id
    if(this.nroFacturaProveedor ) this.gasto.nro_comp_banco = this.nroFacturaProveedor
    if(this.nro ) this.gasto.nro_factura = this.nro
    if(this.comentario ) this.gasto.comentario = this.comentario
    if(this.monto ) this.gasto.monto_total = this.monto
    if(this.fechaVencimientoTimbrado?.getTime() ) this.gasto.vencimiento_timbrado = this.fechaVencimientoTimbrado.getTime()
    
    if(this.cuentaGasto?.cuenta ) this.gasto.id_cuentacaja = this.cuentaGasto.cuenta
    if(this.cuentaGasto?._id ) this.gasto.tipo_movimiento = this.cuentaGasto._id
    if(this.fechaCreacion?.getTime() ) this.gasto.fecha_creacion_unix = this.fechaCreacion.getTime()
    this.cliente?._id ? this.gasto.cliente = this.cliente._id : delete this.gasto.cliente 
    this.contrato?._id ? this.gasto.contrato = this.contrato._id : this.gasto.contrato = null

    if (this.tipoIva == 'IVA 10%') this.gasto.tipo_iva = 'iva10'
    if (this.tipoIva == 'IVA 5%') this.gasto.tipo_iva = 'iva5'
    if (this.tipoIva == 'EXENTAS') this.gasto.tipo_iva = 'exenta'
    console.log(this.gasto);
    
    let resp = await this.egresoService.updateEgreso(this.gasto)
    console.log(resp);
    this.ngOnInit()
  }

}


