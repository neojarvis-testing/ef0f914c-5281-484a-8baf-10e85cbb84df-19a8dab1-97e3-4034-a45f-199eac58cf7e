
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
  public apiUrl = 'https://8080-edccfcacceabdfddaeecadabeafeaccfe.premiumproject.examly.io/api/Internship';
  public applicationApiUrl = 'https://8080-edccfcacceabdfddaeecadabeafeaccfe.premiumproject.examly.io/api/InternshipApplication';
 
  constructor(private http: HttpClient) {}
 
  private getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
 
  getAllInternships(): Observable<Internship[]> {
    return this.http.get<Internship[]>(this.apiUrl, this.getHeaders());
  }
 
  getInternshipById(id: number): Observable<Internship> {
    return this.http.get<Internship>(`${this.apiUrl}/${id}`, this.getHeaders());
  }
 
  addInternship(requestObject: Internship): Observable<Internship> {
    return this.http.post<Internship>(this.apiUrl, requestObject, this.getHeaders());
  }
 
  updateInternship(id: number, requestObject: Internship): Observable<Internship> {
    return this.http.put<Internship>(`${this.apiUrl}/${id}`, requestObject, this.getHeaders());
  }
 
  deleteInternship(internshipId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${internshipId}`, this.getHeaders());
  }
 
  getAppliedInternships(userId: number): Observable<InternshipApplication[]> {
    return this.http.get<InternshipApplication[]>(`${this.applicationApiUrl}/user/${userId}`, this.getHeaders());
  }
 
  deleteInternshipApplication(internshipId: number): Observable<void> {
    return this.http.delete<void>(`${this.applicationApiUrl}/${internshipId}`, this.getHeaders());
  }
 
  addInternshipApplication(data: InternshipApplication): Observable<InternshipApplication> {
    return this.http.post<InternshipApplication>(this.applicationApiUrl, data, this.getHeaders());
  }
 
  getAllInternshipApplications(): Observable<InternshipApplication[]> {
    return this.http.get<InternshipApplication[]>(this.applicationApiUrl, this.getHeaders());
  }
 
  updateApplicationStatus(id: number, internshipApplication: InternshipApplication): Observable<InternshipApplication> {
    return this.http.put<InternshipApplication>(`${this.applicationApiUrl}/${id}`, internshipApplication, this.getHeaders());
  }
}