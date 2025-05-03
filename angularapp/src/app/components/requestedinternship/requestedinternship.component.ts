import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-requestedinternship',
  templateUrl: './requestedinternship.component.html',
  styleUrls: ['./requestedinternship.component.css']
})
 
export class RequestedinternshipComponent implements OnInit {
  applications: Array<any> = []; // List of internship applications
  filteredApplications: Array<any> = []; // Filtered list
  degreeProgramSearch: string = ''; // Search for Degree Program
  statusFilter: string = ''; // Filter by Status
  selectedResume: string | null = null; // Resume selected for popup display

  constructor() {}

  ngOnInit(): void {
    this.loadApplications(); // Load mock data
  }

  // Load applications (mock data for now)
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

  // Search and filter applications
  searchAndFilter(): void {
    this.filteredApplications = this.applications.filter(application =>
      application.degreeProgram.toLowerCase().includes(this.degreeProgramSearch.toLowerCase()) &&
      (!this.statusFilter || application.status.toLowerCase() === this.statusFilter.toLowerCase())
    );
  }

  // Approve application
  approveApplication(index: number): void {
    this.applications[index].Status = 'Approved'; // Change status to Approved
    this.searchAndFilter(); // Refresh filtered list
  }

  // Reject application
  rejectApplication(index: number): void {
    this.applications[index].Status = 'Rejected'; // Change status to Rejected
    this.searchAndFilter(); // Refresh filtered list
  }

  // View resume popup
  viewResume(resume: string): void {
    this.selectedResume = resume; // Set selected resume for popup
  }

  // Close resume popup
  closePopup(): void {
    this.selectedResume = null; // Reset selected resume
  }

  // Navigate to Degree Program Chart
  viewDegreeProgramChart(): void {
    this.router.navigate(['/admin/internshippiechart']);
  }
}
