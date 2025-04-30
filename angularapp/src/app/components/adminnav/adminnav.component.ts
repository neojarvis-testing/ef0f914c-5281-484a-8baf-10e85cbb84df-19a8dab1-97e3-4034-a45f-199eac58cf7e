import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css']
})
export class AdminnavComponent implements OnInit {

  // Inject AuthService and Router into the constructor for added functionality
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Perform any initialization tasks, like checking authentication status
    console.log('AdminnavComponent initialized');
  }

  logout() {
    // Confirmation dialog for logging out
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout(); // Call the logout functionality
      this.router.navigate(['/login']); // Redirect to the login page
    }
  }
}
