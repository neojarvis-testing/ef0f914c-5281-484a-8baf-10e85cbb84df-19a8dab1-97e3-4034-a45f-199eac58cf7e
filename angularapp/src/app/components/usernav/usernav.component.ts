import { Component } from '@angular/core';
 
import { Router } from '@angular/router';
 
import { AuthService } from '../../services/auth.service';
 
@Component({
 
  selector: 'app-usernav',
 
  templateUrl: './usernav.component.html',
  styleUrls: ['./usernav.component.css']
})
 
export class UsernavComponent {
 
  constructor(public authService: AuthService, private router: Router) {}
 
  logout() {
 
    if (confirm('Are you sure you want to logout?')) {
 
      this.authService.logout();
 
      this.router.navigate(['/login']);
 
    }
 
  }
 
}