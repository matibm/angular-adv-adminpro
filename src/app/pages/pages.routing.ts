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
      { path: 'grafica1', component: Grafica1Component },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'usuario/:id', component: PerfilUsuarioComponent },
      { path: 'lista_contratos', component: ListaContratosComponent },
      { path: 'info_contrato/:id', component: InfoContratoComponent },
      { path: 'nuevo_usuario', component: CrearUsuarioComponent },
      { path: 'factura/:id', component: FacturaComponent },
      { path: 'facturas', component: ListaFacturasComponent },
      { path: 'movimientos', component: MovimientosComponent },
      { path: 'contrato_pdf/:id', component: ContratoPdfComponent },
      { path: 'editar_contrato/:id', component: EditarContratoComponent },
      { path: 'info_caja', component: InfoCajaComponent },
      { path: 'resumen', component: ResumenComponent },
      { path: 'transferencia', component: TransferenciaComponent },

      { path: 'account-settings', component: AccountSettingsComponent },

    ]


  },
  { path: 'contratos-pdf/:id', component: ContratoPdfComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
