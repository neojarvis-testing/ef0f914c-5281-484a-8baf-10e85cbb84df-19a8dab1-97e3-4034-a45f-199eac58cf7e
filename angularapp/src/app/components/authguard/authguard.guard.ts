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
  ): boolean | UrlTree {
    const isLoggedIn = !!this.authService.getToken();
    const userRole = this.authService.getUserRole();
    const currentPath = route.url.length > 0 ? route.url[0].path : '';
  
    if (!isLoggedIn && currentPath !== '') {
      return this.router.parseUrl('/login'); 
    }
    
  
    if (currentPath.startsWith('admin') && userRole !== 'admin') {
      return this.router.parseUrl('/error');
    }
  
    if (currentPath.startsWith('user') && userRole?.toLowerCase() !== 'user') {
      return this.router.parseUrl('/error');
    }
    
  
    return true;
  }
}



