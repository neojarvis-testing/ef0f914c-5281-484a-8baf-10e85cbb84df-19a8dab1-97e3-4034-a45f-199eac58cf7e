import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public apiUrl = 'https://8080-bcededaebddfddaeecadabeafeaccfe.premiumproject.examly.io'; 

  private tokenKey = 'authToken'; 
  public roleSubject = new BehaviorSubject<string | null>(null);
 
  constructor(private http: HttpClient, private router: Router) {}
 
  /** Register a new user */
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/register`, user).pipe(
      catchError(this.handleError<any>('register'))
    );
  }
 
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'admin';
  }
  isUser(): boolean {
    const role = localStorage.getItem('role');
    return role === 'user';
  }
 
  /** Log in and store JWT token */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.storeToken(response.token);
          this.navigateBasedOnRole(); // ✅ Navigates without refreshing
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
      const role = decodedToken.role?.toLowerCase() || '';
      console.log('Decoded role:', role); // 🔥 Debugging output
      localStorage.setItem('role', role);
      this.roleSubject.next(role);
    }
  }
 
  /** Navigate user based on role */
  navigateBasedOnRole(): void {
    const role = this.getUserRole();
    if (role === 'admin') {
      this.router.navigate(['/admin']); // ✅ Navigates immediately without error page
    } else if (role === 'user') {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/']);
    }
  }
 
  /** Logout */
  logout(): void {
    localStorage.clear(); 
    this.roleSubject.next(null);
    this.router.navigate(['/login']);
  }
 
  /** Get JWT token */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** Get user ID */
  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token
            console.log("Decoded Payload:", payload); // Debugging Output
            return payload['nameid'] || null; // Ensure proper key access
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    }
    return null;


  // getUserId(): number {
  //   const storedUserId = localStorage.getItem('userId');
  //   return storedUserId ? Number(storedUserId) : -1; // Return -1 if not found
}
 
 
  /** Decode JWT token */
  public decodeJwtToken(token: string): any {
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
 
  /** Error Handling */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`${operation} failed: ${error.message}`));
    };
  }
  
}
 