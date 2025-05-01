import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
 
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
 
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isLoggedIn = !!this.authService.getToken();
    const userRole = localStorage.getItem('role');
 
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
 
    // Admin route access control
    if (route.url.length > 0 && (route.url[0].path === 'admin' || route.url[0].path.startsWith('admin/'))) {
      if (userRole !== 'Admin') {
        this.router.navigate(['/error']);
        return false;
      }
    }
 
    // User route access control
    if (route.url.length > 0 && route.url[0].path === 'user') {
      if (userRole !== 'User') {
        this.router.navigate(['/error']);
        return false;
      }
    }
 
    return true;
  }
}