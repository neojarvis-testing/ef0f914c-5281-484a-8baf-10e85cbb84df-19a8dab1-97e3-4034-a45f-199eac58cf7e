import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

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
   * Automatically navigates users based on their role.
   * 
   * @param form - NgForm instance containing user input validation.
   */
  login(form: NgForm): void {
    // Ensure form is valid before proceeding
    if (form.valid) {
      this.authService.login(this.user).subscribe(
        response => {
          console.log('Login successful', response);
        },
        error => {
          console.error('Login failed', error);
          this.errorMessage = 'Invalid email or password. Please try again.';
        }
      );
    }
  }
}
