import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ){

  }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
      let usuario = await this.usuarioService.inicializarUsuario()
      if (usuario?.role == 'ADMIN_ROLE') {
        return true;
        
      } else {
        this.router.navigateByUrl('admin/dashboard')
        return false
      }
  }
  
}
