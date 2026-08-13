import { Component, OnInit } from '@angular/core';
import { OrdenesCobroService } from 'src/app/services/ordenes-cobro.service';
import { FacturaService } from 'src/app/services/factura.service';
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
  loadingFE = false;

  conciliadoFiltro: boolean | null = null;

  // Conciliación con el CSV de PagoPar
  mostrarConciliacion = false;
  archivoConciliacion: File | null = null;
  preview: any = null;
  seleccionadas = new Set<string>();
  loadingPreview = false;
  loadingAplicar = false;

  estados = [
    { value: null, label: 'Todos' },
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'PAGADO', label: 'Pagado' },
    { value: 'EXPIRADO', label: 'Expirado' },
    { value: 'CANCELADO', label: 'Cancelado' },
  ];

  conciliados = [
    { value: null, label: 'Todos' },
    { value: false, label: 'Sin conciliar' },
    { value: true, label: 'Conciliados' },
  ];

  constructor(
    private _ordenesCobroService: OrdenesCobroService,
    private _facturaService: FacturaService,
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
        this.limit,
        this.conciliadoFiltro
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

  getPagoId(orden: any): string | null {
    if (!orden || !orden.pago) return null;
    return orden.pago._id || orden.pago;
  }

  async descargarFacturaPDF() {
    const pagoId = this.getPagoId(this.ordenSeleccionada);
    if (!pagoId) {
      this.notifier.notify('warning', 'No hay pago asociado para descargar la factura');
      return;
    }
    this.loadingFE = true;
    try {
      await this._facturaService.descargarArchivoPDF(pagoId);
    } catch (e) {
      this.notifier.notify('error', 'No se pudo descargar la factura');
    } finally {
      this.loadingFE = false;
    }
  }

  // ---- Conciliación con el CSV de PagoPar ----

  abrirConciliacion() {
    this.mostrarConciliacion = true;
    this.archivoConciliacion = null;
    this.preview = null;
    this.seleccionadas.clear();
  }

  cerrarConciliacion() {
    this.mostrarConciliacion = false;
    this.preview = null;
    this.archivoConciliacion = null;
    this.seleccionadas.clear();
  }

  onArchivoSeleccionado(event: any) {
    this.archivoConciliacion = event?.target?.files?.[0] || null;
    this.preview = null;
    this.seleccionadas.clear();
  }

  async analizarArchivo() {
    if (!this.archivoConciliacion) {
      this.notifier.notify('warning', 'Elegí primero el CSV exportado de PagoPar');
      return;
    }
    this.loadingPreview = true;
    this.preview = null;
    try {
      const resp: any = await this._ordenesCobroService.previewConciliacion(this.archivoConciliacion);
      this.preview = resp;
      // Por defecto vienen todas tildadas: el caso normal es conciliar el lote entero.
      this.seleccionadas = new Set<string>((resp.a_conciliar || []).map((i: any) => i.orden._id));
    } catch (error: any) {
      console.error('Error al analizar el CSV:', error);
      this.notifier.notify('error', error?.error?.mensaje || 'No se pudo leer el archivo');
    } finally {
      this.loadingPreview = false;
    }
  }

  toggleOrden(id: string) {
    if (this.seleccionadas.has(id)) {
      this.seleccionadas.delete(id);
    } else {
      this.seleccionadas.add(id);
    }
  }

  get todasSeleccionadas(): boolean {
    const total = this.preview?.a_conciliar?.length || 0;
    return total > 0 && this.seleccionadas.size === total;
  }

  toggleTodas() {
    if (this.todasSeleccionadas) {
      this.seleccionadas.clear();
    } else {
      this.seleccionadas = new Set<string>((this.preview?.a_conciliar || []).map((i: any) => i.orden._id));
    }
  }

  /** Totales de lo que está tildado en este momento. */
  get totalesSeleccion() {
    const items = (this.preview?.a_conciliar || []).filter((i: any) => this.seleccionadas.has(i.orden._id));
    return items.reduce(
      (acc: any, i: any) => ({
        cantidad: acc.cantidad + 1,
        monto_bruto: acc.monto_bruto + (i.fila.monto_bruto || 0),
        monto_comision: acc.monto_comision + (i.fila.monto_comision || 0),
        monto_neto: acc.monto_neto + (i.fila.monto_neto || 0),
      }),
      { cantidad: 0, monto_bruto: 0, monto_comision: 0, monto_neto: 0 }
    );
  }

  async aplicarConciliacion() {
    if (!this.archivoConciliacion || !this.seleccionadas.size) return;
    this.loadingAplicar = true;
    try {
      const resp: any = await this._ordenesCobroService.aplicarConciliacion(
        this.archivoConciliacion,
        Array.from(this.seleccionadas)
      );
      this.notifier.notify('success', `${resp.marcadas} orden(es) marcadas como conciliadas`);
      this.cerrarConciliacion();
      await this.cargarOrdenes();
    } catch (error: any) {
      console.error('Error al conciliar:', error);
      this.notifier.notify('error', error?.error?.mensaje || 'No se pudo conciliar');
    } finally {
      this.loadingAplicar = false;
    }
  }

  async abrirKUDETicket() {
    const pagoId = this.getPagoId(this.ordenSeleccionada);
    if (!pagoId) {
      this.notifier.notify('warning', 'No hay pago asociado para el ticket KUDE');
      return;
    }
    this.loadingFE = true;
    try {
      await this._facturaService.getTicketKUDE(pagoId);
      window.open(`/admin/factura-ticket-kude/${pagoId}`, '_blank');
    } catch (e) {
      this.notifier.notify('error', 'No se pudo generar el ticket KUDE');
    } finally {
      this.loadingFE = false;
    }
  }
}
