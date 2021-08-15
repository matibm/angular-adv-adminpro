import { UsuarioService } from './../../services/usuario.service';
import { Movimiento } from './../../models/movimiento';
import { MovimientoService } from './../../services/movimiento.service';
import { Factura } from './../../models/factura';
import { FacturaService } from './../../services/factura.service';
import { Contrato } from './../../models/contrato';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratoService } from './../../services/contrato.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-info-contrato',
  templateUrl: './info-contrato.component.html',
  styleUrls: ['./info-contrato.component.css']
})
export class InfoContratoComponent implements OnInit {

  constructor(
    public _contratoService: ContratoService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public _facturaService: FacturaService,
    public _usuarioService: UsuarioService,
    public _movimientoService: MovimientoService

  ) { }
  contrato: Contrato;
  id;
  facturas: Factura[];
  esUdp = false;
  esPsv = false;
  esPsm = false;
  cliente;
  titular;
  cobrador;
  movimientos: Movimiento[];
  vendedor;
  producto;
  titularAlternativo;
  facturasCount = 0;
  facturaOptions: any;
  fondos;
  fondo;
  facturasAPagar;
  showModalPdf = false;
  radioValue;
  montoTotal;
  saldo = 0
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
      name: 'Débito Automático',
      value: 'DEBITO'
    },
    {
      name: 'Transferencia Bancaria',
      value: 'BANCARIA'
    }
  ];
  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.contrato = await this._contratoService.getContratoById(this.id);
    this.calcularSaldoPendiente(this.contrato)
    if (this.contrato.eliminado === true) {
      swal.fire({
        icon: 'error',
        title: 'Contrato No Disponible',
        // text: 'I will close in 2 seconds.',
        confirmButtonText: 'OK' 
      });
      this.router.navigateByUrl('/')
    }
    this.radioValue = this.contrato.tipo_pago;
    this.titular = this.contrato.titular;
    this.cliente = this.contrato.titular;
    this.producto = this.contrato.producto;
    this.vendedor = this.contrato.vendedor;
    this.cobrador = this.contrato.cobrador;
    this.titularAlternativo = this.contrato?.titular_alternativo;
    if (this.producto.COD_CORTO == 'U.D.P.') {
      this.esUdp = true;
    } else if (this.producto.COD_CORTO == 'P.S.M.') {
      this.esPsm = true;
    }
     else if (this.producto.COD_CORTO == 'P.S.V.') {
      this.esPsv = true;
    }
    // this.facturas = await this._facturaService.getFacturasByContrato(this.contrato._id)
    this.facturaOptions = { contrato: this.contrato._id, get_total:'1' };
    const respFacturas = await this._facturaService.getFacturasOptions(this.facturaOptions,  {key:'vencimiento', value: 1});
    console.log(respFacturas);
    this.montoTotal = respFacturas.montoTotal;
    this.facturas = respFacturas.facturas;
    this.facturasCount = respFacturas.count;
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', '');
    this.movimientos = (await this._movimientoService.getAllMovimientos({ contrato: this.contrato._id })).movimientos;
  }

  calcularPagoPorMonto(monto) {
    let montoAuxiliar = 0;
    const facturasAux = [];
    for (let i = 0; i < this.facturas.length; i++) {
      const factura = this.facturas[i];
      if (factura.pagado == false && factura.servicio.COD_CORTO != 'C.M.P.') {
        if (montoAuxiliar < monto) {
          facturasAux.push(factura);
          montoAuxiliar += factura.haber;
        } else if (montoAuxiliar > monto) {
          facturasAux.push(factura);
          montoAuxiliar += factura.haber;
        }
      }
    }
  }

  crearMovimiento() {
    localStorage.setItem('movimiento_contrato', JSON.stringify(this.contrato));
    localStorage.setItem('crear_movimiento', 'true');
    this.router.navigateByUrl('/admin/movimientos');
  }

  async getFacturasApagar(id, monto) {
    if (monto < 1) {
      return;
    }
    this.facturasAPagar = await this._facturaService.pagarPorMonto({ contrato: id, monto });
  }

  async confirmarPago(id, monto, fondo) {
     await this._facturaService.pagarPorMonto({ contrato: id, monto, confirmado: true, fondo: fondo._id });
     this.ngOnInit();
     this.facturasAPagar = null;
  }
  async searchBancos(val) {
    this.fondos = await this._usuarioService.buscarUsuarios('BANCOS', val.term);
  }


  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.NOMBRES.toLowerCase().indexOf(term) > -1 ||
      item.APELLIDOS.toLowerCase().includes(term) ||
      item.RAZON.toLowerCase().includes(term) ||
      item.RUC.toLowerCase().includes(term);
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

}
