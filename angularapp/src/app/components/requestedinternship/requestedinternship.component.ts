import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';

@Component({
  selector: 'app-requestedinternship',
  templateUrl: './requestedinternship.component.html',
  styleUrls: ['./requestedinternship.component.css']
})
export class RequestedinternshipComponent implements OnInit {
  applications: Array<any> = [];
  filteredApplications: Array<any> = [];
  degreeProgramSearch: string = ''; 
  statusFilter: string = ''; 
  selectedResumeUrl: string | null = null;
  

  constructor(private internshipService: InternshipService, private router: Router) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  /** Load internship applications */
  loadApplications(): void {
    this.internshipService.getAllInternshipApplications().subscribe(
      data => {
        this.applications = data;
      },
      error => {
        alert('Failed to load applications.');
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

  /** Approve internship application */
  approveApplication(index: number): void {
    this.filteredApplications[index].status = 'Approved';
    this.internshipService.updateApplicationStatus(this.filteredApplications[index].id, this.filteredApplications[index]).subscribe();
  }

  /** Reject internship application */
  rejectApplication(index: number): void {
    this.filteredApplications[index].status = 'Rejected';
    this.internshipService.updateApplicationStatus(this.filteredApplications[index].id, this.filteredApplications[index]).subscribe();
  }

  /** View Resume */
  viewResume(resumeUrl: string): void {
    this.selectedResumeUrl = resumeUrl; 
  }

  /** Close Resume Viewer */
  closePopup(): void {
    this.selectedResumeUrl = null; 
  }

  /** Navigate to Degree Program Chart */
  viewDegreeProgramChart(): void {
    this.router.navigate(['/admin/internshippiechart']);
  }
}


