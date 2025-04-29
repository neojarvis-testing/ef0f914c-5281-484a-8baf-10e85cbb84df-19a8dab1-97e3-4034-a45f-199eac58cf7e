import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  user = {
    UserId: undefined,
    Email: '',
    Password: '',
    Username: '',
    MobileNumber: '',
    UserRole: '',
    SecretKey: ''
  };
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  /** Registers a new user */
  register(): void {
    // Password validation check
    if (this.user.Password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Call AuthService's register method
    this.authService.register(this.user).subscribe(
      (res) => {
        console.log('Registration successful', res);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed', error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
