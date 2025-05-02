import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularapp';

  constructor(public authService: AuthService, public router: Router) {} // ✅ AuthService injected

  shouldShowNavbar(): boolean {
    const currentPath = window.location.pathname;
    return (
      currentPath === '/' || 
      currentPath.includes('/login') || 
      currentPath.includes('/register')
    );
  }  
}

