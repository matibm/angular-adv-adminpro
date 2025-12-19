import { Component, OnInit } from '@angular/core';
import { FacturaService } from 'src/app/services/factura.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.component.html',
  styleUrls: ['./recibos.component.css']
})
export class RecibosComponent implements OnInit {
  items: any[] = []
  reciboSeleccionado: any
  facturas: any[] = []
  facturasOptions: any
  facturapdf:any
  montoTotal
  recibosPagados: any[] = []
  recibosPagadosSeleccionados: Set<string> = new Set() // IDs de recibos pagados seleccionados
  facturasSeleccionadas: { [reciboPagadoId: string]: Set<string> } = {} // Mapa de recibo_pagado_id -> Set de factura_ids seleccionadas
  loadingCancelarFacturas: { [reciboPagadoId: string]: boolean } = {} // Estados de carga por recibo pagado
  ordenVencimiento: { [reciboPagadoId: string]: 'asc' | 'desc' | null } = {} // Ordenamiento por vencimiento por recibo pagado
  
  // Estados de carga
  loadingCancelarRecibo = false
  loadingPagarRecibo = false
  loadingCancelarReciboPagado: { [key: string]: boolean } = {} // Mapa de IDs de recibos pagados a su estado de carga
  loadingCancelarMultiples = false
  loadingMostrarModal = false
  constructor(
    private readonly recibosService: FacturaService
  ) { }

  async ngOnInit() {
    const recibos:any = await this.recibosService.getRecibos()
    this.items = recibos.recibos
    console.log(recibos);
  }

  async verCuotas(item) {
    this.facturasOptions = {
      tipo_factura: 'CREDITO',
      pago: item.pago?._id,
      get_total: '1'
    }
    const facturas = await this.recibosService.getFacturasOptions(this.facturasOptions)
    console.log(facturas);
    this.facturas = facturas.facturas
    this.reciboSeleccionado = item
    this.montoTotal = facturas.montoTotal
    this.getRecibosPagados()

  }

  async mostrarModal(id) {
    this.loadingMostrarModal = true;
    try {
      const resp = await this.recibosService.getDetallePago(id);
      console.log(resp);

      const pago = resp.pago;
      const facturas = resp.facturas;
      const servicios = [];
      for (let i = 0; i < facturas.length; i++) {
        const factura = facturas[i];
        servicios.push({
          cantidad: 1,
          concepto: factura.servicio.NOMBRE,
          precioUnitario: factura.haber,
          cincoPorciento: null,
          diezPorciento: factura.haber / 11
        });
      }
      this.facturapdf = {
        _id: pago._id,
        comentario: pago.comentario,
        activo: pago.activo,
        nombres: `${pago.cliente.NOMBRES} ${pago.cliente.APELLIDOS}`,
        fecha: pago.fecha_creacion,
        direccion: `direccion de prueba`,
        ruc: pago.cliente.RUC,
        tel: pago.cliente.TELEFONO1,
        notaDeRemision: '123123',
        servicios,
        nro_talonario: 'tukii',
        nro_factura: 'tuki'
      };
      console.log(this.facturapdf);
    } catch (error) {
      console.error('Error al cargar detalle de pago:', error);
    } finally {
      this.loadingMostrarModal = false;
    }
  }


  async pagarRecibo(monto:number){
    if (this.loadingPagarRecibo) return;
    
    this.loadingPagarRecibo = true;
    try {
      console.log(this.reciboSeleccionado);

      await this.recibosService.pagarRecibo({
        pago: this.reciboSeleccionado.pago._id,
        monto: Number(monto),
        recibo: this.reciboSeleccionado._id
      })

      await this.verCuotas(this.reciboSeleccionado)
    } catch (error) {
      console.error('Error al pagar recibo:', error);
    } finally {
      this.loadingPagarRecibo = false;
    }
  }

  async getRecibosPagados() {
    const resp:any = await this.recibosService.getRecibosPagados(this.reciboSeleccionado._id);
    console.log(resp);

    this.recibosPagados = resp.list
  }

  printRecibo(item) {
    console.log(item);
    localStorage.setItem('recibo', JSON.stringify(item));
    localStorage.setItem('recibo-cliente', JSON.stringify(this.reciboSeleccionado.cliente));
    const wopen = window.open('/recibo-pdf');
  }

  async cancelarReciboPagado(reciboPagado: any) {
    if (!reciboPagado._id || this.loadingCancelarReciboPagado[reciboPagado._id]) return;
    
    // Confirmación con SweetAlert2
    const result = await swal.fire({
      icon: 'warning',
      title: '¿Cancelar recibo pagado?',
      html: `
        <div class="text-start">
          <p><strong>Nro Recibo:</strong> ${reciboPagado.nro_recibo}</p>
          <p><strong>Monto:</strong> ${reciboPagado.monto?.toLocaleString('es-PY')} Gs</p>
          <p><strong>Fecha:</strong> ${new Date(reciboPagado.fecha).toLocaleDateString('es-PY')}</p>
          <p class="mt-2"><strong>Esta acción revertirá el pago de las cuotas asociadas.</strong></p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
    });

    if (!result.isConfirmed) {
      return;
    }
    
    this.loadingCancelarReciboPagado[reciboPagado._id] = true;
    try {
      await this.recibosService.cancelarReciboPagado(reciboPagado._id);
      // Recargar los recibos pagados después de cancelar
      await this.getRecibosPagados();
      // Recargar las facturas también
      await this.verCuotas(this.reciboSeleccionado);
    } catch (error) {
      console.error('Error al cancelar recibo pagado:', error);
    } finally {
      this.loadingCancelarReciboPagado[reciboPagado._id] = false;
    }
  }

  toggleReciboPagadoSeleccionado(reciboPagado: any) {
    if (reciboPagado.cancelado) return; // No permitir seleccionar cancelados
    
    const id = reciboPagado._id;
    if (this.recibosPagadosSeleccionados.has(id)) {
      this.recibosPagadosSeleccionados.delete(id);
    } else {
      this.recibosPagadosSeleccionados.add(id);
    }
  }

  estaSeleccionado(reciboPagado: any): boolean {
    return this.recibosPagadosSeleccionados.has(reciboPagado._id);
  }

  async cancelarRecibosPagadosSeleccionados() {
    if (this.recibosPagadosSeleccionados.size === 0 || this.loadingCancelarMultiples) return;

    // Obtener los recibos pagados seleccionados para mostrar detalles
    const recibosSeleccionados = this.recibosPagados.filter(rp => 
      this.recibosPagadosSeleccionados.has(rp._id)
    );

    // Calcular monto total
    const montoTotal = recibosSeleccionados.reduce((sum, rp) => sum + (rp.monto || 0), 0);

    // Confirmación con SweetAlert2
    const result = await swal.fire({
      icon: 'warning',
      title: '¿Cancelar recibos pagados seleccionados?',
      html: `
        <div class="text-start">
          <p><strong>Cantidad:</strong> ${recibosSeleccionados.length} recibo(s) pagado(s)</p>
          <p><strong>Monto total:</strong> ${montoTotal.toLocaleString('es-PY')} Gs</p>
          <p class="mt-2"><strong>Esta acción revertirá el pago de todas las facturas asociadas a los recibos seleccionados.</strong></p>
          <div class="mt-3">
            <strong>Recibos a cancelar:</strong>
            <ul class="text-start mt-2">
              ${recibosSeleccionados.map(rp => 
                `<li>Nro ${rp.nro_recibo} - ${(rp.monto || 0).toLocaleString('es-PY')} Gs</li>`
              ).join('')}
            </ul>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar todos',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
    });

    if (!result.isConfirmed) {
      return;
    }

    this.loadingCancelarMultiples = true;
    const ids = Array.from(this.recibosPagadosSeleccionados);
    
    try {
      if (ids.length === 1) {
        // Si es solo uno, usar el método individual
        await this.recibosService.cancelarReciboPagado(ids[0]);
      } else {
        // Si son múltiples, usar el método de múltiples
        await this.recibosService.cancelarReciboPagados(ids);
      }
      
      // Limpiar selección
      this.recibosPagadosSeleccionados.clear();
      
      // Recargar los recibos pagados después de cancelar
      await this.getRecibosPagados();
      // Recargar las facturas también
      await this.verCuotas(this.reciboSeleccionado);
    } catch (error) {
      console.error('Error al cancelar recibos pagados:', error);
    } finally {
      this.loadingCancelarMultiples = false;
    }
  }

  async cancelarRecibo() {
    if (!this.reciboSeleccionado?._id || this.loadingCancelarRecibo) return;
    
    // Confirmación con SweetAlert2
    const result = await swal.fire({
      icon: 'warning',
      title: '¿Cancelar recibo?',
      html: `
        <div class="text-start">
          <p><strong>Cliente:</strong> ${this.reciboSeleccionado.cliente?.NOMBRES} ${this.reciboSeleccionado.cliente?.APELLIDOS}</p>
          <p><strong>Monto:</strong> ${(this.reciboSeleccionado.pago?.monto || 0).toLocaleString('es-PY')} Gs</p>
          <p><strong>Fecha:</strong> ${new Date(this.reciboSeleccionado.fecha).toLocaleDateString('es-PY')}</p>
          <p class="mt-2 text-danger"><strong>⚠️ Solo puedes cancelar un recibo si no tiene recibos pagados asociados.</strong></p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
    });

    if (!result.isConfirmed) {
      return;
    }
    
    this.loadingCancelarRecibo = true;
    try {
      await this.recibosService.cancelarRecibo(this.reciboSeleccionado._id);
      // Volver a la lista de recibos
      this.reciboSeleccionado = null;
      // Recargar la lista de recibos
      await this.ngOnInit();
    } catch (error) {
      console.error('Error al cancelar recibo:', error);
    } finally {
      this.loadingCancelarRecibo = false;
    }
  }

  isLoadingCancelarReciboPagado(reciboPagado: any): boolean {
    return this.loadingCancelarReciboPagado[reciboPagado._id] || false;
  }

  toggleFacturaSeleccionada(reciboPagado: any, factura: any, event?: any) {
    if (reciboPagado.cancelado || factura.pagado === false) {
      if (event) event.preventDefault();
      return;
    }
    
    const reciboId = reciboPagado._id;
    if (!this.facturasSeleccionadas[reciboId]) {
      this.facturasSeleccionadas[reciboId] = new Set();
    }
    
    const facturaId = factura._id;
    if (this.facturasSeleccionadas[reciboId].has(facturaId)) {
      this.facturasSeleccionadas[reciboId].delete(facturaId);
    } else {
      this.facturasSeleccionadas[reciboId].add(facturaId);
    }
  }

  estaFacturaSeleccionada(reciboPagado: any, factura: any): boolean {
    const reciboId = reciboPagado._id;
    if (!this.facturasSeleccionadas[reciboId]) {
      return false;
    }
    return this.facturasSeleccionadas[reciboId].has(factura._id);
  }

  getFacturasSeleccionadasCount(reciboPagado: any): number {
    const reciboId = reciboPagado._id;
    if (!this.facturasSeleccionadas[reciboId]) {
      return 0;
    }
    return this.facturasSeleccionadas[reciboId].size;
  }

  async cancelarFacturasSeleccionadas(reciboPagado: any) {
    const reciboId = reciboPagado._id;
    if (!this.facturasSeleccionadas[reciboId] || this.facturasSeleccionadas[reciboId].size === 0) {
      return;
    }

    if (this.loadingCancelarFacturas[reciboId]) return;

    const facturasIds = Array.from(this.facturasSeleccionadas[reciboId]);
    const facturas = reciboPagado.facturas.filter((f: any) => facturasIds.includes(f._id));
    const montoTotal = facturas.reduce((sum: number, f: any) => sum + (f.haber || 0), 0);

    // Confirmación con SweetAlert2
    const result = await swal.fire({
      icon: 'warning',
      title: '¿Cancelar facturas seleccionadas?',
      html: `
        <div class="text-start">
          <p><strong>Cantidad:</strong> ${facturas.length} factura(s)</p>
          <p><strong>Monto total:</strong> ${montoTotal.toLocaleString('es-PY')} Gs</p>
          <p class="mt-2"><strong>Esta acción revertirá el pago de las facturas seleccionadas.</strong></p>
          <div class="mt-3">
            <strong>Facturas a cancelar:</strong>
            <ul class="text-start mt-2">
              ${facturas.map((f: any) => 
                `<li>${(f.numero_talonario || '') + (f.numero_talonario && f.numero_factura ? '-' : '') + (f.numero_factura || '---')} - ${(f.haber || 0).toLocaleString('es-PY')} Gs</li>`
              ).join('')}
            </ul>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar facturas',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
    });

    if (!result.isConfirmed) {
      return;
    }

    this.loadingCancelarFacturas[reciboId] = true;
    try {
      await this.recibosService.cancelarFacturasReciboPagado(reciboId, facturasIds);
      
      // Limpiar selección
      this.facturasSeleccionadas[reciboId] = new Set();
      
      // Recargar los recibos pagados después de cancelar
      await this.getRecibosPagados();
      // Recargar las facturas también
      await this.verCuotas(this.reciboSeleccionado);
    } catch (error) {
      console.error('Error al cancelar facturas:', error);
    } finally {
      this.loadingCancelarFacturas[reciboId] = false;
    }
  }

  isLoadingCancelarFacturas(reciboPagado: any): boolean {
    return this.loadingCancelarFacturas[reciboPagado._id] || false;
  }

  toggleTodasLasFacturas(reciboPagado: any, event?: any) {
    if (reciboPagado.cancelado) {
      if (event) event.preventDefault();
      return;
    }
    
    const reciboId = reciboPagado._id;
    if (!this.facturasSeleccionadas[reciboId]) {
      this.facturasSeleccionadas[reciboId] = new Set();
    }

    const todasSeleccionadas = this.getFacturasSeleccionadasCount(reciboPagado) === reciboPagado.facturas.length;
    
    if (todasSeleccionadas) {
      // Deseleccionar todas
      this.facturasSeleccionadas[reciboId].clear();
    } else {
      // Seleccionar todas
      reciboPagado.facturas.forEach((factura: any) => {
        if (factura.pagado !== false) {
          this.facturasSeleccionadas[reciboId].add(factura._id);
        }
      });
    }
  }

  // Convierte timestamp UTC a hora local
  getFechaLocal(timestamp: number): Date | null {
    if (!timestamp) return null;
    // Si el timestamp está en segundos, convertir a milisegundos
    const timestampMs = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
    return new Date(timestampMs);
  }

  // Obtiene las facturas ordenadas por vencimiento
  getFacturasOrdenadas(reciboPagado: any): any[] {
    if (!reciboPagado || !reciboPagado.facturas) return [];
    
    const reciboId = reciboPagado._id;
    const orden = this.ordenVencimiento[reciboId];
    
    if (!orden) {
      // Si no hay orden definido, retornar las facturas sin ordenar
      return [...reciboPagado.facturas];
    }
    
    // Crear una copia del array para no modificar el original
    const facturasOrdenadas = [...reciboPagado.facturas];
    
    facturasOrdenadas.sort((a, b) => {
      const vencimientoA = a.vencimiento || 0;
      const vencimientoB = b.vencimiento || 0;
      
      if (orden === 'asc') {
        return vencimientoA - vencimientoB;
      } else {
        return vencimientoB - vencimientoA;
      }
    });
    
    return facturasOrdenadas;
  }

  // Alterna el ordenamiento por vencimiento
  toggleOrdenVencimiento(reciboPagado: any) {
    const reciboId = reciboPagado._id;
    const ordenActual = this.ordenVencimiento[reciboId];
    
    if (!ordenActual || ordenActual === 'desc') {
      this.ordenVencimiento[reciboId] = 'asc';
    } else {
      this.ordenVencimiento[reciboId] = 'desc';
    }
  }

  // Obtiene el orden actual para un recibo pagado
  getOrdenVencimiento(reciboPagado: any): 'asc' | 'desc' | null {
    return this.ordenVencimiento[reciboPagado._id] || null;
  }

  // Calcula el total sumando las facturas de un recibo pagado
  calcularTotalFacturas(reciboPagado: any): number {
    if (!reciboPagado || !reciboPagado.facturas || !Array.isArray(reciboPagado.facturas)) {
      return 0;
    }
    return reciboPagado.facturas.reduce((sum: number, factura: any) => {
      return sum + (factura.haber || 0);
    }, 0);
  }
}
