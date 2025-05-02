import { Component } from '@angular/core';
 
import { Router } from '@angular/router';
 
import { AuthService } from '../../services/auth.service';
 
@Component({
 
  selector: 'app-usernav',
 
  templateUrl: './usernav.component.html'
  
 
})
 
export class UsernavComponent {
 
  constructor(private authService: AuthService, private router: Router) {}
 
  logout() {
 
    if (confirm('Are you sure you want to logout?')) {
 
      this.authService.logout();
 
      this.router.navigate(['/login']);
 
    }
 
  }
 
}