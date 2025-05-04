import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';

@Component({
  selector: 'app-requestedinternship',
  templateUrl: './requestedinternship.component.html',
  styleUrls: ['./requestedinternship.component.css']
})
export class RequestedinternshipComponent implements OnInit {
  applications: any[] = [];
  filteredApplications: any[] = [];
  degreeProgramSearch: string = ''; 
  statusFilter: string = ''; 
  selectedResumeUrl: string | null = null;
  showResumePopup: boolean = false; // ✅ Control popup visibility

  constructor(private internshipService: InternshipService, private router: Router) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  /** Load internship applications */
  loadApplications(): void {
    this.internshipService.getAllInternshipApplications().subscribe(
      data => {
        this.applications = data.map(app => ({
          ...app,
          status: app.applicationStatus || 'Pending' // ✅ Ensure default status is "Pending"
        }));
        this.filteredApplications = [...this.applications]; 
        console.log(this.filteredApplications);
      },
      error => {
        alert('Failed to load applications.');
      }
    );
  }

  /** Search and filter applications */
  searchAndFilter(): void {
    this.filteredApplications = this.applications.filter(application =>
      (this.degreeProgramSearch === '' || application.degreeProgram.toLowerCase().includes(this.degreeProgramSearch.toLowerCase())) &&
      (this.statusFilter === '' || application.status.toLowerCase() === this.statusFilter.toLowerCase())
    );
  }

  /** Approve internship application */
  approveApplication(index: number): void {
    this.filteredApplications[index].status = 'Approved';
    this.internshipService.updateApplicationStatus(this.filteredApplications[index].id, this.filteredApplications[index]).subscribe(() => {
      this.loadApplications();
    });
  }

  /** Reject internship application */
  rejectApplication(index: number): void {
    this.filteredApplications[index].status = 'Rejected';
    this.internshipService.updateApplicationStatus(this.filteredApplications[index].id, this.filteredApplications[index]).subscribe(() => {
      this.loadApplications();
    });
  }

  /** Show Resume Preview */
  viewResume(resumeUrl: string): void {
    this.selectedResumeUrl = resumeUrl; 
    this.showResumePopup = true; // ✅ Open popup
  }

  /** Close Resume Viewer */
  closePopup(): void {
    this.selectedResumeUrl = null; 
    this.showResumePopup = false; // ✅ Close popup
  }

  /** Navigate to Degree Program Chart */
  viewDegreeProgramChart(): void {
    this.router.navigate(['/admin/internshippiechart']);
  }
}
