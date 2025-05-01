
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

 

    const currentPath = route.url.length > 0 ? route.url[0].path : '';


    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

 
    // Admin route access control
    if (route.url.length > 0 && (route.url[0].path === 'admin' || route.url[0].path.startsWith('admin/'))) {
      if (userRole !== 'Admin') {


    // Redirect to admin-specific routes and ensure admin navbar only displays
    if (currentPath.startsWith('admin')) {
      if (userRole === 'Admin') {
        return true; // Allow access for admin
      } else {

        this.router.navigate(['/error']);
        return false; // Prevent access for non-admin
      }
    }
 
    // User route access control
    if (route.url.length > 0 && route.url[0].path === 'user') {
      if (userRole !== 'User') {


    // Redirect to user-specific routes and ensure user navbar only displays
    if (currentPath.startsWith('user-dashboard')) {
      if (userRole === 'User') {
        return true; // Allow access for regular users
      } else {

        this.router.navigate(['/error']);
        return false; // Prevent access for non-user
      }
    }

 
    return true;


    return true; // Default: Allow access for non-role-specific routes

  }
}