import { AvisoFunebre } from './../../models/aviso-funebre';
import { AvisosFunebresService } from './../../services/avisos-funebres.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { URL_SERVICIOS } from '../../config/global';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-editar-aviso-funebre',
  templateUrl: './editar-aviso-funebre.component.html',
  styleUrls: ['./editar-aviso-funebre.component.css']
})
export class EditarAvisoFunebreComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
    public _avisosFunebresService: AvisosFunebresService,
    public _usuarioService: UsuarioService
  ) { }

  id: string;
  aviso: AvisoFunebre;
  fotoSeleccionada: File = null;
  fotoPreview: string | ArrayBuffer = null;
  fotoActual: string = null;
  loading = false;

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.aviso = await this._avisosFunebresService.getAvisoFunebreById(this.id);

    // Formatear fechas para el input date
    if (this.aviso.fecha_defuncion) {
      const fechaDef = new Date(this.aviso.fecha_defuncion);
      this.aviso.fecha_defuncion = fechaDef.toISOString().split('T')[0];
    }

    if (this.aviso.fecha_nacimiento) {
      const fechaNac = new Date(this.aviso.fecha_nacimiento);
      this.aviso.fecha_nacimiento = fechaNac.toISOString().split('T')[0];
    }

    if (this.aviso.fecha_entierro) {
      const fechaEnt = new Date(this.aviso.fecha_entierro);
      this.aviso.fecha_entierro = fechaEnt.toISOString().split('T')[0];
    }

    if (this.aviso.fecha_caducidad_publicado) {
      const fechaCad = new Date(this.aviso.fecha_caducidad_publicado);
      this.aviso.fecha_caducidad_publicado = fechaCad.toISOString().split('T')[0];
    }

    // Cargar foto actual si existe
    if (this.aviso.foto) {
      this.fotoActual = this.aviso.foto;
      if (this.aviso.foto.startsWith('http')) {
        this.fotoPreview = this.aviso.foto;
      } else if (this.aviso.foto.startsWith('/uploads/avisos_funebres/')) {
        // Convertir a endpoint protegido con token
        const filename = this.aviso.foto.split('/').pop();
        const token = this._usuarioService?.token || '';
        this.fotoPreview = `${URL_SERVICIOS}/avisos-funebres/imagen/${filename}?token=${token}`;
      } else {
        this.fotoPreview = `${URL_SERVICIOS}${this.aviso.foto}`;
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoSeleccionada = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async guardarAvisoFunebre() {
    if (!this.aviso.nombre_completo || !this.aviso.fecha_defuncion) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    this.loading = true;
    try {
      const formData = new FormData();
      formData.append('_id', this.aviso._id);
      formData.append('nombre_completo', this.aviso.nombre_completo);
      if (this.aviso.nacionalidad) formData.append('nacionalidad', this.aviso.nacionalidad);
      if (this.aviso.fecha_nacimiento) formData.append('fecha_nacimiento', this.aviso.fecha_nacimiento.toString());
      formData.append('fecha_defuncion', this.aviso.fecha_defuncion.toString());
      if (this.aviso.fecha_entierro) formData.append('fecha_entierro', this.aviso.fecha_entierro.toString());
      if (this.aviso.hora_fallecimiento) formData.append('hora_fallecimiento', this.aviso.hora_fallecimiento);
      if (this.aviso.causa_muerte) formData.append('causa_muerte', this.aviso.causa_muerte);
      if (this.aviso.comentarios) formData.append('comentarios', this.aviso.comentarios);
      if (this.aviso.quien_realizo_servicio) formData.append('quien_realizo_servicio', this.aviso.quien_realizo_servicio);

      formData.append('descripcion', this.aviso.descripcion || '');
      formData.append('biografia', this.aviso.biografia || '');
      if (this.aviso.ubicacion_cementerio) formData.append('ubicacion_cementerio', this.aviso.ubicacion_cementerio);
      formData.append('activo', this.aviso.activo ? 'true' : 'false');
      formData.append('publicado', this.aviso.publicado ? 'true' : 'false');

      if (this.aviso.fecha_caducidad_publicado) {
        formData.append('fecha_caducidad_publicado', this.aviso.fecha_caducidad_publicado.toString());
      } else {
        formData.append('fecha_caducidad_publicado', '');
      }

      if (this.fotoSeleccionada) {
        formData.append('foto', this.fotoSeleccionada);
      }

      await this._avisosFunebresService.actualizarAvisoFunebre(formData);
      window.history.back();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el aviso fúnebre');
    } finally {
      this.loading = false;
    }
  }

  cancelar() {
    window.history.back();
  }

  eliminarFoto() {
    this.fotoSeleccionada = null;
    if (this.fotoActual) {
      if (this.fotoActual.startsWith('http')) {
        this.fotoPreview = this.fotoActual;
      } else if (this.fotoActual.startsWith('/uploads/avisos_funebres/')) {
        // Convertir a endpoint protegido con token
        const filename = this.fotoActual.split('/').pop();
        const token = this._usuarioService?.token || '';
        this.fotoPreview = `${URL_SERVICIOS}/avisos-funebres/imagen/${filename}?token=${token}`;
      } else {
        this.fotoPreview = `${URL_SERVICIOS}${this.fotoActual}`;
      }
    } else {
      this.fotoPreview = null;
    }
  }
}

