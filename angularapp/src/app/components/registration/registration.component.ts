import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  private readonly adminSecretKey = "Secret!@#$";

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

  register(): void {
    if (this.user.Password !== this.confirmPassword) {
      this.showAlert('error', 'Passwords do not match');
      return;
    }

    if (this.user.UserRole === 'Admin' && this.user.SecretKey !== this.adminSecretKey) {
      this.showAlert('error', 'Invalid Secret Key for Admin Registration');
      return;
    }

    this.authService.register(this.user).subscribe(
      (res) => {
        Swal.fire('Success', 'Registration Successful', 'success').then(() => {
          this.router.navigate(['/login']);
        });
      },
      (error) => {
        Swal.fire('Error', 'Registration failed. Please try again.', 'error');
      }
    );
  }

  private showAlert(icon: 'success' | 'error', message: string): void {
    Swal.fire({
      icon,
      title: icon === 'success' ? 'Success' : 'Error',
      text: message
    });
  }
}
