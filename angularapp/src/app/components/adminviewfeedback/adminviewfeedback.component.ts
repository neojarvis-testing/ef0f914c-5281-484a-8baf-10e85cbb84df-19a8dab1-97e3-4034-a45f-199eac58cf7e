import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminviewfeedback',
  templateUrl: './adminviewfeedback.component.html',
  styleUrls: ['./adminviewfeedback.component.css']
})
export class AdminviewfeedbackComponent implements OnInit {

  feedbacks: Feedback[] = [];
  selectedUser: Feedback | null = null;
  showNoDataMessage: boolean = false;

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.feedbackService.getFeedbacks().subscribe(
      (data) => {
        this.feedbacks = data;
        if (this.feedbacks.length === 0) {
          setTimeout(() => this.showNoDataMessage = true, 4000);
        }
      },
      (error) => {
        console.error('Error fetching feedbacks:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Unable to fetch feedback data.',
          icon: 'error',
          confirmButtonColor: '#3085d6'
        });
      }
    );
  }

  showProfile(user: Feedback): void {
    Swal.fire({
      title: 'User Profile',
      html: `
        <div class="smart-swal">
          <p><strong>Email:</strong> ${user.user.email}</p>
          <p><strong>Username:</strong> ${user.user.username}</p>
          <p><strong>Mobile:</strong> ${user.user.mobileNumber}</p>
        </div>
      `,
      confirmButtonText: 'Close',
      confirmButtonColor: '#2a9861',
      customClass: {
        popup: 'smart-swal',
        title: 'smart-swal-title'
      }
    });
  }

  closeProfile(): void {
    this.selectedUser = null;
  }
}
