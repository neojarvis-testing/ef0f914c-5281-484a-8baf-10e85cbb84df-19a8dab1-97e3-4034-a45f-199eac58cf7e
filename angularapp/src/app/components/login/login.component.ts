import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

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

  /** Handles user login */
  login(form: NgForm): void 
  {
    if (form.valid) {
      this.authService.login(this.user).subscribe(
        response => {
          console.log('Login successful', response);
          const userRole = localStorage.getItem('role');

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
