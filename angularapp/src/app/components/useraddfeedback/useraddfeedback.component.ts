import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  feedbackText: string = '';
  showSuccessPopup = false;
  validationMessage = '';

  submitFeedback() {
    if (!this.feedbackText.trim()) {
      this.validationMessage = 'Feedback is required';
      return;
    }
    this.showSuccessPopup = true;
    this.validationMessage = ''; // Clear validation message
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
    this.feedbackText = ''; // Clear feedback form
  }


}
