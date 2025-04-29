
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Internship } from '../models/internship.model';
import { InternshipApplication } from '../models/internshipapplication.model';
 
@Injectable({
  providedIn: 'root'
})
export class InternshipService {

  // https://ide-edccfcacceabdfddaeecadabeafeaccfe.premiumproject.examly.io/proxy/8080/
  private apiUrl = 'https://8080-edccfcacceabdfddaeecadabeafeaccfe.premiumproject.examly.io/api/Internship';
  private applicationApiUrl = '/api/internship-application';
 
  constructor(private http: HttpClient) {}
 
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
 
  getAllInternships(): Observable<Internship[]> {
    return this.http.get<Internship[]>(this.apiUrl, { headers: this.getHeaders() });
  }
 
  getInternshipById(id: number): Observable<Internship> {
    return this.http.get<Internship>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
 
  addInternship(requestObject: Internship): Observable<Internship> {
    return this.http.post<Internship>(this.apiUrl, requestObject, { headers: this.getHeaders() });
  }
 
  updateInternship(id: number, requestObject: Internship): Observable<Internship> {
    return this.http.put<Internship>(`${this.apiUrl}/${id}`, requestObject, { headers: this.getHeaders() });
  }
 
  deleteInternship(internshipId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${internshipId}`, { headers: this.getHeaders() });
  }
 
  getAppliedInternships(userId: number): Observable<InternshipApplication[]> {
    return this.http.get<InternshipApplication[]>(`${this.applicationApiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }
 
  deleteInternshipApplication(internshipId: number): Observable<void> {
    return this.http.delete<void>(`${this.applicationApiUrl}/${internshipId}`, { headers: this.getHeaders() });
  }
 
  addInternshipApplication(data: InternshipApplication): Observable<InternshipApplication> {
    return this.http.post<InternshipApplication>(this.applicationApiUrl, data, { headers: this.getHeaders() });
  }
 
  getAllInternshipApplications(): Observable<InternshipApplication[]> {
    return this.http.get<InternshipApplication[]>(this.applicationApiUrl, { headers: this.getHeaders() });
  }
 
  updateApplicationStatus(id: number, internshipApplication: InternshipApplication): Observable<InternshipApplication> {
    return this.http.put<InternshipApplication>(`${this.applicationApiUrl}/${id}`, internshipApplication, { headers: this.getHeaders() });
  }
}