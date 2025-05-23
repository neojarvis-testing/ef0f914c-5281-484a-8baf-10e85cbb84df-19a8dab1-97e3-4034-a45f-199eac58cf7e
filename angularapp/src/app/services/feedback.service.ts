
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) {}

  private apiUrl = 'https://8080-bcededaebddfddaeecadabeafeaccfe.premiumproject.examly.io/api/Feedback';


  private getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  sendFeedback(feedback: Feedback): Observable<Feedback> {
    feedback.date = new Date();
    return this.http.post<Feedback>(this.apiUrl, feedback, this.getHeaders());
  }

  getAllFeedbacksByUserId(userId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/${userId}`, this.getHeaders());
  }

  deleteFeedback(feedbackId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${feedbackId}`, this.getHeaders());
  }

  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl, this.getHeaders());
  }
}
