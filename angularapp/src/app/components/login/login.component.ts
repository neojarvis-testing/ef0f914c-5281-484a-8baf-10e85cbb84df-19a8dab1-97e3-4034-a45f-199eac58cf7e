import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user.model';

/**
 * LoginComponent
 * Handles user login functionality and manages authentication state.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /**
   * User credentials object containing email and password input.
   */
  user = {
    Email: '',
    Password: ''
  };

  /**
   * Stores error messages in case login fails.
   */
  errorMessage: string = '';

  /**
   * Constructor initializes Router and AuthService for navigation and authentication.
   * @param router - Angular Router for navigation
   * @param authService - Service responsible for authentication requests
   */
  constructor(private router: Router, private authService: AuthService) {}

  /**
   * login method
   * Authenticates the user by sending login credentials to the AuthService.
   * Redirects users to appropriate dashboards based on their roles.
   * 
   * @param form - NgForm instance containing user input validation.
   */
  login(form: NgForm): void {
    // Ensure form is valid before proceeding
    if (form.valid) {
      this.authService.login(this.user).subscribe(
        response => {
          console.log('Login successful', response);

          // Retrieve user role from local storage
          const userRole = localStorage.getItem('role');

          // Redirect user based on role
          if (userRole === 'Admin') {
            this.router.navigate(['/admin']);
          } else if (userRole === 'User') {
            this.router.navigate(['/user-dashboard']);
          } else {
            console.log("Invalid role, redirecting to default page.");
            this.router.navigate(['/']);
          }
        },
        error => {
          console.error('Login failed', error);
          this.errorMessage = 'Invalid email or password. Please try again.';
        }
      );
    }
  }
}
