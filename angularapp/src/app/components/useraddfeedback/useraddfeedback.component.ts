import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent implements OnInit {

  constructor(private feedbackService: FeedbackService) { }
  feedbackText: string;
  ngOnInit(): void {
  }

  feedbackss: Feedback = {
    FeedbackId: 0,
    UserId: 0,
    FeedbackText: "",
    Date: new Date("2025-04-30")
  };
  showSuccessPopup = false;
  validationMessage = '';

  submitFeedback() {
    if (!this.feedbackText.trim()) {
      this.validationMessage = 'Feedback is required';
      return;
    }
    this.showSuccessPopup = true;
    this.feedbackService.sendFeedback(this.feedbackss)
    this.validationMessage = ''; // Clear validation message
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
    this.feedbackText = ''; // Clear feedback form
  }


}
