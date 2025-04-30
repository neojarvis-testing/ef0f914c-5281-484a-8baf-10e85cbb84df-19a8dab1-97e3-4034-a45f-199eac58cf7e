import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // https://ide-ceffcfbccccbfdfddaeecadabeafeaccfe.premiumproject.examly.io/proxy/8080/
  public apiUrl = 'https://8080-ceffcfbccccbfdfddaeecadabeafeaccfe.premiumproject.examly.io'; // Replace with workspace URL
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private roleSubject = new BehaviorSubject<string | null>(null);
  private userIdSubject = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) {}

  /** Register a new user */
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/register`, user).pipe(
      catchError(this.handleError<any>('register'))
    );
  }

  /** Log in and store JWT token */
  login(login: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/login`, login).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.tokenSubject.next(response.token);

          const decodedToken = this.decodeJwtToken(response.token);
          if (decodedToken) {
            this.roleSubject.next(decodedToken.role);
            this.userIdSubject.next(decodedToken.userId);
          }
        }
      }),
      catchError(this.handleError<any>('login'))
    );
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

  /** Get JWT token */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Get user role */
  getUserRole(): Observable<string | null> {
    return this.roleSubject.asObservable();
  }

  /** Get user ID */
  getUserId(): Observable<number | null> {
    return this.userIdSubject.asObservable();
  }

  /** Logout */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.tokenSubject.next(null);
    this.roleSubject.next(null);
    this.userIdSubject.next(null);
  }

  /** Error Handling */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`${operation} failed: ${error.message}`));
    };
  }
}
