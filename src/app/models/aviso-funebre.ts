export interface CamposVisibilidad {
    foto: boolean;
    nombre_completo: boolean;
    fecha_nacimiento: boolean;
    fecha_defuncion: boolean;
    nacionalidad: boolean;
    ubicacion_cementerio: boolean;
    fecha_entierro: boolean;
    descripcion: boolean;
    biografia: boolean;
    galeria: boolean;
    condolencias: boolean;
    recuerdos: boolean;
    fotografias: boolean;
}

export function crearCamposVisibilidadDefault(): CamposVisibilidad {
    return {
        foto: true,
        nombre_completo: true,
        fecha_nacimiento: true,
        fecha_defuncion: true,
        nacionalidad: true,
        ubicacion_cementerio: true,
        fecha_entierro: true,
        descripcion: true,
        biografia: true,
        galeria: true,
        condolencias: true,
        recuerdos: true,
        fotografias: true
    };
}

export class AvisoFunebre {
    constructor(
        public _id?: string,
        public nombre_completo?: string,
        public nacionalidad?: string,
        public fecha_nacimiento?: Date | string,
        public fecha_defuncion?: Date | string,
        public fecha_entierro?: Date | string,
        public hora_fallecimiento?: string,
        public causa_muerte?: string,
        public comentarios?: string,
        public quien_realizo_servicio?: string,
        public foto?: string,
        public descripcion?: string,
        public biografia?: string,
        public ubicacion_cementerio?: string,
        public activo?: boolean,
        public eliminado?: boolean,
        public publicado?: boolean,
        public fecha_caducidad_publicado?: Date | string | null,
        public fecha_creacion?: number,
        public fecha_actualizacion?: number,
        public campos_modal?: CamposVisibilidad,
        public campos_exequias?: CamposVisibilidad
    ) {
    }
}

