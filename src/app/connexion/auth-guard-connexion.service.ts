import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {ConnexionService} from './connexion.service';

@Injectable()
export class AuthGuardConnexion implements CanActivate {

  constructor(private authService: ConnexionService,
              private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLogged()) {
      return true;
    } else {
      this.router.navigate(['/connexion']);
    }
    return true;
  }
}
