import { AvisoFunebre } from './../../models/aviso-funebre';
import { Component, OnInit } from '@angular/core';
import { AvisosFunebresService } from 'src/app/services/avisos-funebres.service';

@Component({
  selector: 'app-crear-aviso-funebre',
  templateUrl: './crear-aviso-funebre.component.html',
  styleUrls: ['./crear-aviso-funebre.component.css']
})
export class CrearAvisoFunebreComponent implements OnInit {

  constructor(
    public _avisosFunebresService: AvisosFunebresService
  ) { }

  aviso: AvisoFunebre = new AvisoFunebre();
  fotoSeleccionada: File = null;
  fotoPreview: string | ArrayBuffer = null;
  loading = false;

  ngOnInit(): void {
    this.aviso.activo = true;
    this.aviso.publicado = false;
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

  async crearAvisoFunebre() {
    if (!this.aviso.nombre_completo || !this.aviso.fecha_defuncion) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    this.loading = true;
    try {
      const formData = new FormData();
      formData.append('nombre_completo', this.aviso.nombre_completo);
      if (this.aviso.nacionalidad) formData.append('nacionalidad', this.aviso.nacionalidad);
      if (this.aviso.fecha_nacimiento) formData.append('fecha_nacimiento', this.aviso.fecha_nacimiento.toString());
      formData.append('fecha_defuncion', this.aviso.fecha_defuncion.toString());
      if (this.aviso.fecha_entierro) formData.append('fecha_entierro', this.aviso.fecha_entierro.toString());

      formData.append('descripcion', this.aviso.descripcion || '');
      formData.append('biografia', this.aviso.biografia || '');
      if (this.aviso.ubicacion_cementerio) formData.append('ubicacion_cementerio', this.aviso.ubicacion_cementerio);
      formData.append('activo', this.aviso.activo ? 'true' : 'false');
      formData.append('publicado', this.aviso.publicado ? 'true' : 'false');

      if (this.aviso.fecha_caducidad_publicado) {
        formData.append('fecha_caducidad_publicado', this.aviso.fecha_caducidad_publicado.toString());
      }

      if (this.fotoSeleccionada) {
        formData.append('foto', this.fotoSeleccionada);
      }

      await this._avisosFunebresService.crearAvisoFunebre(formData);
      window.history.back();
    } catch (error) {
      console.error(error);
      alert('Error al crear el aviso fúnebre');
    } finally {
      this.loading = false;
    }
  }

  cancelar() {
    window.history.back();
  }

  eliminarFoto() {
    this.fotoSeleccionada = null;
    this.fotoPreview = null;
  }
}

