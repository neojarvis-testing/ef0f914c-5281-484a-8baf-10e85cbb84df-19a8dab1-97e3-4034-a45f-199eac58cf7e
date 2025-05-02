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
    UserId: 0, // Will be updated dynamically
    FeedbackText: '',
    Date: new Date()
  };

  showSuccessPopup = false;
  validationMessage = '';

  constructor(private feedbackService: FeedbackService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  submitFeedback(): void {

    console.log("Feedback object:", this.feedbackss);
    this.feedbackss.UserId = +this.authService.getUserId();
    console.log(this.feedbackss.UserId);

    if (!this.feedbackss.FeedbackText.trim()) {
      this.validationMessage = 'Feedback is required';
      return;
    }
    console.log("User ID:", this.authService.getUserId());
    this.feedbackss.UserId = +this.authService.getUserId();
    //console.log(this.feedbackss)
    console.log("ewfbhbhf");
    this.feedbackService.sendFeedback(this.feedbackss).subscribe({
      next: () => {
        console.log("Secc");

        this.showSuccessPopup = true;
        setTimeout(() => {
          this.router.navigate(['/user/view-feedbacks']);
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
