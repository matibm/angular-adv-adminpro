import { AvisoFunebre } from './../../models/aviso-funebre';
import { AvisosFunebresService } from './../../services/avisos-funebres.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { URL_SERVICIOS } from '../../config/global';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-lista-avisos-funebres',
  templateUrl: './lista-avisos-funebres.component.html',
  styleUrls: ['./lista-avisos-funebres.component.css']
})
export class ListaAvisosFunebresComponent implements OnInit {

  constructor(
    public _avisosFunebresService: AvisosFunebresService,
    public _usuarioService: UsuarioService
  ) { }

  Math = Math;
  
  // Pestaña activa
  tabActiva: 'avisos' | 'condolencias' | 'recuerdos' | 'fotografias' = 'avisos';

  // === AVISOS ===
  avisos: AvisoFunebre[] = [];
  loadingAvisos = false;
  pageAvisos = 1;
  limitAvisos = 10;
  totalAvisos = 0;

  // === CONDOLENCIAS ===
  condolencias: any[] = [];
  loadingCondolencias = false;
  pageCondolencias = 1;
  limitCondolencias = 20;
  totalCondolencias = 0;
  estadisticasCondolencias = { total: 0, pendientes: 0, aprobadas: 0, rechazadas: 0 };

  // === RECUERDOS ===
  recuerdos: any[] = [];
  loadingRecuerdos = false;
  pageRecuerdos = 1;
  limitRecuerdos = 20;
  totalRecuerdos = 0;
  estadisticasRecuerdos = { total: 0, pendientes: 0, aprobados: 0, rechazados: 0 };

  // === FOTOGRAFÍAS ===
  fotografias: any[] = [];
  loadingFotografias = false;
  pageFotografias = 1;
  limitFotografias = 20;
  totalFotografias = 0;
  estadisticasFotografias = { total: 0, pendientes: 0, aprobadas: 0, rechazadas: 0 };

  // Selección múltiple (compartida)
  seleccionadas: Set<string> = new Set();
  seleccionarTodas = false;

  async ngOnInit() {
    await this.cargarAvisos();
    await this.cargarTodasEstadisticas();
  }

  async cargarTodasEstadisticas() {
    try {
      const [condolencias, recuerdos, fotografias] = await Promise.all([
        this._avisosFunebresService.getCondolenciasEstadisticas(),
        this._avisosFunebresService.getRecuerdosEstadisticas(),
        this._avisosFunebresService.getFotografiasEstadisticas()
      ]);
      this.estadisticasCondolencias = condolencias;
      this.estadisticasRecuerdos = recuerdos;
      this.estadisticasFotografias = fotografias;
    } catch (error) {
      console.error(error);
    }
  }

  cambiarTab(tab: 'avisos' | 'condolencias' | 'recuerdos' | 'fotografias') {
    this.tabActiva = tab;
    this.seleccionadas.clear();
    this.seleccionarTodas = false;
    
    if (tab === 'condolencias' && this.condolencias.length === 0) {
      this.cargarCondolencias();
    } else if (tab === 'recuerdos' && this.recuerdos.length === 0) {
      this.cargarRecuerdos();
    } else if (tab === 'fotografias' && this.fotografias.length === 0) {
      this.cargarFotografias();
    }
  }

  // ============================================================================
  // AVISOS
  // ============================================================================

  async cargarAvisos() {
    this.loadingAvisos = true;
    try {
      const resp = await this._avisosFunebresService.getAvisosFunebres(this.pageAvisos, this.limitAvisos);
      this.avisos = resp.avisos;
      this.totalAvisos = resp.total;
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingAvisos = false;
    }
  }

  cambiarPaginaAvisos(valor: number) {
    const nuevaPagina = this.pageAvisos + valor;
    if (nuevaPagina >= 1 && nuevaPagina <= Math.ceil(this.totalAvisos / this.limitAvisos)) {
      this.pageAvisos = nuevaPagina;
      this.cargarAvisos();
    }
  }

  async eliminarAviso(aviso: AvisoFunebre) {
    const result = await swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar el aviso de ${aviso.nombre_completo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await this._avisosFunebresService.eliminarAvisoFunebre(aviso._id);
        await this.cargarAvisos();
      } catch (error) {
        console.error(error);
      }
    }
  }

  getImagenUrl(foto: string): string {
    if (!foto) return '';
    if (foto.startsWith('http')) return foto;

    if (foto.startsWith('/uploads/avisos_funebres/')) {
      const filename = foto.split('/').pop();
      const token = this._usuarioService?.token || '';
      return `${URL_SERVICIOS}/avisos-funebres/imagen/${filename}?token=${token}`;
    }

    if (foto.startsWith('/avisos-funebres/imagen/')) {
      const token = this._usuarioService?.token || '';
      return `${URL_SERVICIOS}${foto}?token=${token}`;
    }

    return `${URL_SERVICIOS}${foto}`;
  }

  getFotografiaVisitanteUrl(imagenUrl: string): string {
    if (!imagenUrl) return '';
    const token = this._usuarioService?.token || '';
    return `${URL_SERVICIOS}${imagenUrl}?token=${token}`;
  }

  formatearFecha(fecha: Date | string | number): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PY');
  }

  formatearFechaHora(fecha: Date | string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PY', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  truncarTexto(texto: string, maxLength: number = 100): string {
    if (!texto) return '';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
  }

  // ============================================================================
  // CONDOLENCIAS
  // ============================================================================

  async cargarCondolencias() {
    this.loadingCondolencias = true;
    try {
      const resp = await this._avisosFunebresService.getCondolenciasPendientes(this.pageCondolencias, this.limitCondolencias);
      this.condolencias = resp.condolencias;
      this.totalCondolencias = resp.total;
      this.seleccionadas.clear();
      this.seleccionarTodas = false;
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingCondolencias = false;
    }
  }

  cambiarPaginaCondolencias(valor: number) {
    const nuevaPagina = this.pageCondolencias + valor;
    if (nuevaPagina >= 1 && nuevaPagina <= Math.ceil(this.totalCondolencias / this.limitCondolencias)) {
      this.pageCondolencias = nuevaPagina;
      this.cargarCondolencias();
    }
  }

  async aprobarCondolencia(condolencia: any) {
    try {
      await this._avisosFunebresService.aprobarCondolencia(condolencia._id);
      await this.cargarCondolencias();
      await this.cargarTodasEstadisticas();
    } catch (error) {
      console.error(error);
    }
  }

  async rechazarCondolencia(condolencia: any) {
    const result = await swal.fire({
      title: '¿Rechazar condolencia?',
      text: `¿Está seguro de rechazar el mensaje de ${condolencia.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await this._avisosFunebresService.rechazarCondolencia(condolencia._id);
        await this.cargarCondolencias();
        await this.cargarTodasEstadisticas();
      } catch (error) {
        console.error(error);
      }
    }
  }

  // ============================================================================
  // RECUERDOS
  // ============================================================================

  async cargarRecuerdos() {
    this.loadingRecuerdos = true;
    try {
      const resp = await this._avisosFunebresService.getRecuerdosPendientes(this.pageRecuerdos, this.limitRecuerdos);
      this.recuerdos = resp.recuerdos;
      this.totalRecuerdos = resp.total;
      this.seleccionadas.clear();
      this.seleccionarTodas = false;
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingRecuerdos = false;
    }
  }

  cambiarPaginaRecuerdos(valor: number) {
    const nuevaPagina = this.pageRecuerdos + valor;
    if (nuevaPagina >= 1 && nuevaPagina <= Math.ceil(this.totalRecuerdos / this.limitRecuerdos)) {
      this.pageRecuerdos = nuevaPagina;
      this.cargarRecuerdos();
    }
  }

  async aprobarRecuerdo(recuerdo: any) {
    try {
      await this._avisosFunebresService.aprobarRecuerdo(recuerdo._id);
      await this.cargarRecuerdos();
      await this.cargarTodasEstadisticas();
    } catch (error) {
      console.error(error);
    }
  }

  async rechazarRecuerdo(recuerdo: any) {
    const result = await swal.fire({
      title: '¿Rechazar recuerdo?',
      text: `¿Está seguro de rechazar el recuerdo de ${recuerdo.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await this._avisosFunebresService.rechazarRecuerdo(recuerdo._id);
        await this.cargarRecuerdos();
        await this.cargarTodasEstadisticas();
      } catch (error) {
        console.error(error);
      }
    }
  }

  // ============================================================================
  // FOTOGRAFÍAS
  // ============================================================================

  async cargarFotografias() {
    this.loadingFotografias = true;
    try {
      const resp = await this._avisosFunebresService.getFotografiasPendientes(this.pageFotografias, this.limitFotografias);
      this.fotografias = resp.fotografias;
      this.totalFotografias = resp.total;
      this.seleccionadas.clear();
      this.seleccionarTodas = false;
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingFotografias = false;
    }
  }

  cambiarPaginaFotografias(valor: number) {
    const nuevaPagina = this.pageFotografias + valor;
    if (nuevaPagina >= 1 && nuevaPagina <= Math.ceil(this.totalFotografias / this.limitFotografias)) {
      this.pageFotografias = nuevaPagina;
      this.cargarFotografias();
    }
  }

  async aprobarFotografia(fotografia: any) {
    try {
      await this._avisosFunebresService.aprobarFotografia(fotografia._id);
      await this.cargarFotografias();
      await this.cargarTodasEstadisticas();
    } catch (error) {
      console.error(error);
    }
  }

  async rechazarFotografia(fotografia: any) {
    const result = await swal.fire({
      title: '¿Rechazar fotografía?',
      text: `¿Está seguro de rechazar la fotografía de ${fotografia.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await this._avisosFunebresService.rechazarFotografia(fotografia._id);
        await this.cargarFotografias();
        await this.cargarTodasEstadisticas();
      } catch (error) {
        console.error(error);
      }
    }
  }

  // ============================================================================
  // SELECCIÓN MÚLTIPLE (Genérica)
  // ============================================================================

  getItemsActuales(): any[] {
    switch (this.tabActiva) {
      case 'condolencias': return this.condolencias;
      case 'recuerdos': return this.recuerdos;
      case 'fotografias': return this.fotografias;
      default: return [];
    }
  }

  toggleSeleccion(id: string) {
    if (this.seleccionadas.has(id)) {
      this.seleccionadas.delete(id);
    } else {
      this.seleccionadas.add(id);
    }
    this.seleccionarTodas = this.seleccionadas.size === this.getItemsActuales().length;
  }

  toggleSeleccionarTodas() {
    const items = this.getItemsActuales();
    if (this.seleccionarTodas) {
      this.seleccionadas.clear();
      this.seleccionarTodas = false;
    } else {
      items.forEach(item => this.seleccionadas.add(item._id));
      this.seleccionarTodas = true;
    }
  }

  async aprobarSeleccionadas() {
    if (this.seleccionadas.size === 0) return;
    
    try {
      const ids = Array.from(this.seleccionadas);
      // Por ahora solo condolencias tienen aprobación múltiple en backend
      if (this.tabActiva === 'condolencias') {
        await this._avisosFunebresService.aprobarCondolenciasMultiple(ids);
        await this.cargarCondolencias();
      }
      // Para recuerdos y fotografías, aprobar uno por uno
      else if (this.tabActiva === 'recuerdos') {
        for (const id of ids) {
          await this._avisosFunebresService.aprobarRecuerdo(id);
        }
        await this.cargarRecuerdos();
      } else if (this.tabActiva === 'fotografias') {
        for (const id of ids) {
          await this._avisosFunebresService.aprobarFotografia(id);
        }
        await this.cargarFotografias();
      }
      await this.cargarTodasEstadisticas();
    } catch (error) {
      console.error(error);
    }
  }

  async rechazarSeleccionadas() {
    if (this.seleccionadas.size === 0) return;

    const result = await swal.fire({
      title: '¿Rechazar seleccionadas?',
      text: `¿Está seguro de rechazar ${this.seleccionadas.size} elementos?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, rechazar todas',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const ids = Array.from(this.seleccionadas);
        if (this.tabActiva === 'condolencias') {
          await this._avisosFunebresService.rechazarCondolenciasMultiple(ids);
          await this.cargarCondolencias();
        } else if (this.tabActiva === 'recuerdos') {
          for (const id of ids) {
            await this._avisosFunebresService.rechazarRecuerdo(id);
          }
          await this.cargarRecuerdos();
        } else if (this.tabActiva === 'fotografias') {
          for (const id of ids) {
            await this._avisosFunebresService.rechazarFotografia(id);
          }
          await this.cargarFotografias();
        }
        await this.cargarTodasEstadisticas();
      } catch (error) {
        console.error(error);
      }
    }
  }
}
