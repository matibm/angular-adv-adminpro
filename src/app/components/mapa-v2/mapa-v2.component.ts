import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { URL_SERVICIOS } from '../../config/global';
import { UsuarioService } from '../../services/usuario.service';

// Wrapper Angular del mapa moderno (React+Vite). El mapa real vive en /mapa-v2
// servido por el backend y se embebe como iframe. Este componente solo:
//  - arma la URL del iframe (modo admin/publico + token)
//  - escucha el postMessage del iframe para navegar a la ficha del contrato
@Component({
  selector: 'app-mapa-v2',
  templateUrl: './mapa-v2.component.html',
  styleUrls: ['./mapa-v2.component.css'],
})
export class MapaV2Component implements OnInit {
  safeUrl: SafeResourceUrl;
  publico = false;
  private expectedOrigin: string;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private _usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.publico = this.route.snapshot.data?.publico === true;
    const modo = this.publico ? 'publico' : 'admin';

    // Servido como asset dentro del build de Angular (ver mapa-v2/vite.config.js).
    // El path /assets/... no es una ruta de Angular, así que no hay colisión.
    let url = `${URL_SERVICIOS}/assets/mapa-v2/?modo=${modo}`;
    const token = this._usuarioService.token;
    if (!this.publico && token) {
      url += `&token=${encodeURIComponent(token)}`;
    }

    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.expectedOrigin = new URL(URL_SERVICIOS, window.location.origin).origin;
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent): void {
    if (event.origin !== this.expectedOrigin) return;
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'mapa-v2:open-contrato' && data.id) {
      this.router.navigateByUrl(`/admin/info_contrato/${data.id}`);
    }
  }
}
