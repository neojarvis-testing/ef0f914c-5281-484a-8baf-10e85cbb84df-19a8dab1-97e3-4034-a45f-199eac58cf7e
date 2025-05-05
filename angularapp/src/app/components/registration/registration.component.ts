import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

/**
 * RegistrationComponent
 * Handles user registration functionality, ensuring password validation and account creation.
 */
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  /**
   * Hardcoded secret key required for admin registration.
   */
  private readonly adminSecretKey = "Secret!@#$"; // Modify this as per requirement

  /**
   * User object containing necessary registration details.
   */
  user = {
    UserId: undefined,
    Email: '',
    Password: '',
    Username: '',
    MobileNumber: '',
    UserRole: '',
    SecretKey: ''
  };

  /**
   * Stores the confirmation password input for validation.
   */
  confirmPassword: string = '';

  /**
   * Holds error messages for failed registration attempts.
   */
  errorMessage: string = '';

  /**
   * Constructor initializes Router and AuthService for navigation and user authentication.
   * @param router - Angular Router for handling navigation after successful registration
   * @param authService - Service responsible for handling registration API requests
   */
  constructor(private router: Router, private authService: AuthService) {}

  /**
   * register method
   * Validates password confirmation and submits registration data to the AuthService.
   * Ensures Admin users provide the correct secret key before proceeding.
   */
  register(): void {
    // Ensure password and confirmation match
    if (this.user.Password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // If user selects Admin role, validate secret key
    if (this.user.UserRole === 'Admin' && this.user.SecretKey !== this.adminSecretKey) {
      this.errorMessage = 'Invalid Secret Key for Admin Registration';
      return;
    }

    // Call AuthService to register user
    this.authService.register(this.user).subscribe(
      (res) => {
        console.log('Registration successful', res);
        alert("Registration Successful..");
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed', error);
        alert("Registration failed.. Please Try Again..");
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
