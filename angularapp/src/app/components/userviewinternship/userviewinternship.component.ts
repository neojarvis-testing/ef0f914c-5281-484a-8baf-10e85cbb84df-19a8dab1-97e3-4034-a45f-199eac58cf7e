import { Component, OnInit } from '@angular/core';
import { InternshipService } from 'src/app/services/internship.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Internship } from 'src/app/models/internship.model';
 
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
  filteredInternships: Internship[] = []; // New filtered list
  appliedInternships: number[] = [];
  internshipTitleSearch: string = ''; // Search field for internship title
  locationFilter: string = ''; // Location filter
  searchQuery : string='';
 
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
    // this.loadAppliedInternships();
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
 
  loadInternships(): void {
    this.internshipService.getAllInternships().subscribe(
      data => {
        this.internships = data;
        this.filteredInternships = [...this.internships]; // Initialize filtered list
      },
      error => {
        console.error('Error fetching internships:', error);
      }
    );
  }
 
  // loadAppliedInternships(): void {
  //   this.appliedInternships = [1, 3]; // Replace with API call if needed
  // }

  hasApplied(internshipId: number): boolean {
    return this.appliedInternships.includes(internshipId) || localStorage.getItem(`applied_${internshipId}`) === 'true';
  }
  
 
  applyForInternship(internshipId: number): void {
   
    this.router.navigate([`/user/internshipform/${internshipId}`]);
    console.log("Navigating to:", `/user/internshipform/${internshipId}`);
  }
 
 
 
  // New search and filter method
  searchInternships(): void {
    const query = this.searchQuery.toLowerCase();
      console.log(query)
    this.filteredInternships = this.internships.filter(internship =>
        internship.companyName?.toLowerCase().includes(query) ||
        internship.location?.toLowerCase().includes(query) ||
        internship.title?.toLowerCase().includes(query)
    );
 
    console.log('Filtered Internships:', this.filteredInternships); // ✅ Debugging line
  }
 
}
 