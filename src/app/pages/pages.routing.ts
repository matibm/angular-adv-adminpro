import { ExtractoPdfComponent } from './../components/extracto-pdf/extracto-pdf.component';
import { CobranzaComponent } from './../components/cobranza/cobranza.component';
import { CrearFacturaComponent } from './../components/crear-factura/crear-factura.component';
import { EditarProductoComponent } from './../components/editar-producto/editar-producto.component';
import { ListaProductosComponent } from './../components/lista-productos/lista-productos.component';
import { CrearProductoComponent } from './../components/crear-producto/crear-producto.component';
import { FacturaPdfComponent } from './../components/factura-pdf/factura-pdf.component';
import { TransferenciaComponent } from './../components/transferencia/transferencia.component';
import { ListaFacturasComponent } from './../components/lista-facturas/lista-facturas.component';
import { ResumenComponent } from './../components/resumen/resumen.component';
import { EditarContratoComponent } from './../components/editar-contrato/editar-contrato.component';
import { InfoCajaComponent } from './../components/info-caja/info-caja.component';
import { CrearUsuarioComponent } from './../components/crear-usuario/crear-usuario.component';
import { ContratoPdfComponent } from './../components/contrato-pdf/contrato-pdf.component';
import { MovimientosComponent } from './../components/movimientos/movimientos.component';
import { FacturaComponent } from './../components/factura/factura.component';
import { FacturasComponent } from './../components/facturas/facturas.component';
import { AuthGuard } from './../auth.guard';
import { InfoContratoComponent } from './../components/info-contrato/info-contrato.component';
import { PerfilUsuarioComponent } from './../components/perfil-usuario/perfil-usuario.component';
import { UsuariosComponent } from './../components/usuarios/usuarios.component';
import { ListaContratosComponent } from './../components/lista-contratos/lista-contratos.component';
import { CrearContratoComponent } from './../components/crear-contrato/crear-contrato.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { GastoComponent } from '../components/gasto/gasto.component';
import { PagosComponent } from '../components/pagos/pagos.component';
import { AdminGuard } from './admin.guard';
import { FacturaTicketComponent } from '../components/factura-ticket/factura-ticket.component';
import { ExportarContratosPdfComponent } from '../components/exportar-contratos-pdf/exportar-contratos-pdf.component';
import { ExportarGastosPdfComponent } from '../components/exportar-gastos-pdf/exportar-gastos-pdf.component';
import { MapaComponent } from '../components/mapa/mapa.component';
import { PdfFacturaMobileComponent } from '../components/pdf-factura-mobile/pdf-factura-mobile.component';
import { MapaPublicoComponent } from '../components/mapa-publico/mapa-publico.component';
import { EditGastoComponent } from '../components/edit-gasto/edit-gasto.component';
import { FacturaElectronicaTicketComponent } from '../components/factura-electronica-ticket/factura-electronica-ticket.component';
import { RecibosComponent } from '../components/recibos/recibos.component';
const routes: Routes = [
  // {
  //   path: 'contrato',
  //   component: PagesComponent,
  //   children: [
  //     { path: '', component: DashboardComponent },
  //     { path: 'progress', component: ProgressComponent },
  //     { path: 'crear_contrato', component: CrearContratoComponent },
  //     { path: 'lista_contratos', component: ListaContratosComponent },
  //     { path: 'usuarios', component: UsuariosComponent },
  //     { path: 'grafica1', component: Grafica1Component },
  //     { path: 'account-settings', component: AccountSettingsComponent },

  //   ]


  // },
  {
    path: 'admin', component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'crear_contrato', component: CrearContratoComponent },
      { path: 'crear_ingreso', component: CrearFacturaComponent },
      { path: 'grafica1', component: Grafica1Component },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'usuario/:id', component: PerfilUsuarioComponent },
      { path: 'lista_contratos', component: ListaContratosComponent },
      { path: 'info_contrato/:id', component: InfoContratoComponent },
      { path: 'crear_usuario', component: CrearUsuarioComponent },
      { path: 'ingreso/:id', component: FacturaComponent },
      { path: 'ingresos', component: ListaFacturasComponent },
      { path: 'cobranzas', component: CobranzaComponent },
      { path: 'gastos', component: MovimientosComponent, canActivate: [AdminGuard] },
      { path: 'contrato_pdf/:id', component: ContratoPdfComponent },
      { path: 'editar_contrato/:id', component: EditarContratoComponent },
      { path: 'gasto/:id', component: GastoComponent },
      { path: 'edit_gasto/:id', component: EditGastoComponent },
      { path: 'info_caja', component: InfoCajaComponent, canActivate: [AdminGuard] },
      { path: 'resumen', component: ResumenComponent },
      { path: 'transferencia', component: TransferenciaComponent , canActivate: [AdminGuard]},
      { path: 'crear_producto', component: CrearProductoComponent },
      { path: 'editar_producto/:id', component: EditarProductoComponent },
      { path: 'lista_productos', component: ListaProductosComponent },
      { path: 'pagos', component: PagosComponent },
      { path: 'account-settings', component: AccountSettingsComponent },
      { path: 'mapa', component: MapaComponent },
      { path: 'recibos', component: RecibosComponent },
      { path: '**', component: DashboardComponent },


    ]


  },
  { path: 'contratos-pdf/:id', component: ContratoPdfComponent },

  { path: 'factura-pdf/:id', component: FacturaPdfComponent },
  { path: 'extracto-cuotas', component: ExtractoPdfComponent },
  { path: 'extracto-contratos', component: ExportarContratosPdfComponent },
  { path: 'extracto-gastos', component: ExportarGastosPdfComponent },
  { path: 'factura-ticket/:id', component: FacturaTicketComponent },
  { path: 'factura-ticket-kude/:id', component: FacturaElectronicaTicketComponent },
  { path: 'factura_mobile/:id', component: PdfFacturaMobileComponent },
  { path: 'mapa', component: MapaPublicoComponent },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
