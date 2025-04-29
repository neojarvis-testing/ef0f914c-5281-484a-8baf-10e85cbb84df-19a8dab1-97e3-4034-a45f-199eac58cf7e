import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Feedback } from 'src/app/models/feedback.model';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-adminviewfeedback',
  templateUrl: './adminviewfeedback.component.html',
  styleUrls: ['./adminviewfeedback.component.css']
})
export class AdminviewfeedbackComponent implements OnInit {
  feedbacks: Feedback[] = [];
  selectedUser: User | null = null; // Stores user details for the modal
  showLogoutModal = false;

  constructor(private feedbackService: FeedbackService, private router: Router) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  /** Load all feedbacks */
  loadFeedbacks(): void {
    this.feedbackService.getFeedbacks().subscribe(
      (data) => {
        this.feedbacks = data;
      },
      (error) => {
        console.error('Error fetching feedbacks:', error);
      }
    );
  }

  /** Show user profile in modal */
  showProfile(user: User): void {
    this.selectedUser = user;
  }

  /** Close user profile modal */
  closeProfileModal(): void {
    this.selectedUser = null;
  }

  /** Open logout confirmation modal */
  confirmLogout(): void {
    this.showLogoutModal = true;
  }

  /** Perform logout action */
  logout(): void {
    this.showLogoutModal = false;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  /** Close logout confirmation modal */
  cancelLogout(): void {
    this.showLogoutModal = false;
  }
}
