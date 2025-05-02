import { Component, OnInit } from '@angular/core';

import { InternshipService } from 'src/app/services/internship.service';
import { Router } from '@angular/router';

import { ActivatedRoute, Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { InternshipService } from 'src/app/services/internship.service';
import { Internship } from 'src/app/models/internship.model';


@Component({
  selector: 'app-userviewinternship',
  templateUrl: './userviewinternship.component.html',
  styleUrls: ['./userviewinternship.component.css']
})
export class UserviewinternshipComponent implements OnInit {
  internships: any[] = []; // List of internships
  appliedInternships: number[] = []; // List of IDs of internships already applied

  constructor(private internshipService: InternshipService, private router: Router) {}

  ngOnInit(): void {
    this.loadInternships(); // Load internships on initialization
  }

  // Load all internships posted by admin
  loadInternships(): void {
    this.internshipService.getAllInternships().subscribe(
      (data) => {
        this.internships = data;
      },
      (error) => {
        console.error('Error loading internships:', error);
      }
    );
  }

  // Check if the internship has been applied for
  isApplied(internshipId: number): boolean {
    return this.appliedInternships.includes(internshipId);
  }

  // Navigate to the Internship Application Form
  applyInternship(internshipId: number): void {
    this.router.navigate(['/internshipform', internshipId]);
  }

  // Navigate back to the User View Internship page
  goBack(): void {
    this.router.navigate(['/userviewinternship']);
  }
  feedbackList: Feedback[] = [];
  showDeleteConfirm = false;
  selectedFeedbackId: number | null = null;
  internships: Internship[] = [];
  appliedInternships: number[] = [];

  constructor(
    private feedbackService: FeedbackService,
    private internshipService: InternshipService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const userId = Number(params['id']);
      if (!isNaN(userId)) {
        this.loadFeedbacks(userId);
      }
    });

    this.loadInternships();
    this.loadAppliedInternships();
  }

  loadFeedbacks(userId: number): void {
    this.feedbackService.getAllFeedbacksByUserId(userId).subscribe(
      data => {
        this.feedbackList = data;
      },
      error => {
        console.error('Error fetching feedback:', error);
      }
    );
  }

  confirmDelete(feedbackId: number): void {
    this.selectedFeedbackId = feedbackId;
    this.showDeleteConfirm = true;
  }

  deleteFeedback(): void {
    if (this.selectedFeedbackId !== null) {
      this.feedbackService.deleteFeedback(this.selectedFeedbackId).subscribe(() => {
        this.feedbackList = this.feedbackList.filter(f => f.feedbackId !== this.selectedFeedbackId);
        this.showDeleteConfirm = false;
        this.selectedFeedbackId = null;
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.selectedFeedbackId = null;
  }

  loadInternships(): void {
    this.internshipService.getAllInternships().subscribe(
      data => {
        this.internships = data;
      },
      error => {
        console.error('Error fetching internships:', error);
      }
    );
  }

  loadAppliedInternships(): void {
    this.appliedInternships = [1, 3]; // Replace with API call if needed
  }

  hasApplied(internshipId: number): boolean {
    return this.appliedInternships.includes(internshipId);
  }

  applyForInternship(internshipId: number): void {
    this.router.navigate(['/internshipform', internshipId]);
  }
}
