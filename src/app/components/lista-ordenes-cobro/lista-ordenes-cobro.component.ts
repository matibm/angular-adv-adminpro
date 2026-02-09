import { Component, OnInit } from '@angular/core';
import { OrdenesCobroService } from 'src/app/services/ordenes-cobro.service';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-lista-ordenes-cobro',
  templateUrl: './lista-ordenes-cobro.component.html',
  styleUrls: ['./lista-ordenes-cobro.component.css']
})
export class ListaOrdenesCobroComponent implements OnInit {
  ordenes: any[] = [];
  count = 0;
  page = 1;
  limit = 20;
  loading = false;
  estadoFiltro: string | null = null;
  ordenSeleccionada: any = null;
  loadingDetalle = false;

  estados = [
    { value: null, label: 'Todos' },
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'PAGADO', label: 'Pagado' },
    { value: 'EXPIRADO', label: 'Expirado' },
    { value: 'CANCELADO', label: 'Cancelado' },
  ];

  constructor(
    private _ordenesCobroService: OrdenesCobroService,
    private notifier: NotifierService,
  ) {}

  async ngOnInit() {
    await this.cargarOrdenes();
  }

  async cargarOrdenes() {
    this.loading = true;
    try {
      const resp: any = await this._ordenesCobroService.getOrdenes(
        this.estadoFiltro || undefined,
        this.page,
        this.limit
      );
      this.ordenes = resp.ordenes || [];
      this.count = resp.count || 0;
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      this.notifier.notify('error', 'Error al cargar órdenes de cobro');
    } finally {
      this.loading = false;
    }
  }

  async onFiltroEstadoChange() {
    this.page = 1;
    await this.cargarOrdenes();
  }

  async verDetalle(orden: any) {
    this.loadingDetalle = true;
    this.ordenSeleccionada = null;
    try {
      const resp: any = await this._ordenesCobroService.getOrdenById(orden._id);
      this.ordenSeleccionada = resp.orden;
    } catch (error) {
      console.error('Error al cargar detalle:', error);
      this.notifier.notify('error', 'Error al cargar detalle de la orden');
    } finally {
      this.loadingDetalle = false;
    }
  }

  cerrarDetalle() {
    this.ordenSeleccionada = null;
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'bg-warning';
      case 'PAGADO': return 'bg-success';
      case 'EXPIRADO': return 'bg-secondary';
      case 'CANCELADO': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getNombreCliente(orden: any): string {
    if (orden.titular) {
      return [orden.titular.NOMBRES, orden.titular.APELLIDOS].filter(Boolean).join(' ').trim() || 'Sin nombre';
    }
    return 'Sin datos';
  }

  cambiarPagina(p: number) {
    this.page = p;
    this.cargarOrdenes();
  }

  get totalPaginas(): number {
    return Math.ceil(this.count / this.limit) || 1;
  }
}
