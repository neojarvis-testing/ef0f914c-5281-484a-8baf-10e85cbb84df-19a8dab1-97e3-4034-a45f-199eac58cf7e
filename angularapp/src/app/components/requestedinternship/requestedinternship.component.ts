import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private route:Router) {}

  ngOnInit(): void {
    this.loadApplications(); // Load mock data
  }

  /** Load mock applications */
  loadApplications(): void {
    this.applications = [
      {
        SNo: 1,
        Username: 'John Doe',
        UniversityName: 'MIT',
        DegreeProgram: 'Computer Science',
        ApplicationDate: '2023-06-01',
        LinkedInProfile: 'https://www.linkedin.com/in/johndoe',
        Status: 'Pending',
        Resume: 'assets/resume1.pdf'
      },
      {
        SNo: 2,
        Username: 'Jane Smith',
        UniversityName: 'Harvard',
        DegreeProgram: 'Business Administration',
        ApplicationDate: '2023-06-05',
        LinkedInProfile: 'https://www.linkedin.com/in/janesmith',
        Status: 'Pending',
        Resume: 'assets/resume2.pdf'
      }
    ];
    this.filteredApplications = [...this.applications]; // Initialize filtered list
  }

  /** Search and filter applications */
  searchAndFilter(): void {
    this.filteredApplications = this.applications.filter(application =>
      application.DegreeProgram.toLowerCase().includes(this.degreeProgramSearch.toLowerCase()) &&
      (!this.statusFilter || application.Status.toLowerCase() === this.statusFilter.toLowerCase())
    );
  }

  /** Approve application and hide only Approve button */
  approveApplication(index: number): void {
    this.filteredApplications[index].Status = 'Approved'; // Change status
  }

  /** Reject application and hide only Reject button */
  rejectApplication(index: number): void {
    this.filteredApplications[index].Status = 'Rejected'; // Change status
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
    this.route.navigate([`/admin/internshippiechart`]);
    
  }
}
