import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from 'src/app/config/global';
import { UsuarioService } from 'src/app/services/usuario.service';

interface SumaItem {
  total: number;
  count: number;
}

interface ResumenDashboard {
  ok: boolean;
  generado: number;
  cobranzas: { hoy: SumaItem; ayer: SumaItem; semana: SumaItem; mes: SumaItem };
  gastos: { semana: SumaItem; mes: SumaItem };
  contratos: { count_mes: number; ultimos: any[] };
  ultimos_gastos: any[];
}

interface FacturasSemanaResp {
  ok: boolean;
  page: number;
  limit: number;
  total: number;
  pages: number;
  items: any[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [`
    .kpi-card { border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.06); transition: transform .15s; }
    .kpi-card:hover { transform: translateY(-2px); }
    .kpi-label { font-size: 12px; color: #98a6ad; text-transform: uppercase; letter-spacing: .5px; }
    .kpi-value { font-size: 22px; font-weight: 600; color: #2c3e50; }
    .kpi-sub { font-size: 12px; color: #98a6ad; }
    .quick-action { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 8px;
                    background: #f7f9fc; cursor: pointer; transition: all .15s; border: 1px solid transparent; }
    .quick-action:hover { background: #eaf3ff; border-color: #b6d4fe; }
    .quick-action i { font-size: 22px; color: #3b82f6; }
    .ultimo-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eef1f5; }
    .ultimo-item:last-child { border-bottom: 0; }
    .ultimo-item .titulo { font-weight: 500; color: #2c3e50; }
    .ultimo-item .meta { font-size: 12px; color: #98a6ad; }
    .ultimo-item .monto { font-weight: 600; color: #16a34a; white-space: nowrap; }
    .ultimo-item .monto.gasto { color: #dc2626; }
  `]
})
export class DashboardComponent implements OnInit {
  cargando = false;
  error: string = null;
  resumen: ResumenDashboard = null;
  esAdmin = false;

  facturasSemana: FacturasSemanaResp = null;
  cargandoFacturas = false;
  paginaFacturas = 1;
  readonly limiteFacturas = 10;

  accesosDirectos = [
    { titulo: 'Registrar pago', icon: 'mdi mdi-cash-multiple', ruta: '/admin/cobranzas' },
    { titulo: 'Nuevo contrato', icon: 'mdi mdi-file-document-edit', ruta: '/admin/crear_contrato' },
    { titulo: 'Cargar gasto', icon: 'mdi mdi-cash-minus', ruta: '/admin/gastos', queryParams: { seccion: 'home' } },
    { titulo: 'Buscar usuario', icon: 'mdi mdi-account-search', ruta: '/admin/usuarios' },
    { titulo: 'Nuevo aviso fúnebre', icon: 'mdi mdi-clipboard-text', ruta: '/admin/crear_aviso_funebre' }
  ];

  constructor(
    private http: HttpClient,
    public usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.usuarioService?.usuario?.role === 'ADMIN_ROLE';
    if (this.esAdmin) {
      this.cargarResumen();
      this.cargarFacturasSemana(1);
    }
  }

  cargarResumen() {
    this.cargando = true;
    this.error = null;
    const url = `${URL_SERVICIOS}/dashboard/resumen?token=${this.usuarioService.token}`;
    this.http.get<ResumenDashboard>(url).subscribe({
      next: (resp) => {
        this.resumen = resp;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err?.error?.mensaje || 'No se pudo cargar el resumen';
        this.cargando = false;
      }
    });
  }

  irA(acceso: { ruta: string; queryParams?: any }) {
    this.router.navigate([acceso.ruta], { queryParams: acceso.queryParams || {} });
  }

  cargarFacturasSemana(page: number) {
    this.cargandoFacturas = true;
    const url = `${URL_SERVICIOS}/dashboard/facturas_emitidas_semana`
      + `?token=${this.usuarioService.token}&page=${page}&limit=${this.limiteFacturas}`;
    this.http.get<FacturasSemanaResp>(url).subscribe({
      next: (resp) => {
        this.facturasSemana = resp;
        this.paginaFacturas = resp.page;
        this.cargandoFacturas = false;
      },
      error: () => {
        this.cargandoFacturas = false;
      }
    });
  }

  paginaAnterior() {
    if (this.paginaFacturas > 1) this.cargarFacturasSemana(this.paginaFacturas - 1);
  }
  paginaSiguiente() {
    if (this.facturasSemana && this.paginaFacturas < this.facturasSemana.pages) {
      this.cargarFacturasSemana(this.paginaFacturas + 1);
    }
  }

  variacionVsAyer(): { pct: number; positivo: boolean } | null {
    if (!this.resumen) return null;
    const hoy = this.resumen.cobranzas.hoy.total;
    const ayer = this.resumen.cobranzas.ayer.total;
    if (!ayer) return null;
    const pct = Math.round(((hoy - ayer) / ayer) * 100);
    return { pct: Math.abs(pct), positivo: pct >= 0 };
  }
}
