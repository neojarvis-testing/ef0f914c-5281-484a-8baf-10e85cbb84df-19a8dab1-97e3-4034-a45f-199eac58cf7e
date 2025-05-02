import { Component, OnInit } from '@angular/core';
import { InternshipService } from 'src/app/services/internship.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Internship } from 'src/app/models/internship.model';
import { InternshipApplication } from 'src/app/models/internshipapplication.model';

@Component({
  selector: 'app-userviewinternship',
  templateUrl: './userviewinternship.component.html',
  styleUrls: ['./userviewinternship.component.css']
})
export class UserviewinternshipComponent implements OnInit {

  feedbackList: Feedback[] = [];
  showDeleteConfirm = false;
  selectedFeedbackId: number | null = null;
  internships: Internship[] = [];
  appliedInternships: number[] = [];
  userId: number | null = null;

  constructor(
    private feedbackService: FeedbackService,
    private internshipService: InternshipService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userId = Number(params['id']);
      if (!isNaN(this.userId)) {
        this.loadFeedbacks();
        this.loadAppliedInternships();
      } else {
        console.error('Invalid User ID:', params['id']);
      }
    });

    this.loadInternships();
  }

  loadFeedbacks(): void {
    if (this.userId !== null) {
      this.feedbackService.getAllFeedbacksByUserId(this.userId).subscribe(
        (data) => {
          this.feedbackList = data;
          console.log('Feedback loaded:', this.feedbackList);
        },
        (error) => {
          console.error('Error fetching feedback:', error);
        }
      );
    }
  }

  confirmDelete(feedbackId: number): void {
    this.selectedFeedbackId = feedbackId;
    this.showDeleteConfirm = true;
  }

  deleteFeedback(): void {
    if (this.selectedFeedbackId !== null) {
      console.log('Deleting Feedback ID:', this.selectedFeedbackId);
      this.feedbackService.deleteFeedback(this.selectedFeedbackId).subscribe(
        () => {
          this.feedbackList = this.feedbackList.filter(f => f.feedbackId !== this.selectedFeedbackId);
          this.showDeleteConfirm = false;
          this.selectedFeedbackId = null;
          alert('Feedback deleted successfully.');
        },
        (error) => {
          console.error('Error deleting feedback:', error);
          alert('Failed to delete feedback.');
        }
      );
    } else {
      console.error('Error: No feedback ID selected for deletion.');
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.selectedFeedbackId = null;
  }

  loadInternships(): void {
    this.internshipService.getAllInternships().subscribe(
      (data) => {
        this.internships = data;
        console.log('Internships loaded:', this.internships);
      },
      (error) => {
        console.error('Error fetching internships:', error);
      }
    );
  }

  loadAppliedInternships(): void {
    if (this.userId !== null) {
      this.internshipService.getAppliedInternships(this.userId).subscribe(
        (data: InternshipApplication[]) => {
          this.appliedInternships = data.map(app => app.IntershipId);
          console.log('Applied Internships:', this.appliedInternships);
        },
        (error) => {
          console.error('Error fetching applied internships:', error);
        }
      );
    } else {
      console.error('Error: User ID is undefined.');
    }
  }

  hasApplied(internshipId: number): boolean {
    return this.appliedInternships.includes(internshipId);
  }

  applyForInternship(internshipId: number): void {
    console.log('Navigating to apply for internship:', internshipId);
    this.router.navigate(['/internshipform', internshipId]);
  }

  editInternship(internshipId: number | undefined): void {
    console.log('Navigating to edit internship with ID:', internshipId);

    if (internshipId === undefined) {
      console.error('Error: Internship ID is undefined');
      alert('Internship ID is missing, cannot edit.');
      return;
    }

    this.router.navigate(['/admineditinternship', internshipId]);
  }

  deleteInternship(internshipId: number | undefined): void {
    console.log('Attempting to delete Internship ID:', internshipId);

    if (internshipId === undefined) {
      console.error('Error: Internship ID is undefined');
      alert('Internship ID is missing, cannot delete.');
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this internship?');
    if (confirmDelete) {
      this.internshipService.deleteInternship(internshipId).subscribe(
        () => {
          alert('Internship deleted successfully');
          this.loadInternships();
        },
        (error) => {
          console.error('Error deleting internship:', error);
          alert('Error deleting internship. Please check the logs for more details.');
        }
      );
    }
  }
}

