import { Router } from '@angular/router';
import { UsuarioService } from './services/usuario.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate
// , CanActivateChild
{
  constructor(public _usuarioService: UsuarioService,
              public route: Router) {

  }
  canActivate(): boolean {
    if (this._usuarioService.itsLogued) {
      return true;

    } else {
      this.route.navigateByUrl('/login');
      return false;
    }
  }
  // canActivateChild(
  //   childRoute: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

}
