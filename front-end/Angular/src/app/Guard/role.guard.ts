import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRole: string[] = next.data.expectedRole;

    const currentUserRole = this.authenticationService.getRole().valueOf();
    if (!this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    } else if (!expectedRole.includes(currentUserRole.toLowerCase())) {
      console.log('Not Admin----');
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
