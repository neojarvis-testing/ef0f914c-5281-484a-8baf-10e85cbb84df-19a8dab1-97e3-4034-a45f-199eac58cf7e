import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    Email: '',
    Password: ''
  };

  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  login(form: NgForm): void {
    if (form.valid) {
      this.authService.login(this.user).subscribe({
        next: response => {
          const role = this.authService.getUserRole();
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: `Welcome back, ${role === 'admin' ? 'Admin' : 'User'}!`,
            confirmButtonColor: '#28a745',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            if (role === 'admin') {
              this.router.navigate(['/admin/home']);
            } else if (role === 'user') {
              this.router.navigate(['/user/home']);
            } else {
              this.router.navigate(['/error']);
            }
          });
        },
        error: error => {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password. Please try again.',
            confirmButtonColor: '#dc3545'
          });
        }
      });
    }
  }
}
