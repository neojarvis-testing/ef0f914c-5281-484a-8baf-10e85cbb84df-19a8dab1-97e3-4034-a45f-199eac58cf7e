import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent implements OnInit {
  feedbackss: Feedback = {
    FeedbackId: 0,
    UserId: 0, // Will be updated dynamically
    FeedbackText: '',
    Date: new Date()
  };

  showSuccessPopup = false;
  validationMessage = '';

  constructor(private feedbackService: FeedbackService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Ensure User ID is fetched correctly
    this.authService.getUserId().subscribe({
      next: (userId) => {
        console.log("User ID fetched:", userId); // Debugging
        this.feedbackss.UserId = userId;
      },
      error: (err) => {
        console.error("Error fetching User ID:", err);
      }
    });
  }

  submitFeedback(): void {
    if (!this.feedbackss.FeedbackText.trim()) {
      this.validationMessage = 'Feedback is required';
      return;
    }

    if (!this.feedbackss.UserId || this.feedbackss.UserId === 0) {
      this.validationMessage = 'User ID missing. Please log in again.';
      console.error("User ID not set correctly:", this.feedbackss.UserId);
      return;
    }

    this.feedbackService.sendFeedback(this.feedbackss).subscribe({
      next: () => {
        this.showSuccessPopup = true;
        setTimeout(() => {
          this.router.navigate(['/viewMyFeedbacks']);
        }, 1000);
        this.feedbackss.FeedbackText = '';
      },
      error: (err) => {
        console.error("Error submitting feedback:", err);
        this.validationMessage = 'Failed to submit feedback. Please try again.';
      }
    });
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
  }
}
