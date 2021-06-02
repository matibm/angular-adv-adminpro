import { UsuarioService } from './../../services/usuario.service';
import { MovimientoService } from './../../services/movimiento.service';
import { FacturaService } from './../../services/factura.service';
import { CajaService } from './../../services/caja.service';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {

  constructor(
    public _cajaService: CajaService,
    public _facturaService: FacturaService,
    public _usuarioService: UsuarioService,
    public _movimientoService: MovimientoService
  ) {
    const agrupar = localStorage.getItem('agrupar_por_cierres') || 'false';
    this.agruparPorcierres = agrupar == 'true' ? true : false;
  }
  agruparPorcierres;
  filtrarPorFecha;
  cierres;
  facturas;
  movimientos;
  date_start = new Date(new Date().getTime() - (86400000 * 7)).getTime();
  date_end = new Date().getTime();
  facturasCount;
  cliente;
  clientes;
  vendedor;
  vendedores;
  cobrador;
  cobradores;
  totalIngresos = 0;
  totalMovimientos = 0;






















  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Series C', yAxisID: 'y-axis-1' }
  ];

  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  ngOnInit(): void {
    this.getCierres();
    this.getFacturas();
    this.getMovimientos();
  }

  async getCierres() {
    this.cierres = await this._cajaService.getCierresDeCaja();
  }
  async getFacturas() {
    // let respf = await this._facturaService.getFacturas(true, null, null, null, 1, null, null)
    const respf = await this._facturaService.getFacturasOptions({pagado: true, page: 1, cerrado: true});

    this.facturasCount = respf.count;
    this.totalIngresos = respf.total;
    console.log(respf);

    this.facturas = respf.facturas;
  }

  async getMovimientos() {
    // let respM = await this._movimientoService.getMovimientosByDate()
    const respM = await this._movimientoService.getAllMovimientos({ page: 1, cerrado: true});
    console.log(respM);
    this.totalMovimientos = respM.total.monto_haber - respM.total.monto_total;
    this.movimientos = respM.movimientos;
  }


  switchAgrupar() {
    if (this.agruparPorcierres) {
      this.agruparPorcierres = false;
      localStorage.setItem('agrupar_por_cierres', 'false');
    } else {
      this.agruparPorcierres = true;
      localStorage.setItem('agrupar_por_cierres', 'true');
    }
  }
  async searchClientes(val: any) {
    if (val.term.length > 0) {
      this.clientes = await this._usuarioService.buscarUsuarios('CLIENTES', val.term);

    }
  }
  async searchCobrador(val: any) {
    if (val.term.length > 0) {
      this.cobradores = await this._usuarioService.buscarUsuarios('COBRADORES', val.term);

    }
  }
  async searchVendedore(val: any) {
    if (val.term.length > 0) {
      this.vendedores = await this._usuarioService.buscarUsuarios('VENDEDORES', val.term);

    }
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.NOMBRES.toLowerCase().indexOf(term) > -1 ||
      item.APELLIDOS.toLowerCase().includes(term) ||
      item.RAZON.toLowerCase().includes(term) ||
      item.RUC.toLowerCase().includes(term);
  }
  // public lineChartPlugins = [pluginAnnotations];



}
