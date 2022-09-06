import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';



import { NopagefoundComponent } from './nopagefound/nopagefound.component';







const routes: Routes = [

  // path: '/dashboard' PagesRouting
  // path: '/auth' AuthRouting



  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  { path: '**', component: NopagefoundComponent },


];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,

      // These aren't necessary for this demo - they are just here to provide
      // a more natural experience and test harness.
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
      enableTracing: false
    }),
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [RouterModule]

})
export class AppRoutingModule { }
