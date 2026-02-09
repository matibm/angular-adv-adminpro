import { Component, OnInit } from '@angular/core';
import { OrdenesCobroService } from 'src/app/services/ordenes-cobro.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-config-pagos-online',
  templateUrl: './config-pagos-online.component.html',
  styleUrls: ['./config-pagos-online.component.css']
})
export class ConfigPagosOnlineComponent implements OnInit {
  cobradores: any[] = [];
  fondos: any[] = [];
  cobradorId: string | null = null;
  fondoId: string | null = null;
  loading = false;
  saving = false;

  constructor(
    private _ordenesCobroService: OrdenesCobroService,
    private notifier: NotifierService,
  ) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.loading = true;
    try {
      const [configRes, cobradoresRes, fondosRes]: any[] = await Promise.all([
        this._ordenesCobroService.getConfigPagosOnline(),
        this._ordenesCobroService.getCobradores(),
        this._ordenesCobroService.getFondos(),
      ]);
      this.cobradorId = configRes?.cobrador_id || null;
      this.fondoId = configRes?.fondo_id || null;
      this.cobradores = cobradoresRes?.usuarios || [];
      this.fondos = fondosRes?.usuarios || [];
    } catch (error) {
      console.error('Error al cargar:', error);
      this.notifier.notify('error', 'Error al cargar configuración');
    } finally {
      this.loading = false;
    }
  }

  async guardar() {
    this.saving = true;
    try {
      await this._ordenesCobroService.saveConfigPagosOnline(this.cobradorId, this.fondoId);
      this.notifier.notify('success', 'Configuración guardada correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      this.notifier.notify('error', 'Error al guardar configuración');
    } finally {
      this.saving = false;
    }
  }

  getNombre(u: any): string {
    return [u?.NOMBRES, u?.APELLIDOS].filter(Boolean).join(' ').trim() || '-';
  }
}
