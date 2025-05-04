import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
 
@Component({
  selector: 'app-requestedinternship',
  templateUrl: './requestedinternship.component.html',
  styleUrls: ['./requestedinternship.component.css']
})
 
export class RequestedinternshipComponent implements OnInit {
  applications: Array<any> = []; // List of applications
  filteredApplications: Array<any> = []; // Filtered list
  degreeProgramSearch: string = ''; // Search for Degree Program
  statusFilter: string = ''; // Filter by Status
  selectedResume: string | null = null; // Resume selected for popup display
 
  constructor(private router: Router, private internshipService: InternshipService) {} // Inject the service
 
  ngOnInit(): void {
    this.loadApplications(); // Load applications from the service
  }
 
  /** Load applications from the service */
  loadApplications(): void {
    this.internshipService.getAllInternshipApplications().subscribe(
      data => {
        this.applications = data;
        this.filteredApplications = [...this.applications]; // Initialize filtered list
      },
      error => {
        alert('Failed to load applications. Please try again.'); // Error handling
      }
    );
  }
 
 
  /** Search and filter applications */
  searchAndFilter(): void {
    this.filteredApplications = this.applications.filter(application =>
      application.degreeProgram.toLowerCase().includes(this.degreeProgramSearch.toLowerCase()) &&
      (!this.statusFilter || application.status.toLowerCase() === this.statusFilter.toLowerCase())
    );
  }
 
  /** Approve application and hide only Approve button */
  approveApplication(index: number): void {
    this.filteredApplications[index].status = 'Approved'; // Change status
    // Update status in the backend
    this.internshipService.updateApplicationStatus(this.filteredApplications[index].id, this.filteredApplications[index]).subscribe();
  }
 
  /** Reject application and hide only Reject button */
  rejectApplication(index: number): void {
    this.filteredApplications[index].status = 'Rejected'; // Change status
    // Update status in the backend
    this.internshipService.updateApplicationStatus(this.filteredApplications[index].id, this.filteredApplications[index]).subscribe();
  }
 
  /** View Resume in Popup */
  viewResume(resume: string): void {
    this.selectedResume = resume; // Set selected resume
  }
 
  /** Close Resume Popup */
  closePopup(): void {
    this.selectedResume = null; // Reset popup
  }
 
  /** Navigate to Degree Program Chart */
  viewDegreeProgramChart(): void {
    this.router.navigate(['/admin/internshippiechart']);
  }
}