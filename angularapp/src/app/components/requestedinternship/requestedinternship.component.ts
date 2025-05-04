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

  constructor(private internshipService: InternshipService, private router: Router) { }

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

  approveApplication(index: number): void {
    const application = this.filteredApplications[index];
    if (!application || !application.internshipApplicationId) {
      console.error("Invalid application data:", application);
      alert("Error: Internship Application ID is missing.");
      return;
    }
  
    application.applicationStatus = 'Approved';
    application.status = 'Approved';
    this.internshipService.updateApplicationStatus(application.internshipApplicationId, application).subscribe(
      response => {
        console.log("✅ API Response:", response); // Should reflect "Approved" or "Rejected"
        if (response && response.applicationStatus === application.status) { 
          this.loadApplications();
        } else {
          // alert("Error: Status update failed.");
        }
      },
      error => {
        console.error("❌ API Error:", error);
        // alert("Failed to update application status.");
      }
    );    
  }
  

  rejectApplication(index: number): void {
    const application = this.filteredApplications[index];
    if (!application || !application.internshipApplicationId) {
      console.error("Invalid application data:", application);
      alert("Error: Internship Application ID is missing.");
      return;
    }
  
    application.applicationStatus = 'Rejected';
    application.status = 'Rejected';
    this.internshipService.updateApplicationStatus(application.internshipApplicationId, application).subscribe(
      response => {
        console.log("✅ API Response:", response); // Should reflect "Approved" or "Rejected"
        if (response && response.applicationStatus === application.status) { 
          this.loadApplications();
        } else {
          // alert("Error: Status update failed.");
        }
      },
      error => {
        console.error("❌ API Error:", error);
        // alert("Failed to update application status.");
      }
    );
    
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
