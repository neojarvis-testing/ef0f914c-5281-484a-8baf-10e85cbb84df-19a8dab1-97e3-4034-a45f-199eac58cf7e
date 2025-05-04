import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-adminviewfeedback',
  templateUrl: './adminviewfeedback.component.html',
  styleUrls: ['./adminviewfeedback.component.css']
})
export class AdminviewfeedbackComponent implements OnInit {

  feedbacks: Feedback[] = [];
  selectedUser: Feedback = null;

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.feedbackService.getFeedbacks().subscribe(
      (data) => {
        this.feedbacks = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching feedbacks:', error);
      }
    );
  }

  showProfile(user: any): void {
    this.selectedUser = user;
  }

  closeProfile(): void {
    this.selectedUser = null;
  }
}
