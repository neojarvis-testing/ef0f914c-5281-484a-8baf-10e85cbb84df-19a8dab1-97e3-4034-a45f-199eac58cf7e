import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adminviewfeedback',
  templateUrl: './adminviewfeedback.component.html',
  styleUrls: ['./adminviewfeedback.component.css']
})
export class AdminviewfeedbackComponent implements OnInit {

  feedbacks = [
    { 
      id: 1, 
      user: 'John Doe', 
      email: 'johndoe@example.com', 
      mobileNo: '123-456-7890', 
      feedback: 'Great service!', 
      postedDate: '2025-04-25' 
    },
    { 
      id: 2, 
      user: 'Jane Smith', 
      email: 'janesmith@example.com', 
      mobileNo: '987-654-3210', 
      feedback: 'Could be better.', 
      postedDate: '2025-04-27' 
    }
  ]; // Example data

  selectedUser: any = null;

  constructor() { }

  ngOnInit(): void {
  }

  showProfile(user: any): void {
    this.selectedUser = user;
  }

  closeProfile(): void {
    this.selectedUser = null;
  }
}
