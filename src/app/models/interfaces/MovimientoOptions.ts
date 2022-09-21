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
    id_cuentacaja?: string,
    page?: number,
    unlimit?: boolean
    filtro_transferencia?: 'GASTO' | 'TRANSFERENCIA'
    monto_inicio?: number,
    monto_fin?: number,
}