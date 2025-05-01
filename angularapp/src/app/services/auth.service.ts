import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiUrl = 'https://8080-bcededaebddfddaeecadabeafeaccfe.premiumproject.examly.io'; // Replace with workspace URL
  private tokenKey = 'authToken'; // Local storage key for JWT token
  private roleSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  /** Register a new user */
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/register`, user).pipe(
      catchError(this.handleError<any>('register'))
    );
  }

  /** Log in and store JWT token */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.storeToken(response.token);
          this.navigateBasedOnRole();
        }
      }),
      catchError(this.handleError<any>('login'))
    );
  }

  /** Store JWT token */
  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    const decodedToken = this.decodeJwtToken(token);
    if (decodedToken) {
      const role = decodedToken.role;
      localStorage.setItem('role', role);
      this.roleSubject.next(role);
    }
  }

  /** Get JWT token */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** Get user ID */
  getUserID(): string | null {
    return localStorage.getItem('id');
  }

  /** Decode JWT token */
  private decodeJwtToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /** Get user role */
  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  /** Navigate user based on role */
  navigateBasedOnRole(): void {
    const role = this.getUserRole();
    switch (role) {
      case 'Admin':
        this.router.navigate(['/admin']);
        break;
      case 'User':
        this.router.navigate(['/user-dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  /** Logout */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('role');
    this.roleSubject.next(null);
    this.router.navigate(['/login']);
  }

  /** Error Handling */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`${operation} failed: ${error.message}`));
    };
  }
}
