
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';


import { InternshipService } from 'src/app/services/internship.service';

import { Internship } from 'src/app/models/internship.model';

import { Router } from '@angular/router';
 
@Component({

  selector: 'app-userviewinternship',

  templateUrl: './userviewinternship.component.html',

  styleUrls: ['./userviewinternship.component.css']

})

export class UserviewinternshipComponent implements OnInit {
  feedbackList: Feedback[] = [
    {
      feedbackId: 0,
      UserId: 0,
      FeedbackText: '',
      Date: new Date('2024-04-05')
  }
  ];
  showDeleteConfirm = false;
  FeedbackByUserId: number;
  constructor(private feedbackService:FeedbackService, private router: Router,private activatedRoute: ActivatedRoute) { }
 
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((feedbackdata)=>{
      this.FeedbackByUserId = Number(feedbackdata['id']);
      
    });
    this.loadFeedbacks();
  }

  loadFeedbacks(): void
  {
    this.feedbackService.getAllFeedbacksByUserId(this.FeedbackByUserId).subscribe((data)=>{
      this.feedbackList=data;
    });
  }

  confirmDelete(feedbackId: number): void {
    this.FeedbackByUserId = feedbackId;
    this.showDeleteConfirm = true;
  }

  deleteFeedback(): void {
    this.feedbackService.deleteFeedback(this.FeedbackByUserId).subscribe(() => {
      this.feedbackList = this.feedbackList.filter(f => f.feedbackId !== this.FeedbackByUserId);
      this.showDeleteConfirm = false;
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;

  internships: Internship[] = []; // List of internships

  appliedInternships: number[] = []; // List of IDs for applied internships
 
  constructor(private internshipService: InternshipService, private router: Router) {}
 
  ngOnInit(): void {

    this.loadInternships(); // Load internships on initialization

    this.loadAppliedInternships(); // Mock or real data for applied internships

  }
 
  // Load internships from the service

  loadInternships(): void {

    this.internshipService.getAllInternships().subscribe(

      (data) => {

        this.internships = data;

      },

      (error) => {

        console.error('Error fetching internships:', error);

      }

    );

  }
 
  // Mock: Load applied internships (replace with API call if needed)

  loadAppliedInternships(): void {

    this.appliedInternships = [1, 3]; // Example applied internship IDs (mock data)

  }
 
  // Check if the user has applied for the internship

  hasApplied(internshipId: number): boolean {

    return this.appliedInternships.includes(internshipId);

  }
 
  // Navigate to the internship application form

  applyForInternship(internshipId: number): void {

    this.router.navigate(['/internshipform', internshipId]);

  }

}
