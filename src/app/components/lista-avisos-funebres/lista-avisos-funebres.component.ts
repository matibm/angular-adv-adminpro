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

  avisos: AvisoFunebre[] = [];
  loading = false;

  async ngOnInit() {
    await this.cargarAvisos();
  }

  async cargarAvisos() {
    this.loading = true;
    try {
      this.avisos = await this._avisosFunebresService.getAvisosFunebres();
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
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
    
    // Si la foto viene como /uploads/avisos_funebres/..., convertir a endpoint protegido
    if (foto.startsWith('/uploads/avisos_funebres/')) {
      const filename = foto.split('/').pop();
      const token = this._usuarioService?.token || '';
      return `${URL_SERVICIOS}/avisos-funebres/imagen/${filename}?token=${token}`;
    }
    
    // Si ya viene como endpoint protegido, solo agregar token
    if (foto.startsWith('/avisos-funebres/imagen/')) {
      const token = this._usuarioService?.token || '';
      return `${URL_SERVICIOS}${foto}?token=${token}`;
    }
    
    return `${URL_SERVICIOS}${foto}`;
  }

  formatearFecha(fecha: Date | string | number): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PY');
  }
}

