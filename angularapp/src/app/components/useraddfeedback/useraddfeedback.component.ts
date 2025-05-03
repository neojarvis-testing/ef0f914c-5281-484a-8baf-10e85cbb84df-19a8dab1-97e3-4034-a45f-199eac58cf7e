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
    userId: 0,
    feedbackText: '',
    date: new Date() // ✅ Automatically set current date
  };

  showSuccessPopup = false;
  validationMessage = '';

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Set user ID dynamically on component initialization
    this.feedbackss.userId = +this.authService.getUserId();
  }

  /** Submit Feedback */
  submitFeedback(): void {
    // ✅ Ensure feedback is not empty
    if (!this.feedbackss.feedbackText.trim()) {
      this.validationMessage = 'Feedback is required';
      return;
    }

    // ✅ Set current date dynamically before sending
    this.feedbackss.date = new Date();

    console.log("Submitting Feedback:", this.feedbackss);

    this.feedbackService.sendFeedback(this.feedbackss).subscribe({
      next: () => {
        console.log("Feedback submitted successfully");

        // ✅ Show success popup and reset feedback text
        this.showSuccessPopup = true;
        this.feedbackss.feedbackText = '';

        setTimeout(() => {
          this.router.navigate(['/user/view-feedbacks']);
        }, 1000);
      },
      error: (err) => {
        console.error("Error submitting feedback:", err);
        this.validationMessage = 'Failed to submit feedback. Please try again.';
      }
    });
  }

  /** Close Success Popup */
  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
  }
}
