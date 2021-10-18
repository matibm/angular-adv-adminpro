export interface MovimientoOptions {
    nro_factura?: string,
    cliente?: string,
    proveedor?: string,
    fecha_inicio?: number,
    fecha_fin?: number,
    servicio?: string,
    contrato?: string,
    tipo_movimiento?: string,
    fondo?: string,
    page?:number,
    unlimit?:boolean
}