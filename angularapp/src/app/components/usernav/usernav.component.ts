import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
 
@Component({
 
  selector: 'app-usernav',
  templateUrl: './usernav.component.html',
  styleUrls: ['./usernav.component.css']
})
 
export class UsernavComponent implements OnInit {
  username: string | null = '';
  userRole: string | null = '';
  constructor(public authService: AuthService, private router: Router) {}
 
  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.userRole = this.authService.getUserRole();
  }
  logout() {
 
    if (confirm('Are you sure you want to logout?')) {
 
      this.authService.logout();
 
      this.router.navigate(['/login']);
 
    }
 
  }
 
}