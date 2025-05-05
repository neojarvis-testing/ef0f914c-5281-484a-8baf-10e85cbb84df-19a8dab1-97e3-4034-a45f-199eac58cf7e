import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

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
  showNoRecordsMessage: boolean = false;

  constructor(
    private internshipService: InternshipService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.internshipService.getAllInternshipApplications().subscribe(
      data => {
        this.applications = data.map(app => ({
          ...app,
          status: app.applicationStatus || 'Pending'
        }));
        this.filteredApplications = [...this.applications];
        setTimeout(() => {
          this.showNoRecordsMessage = this.filteredApplications.length === 0;
        }, 3000);
      },
      error => {
        Swal.fire('Error', 'Failed to load applications.', 'error');
      }
    );
  }

  searchAndFilter(): void {
    this.filteredApplications = this.applications.filter(application =>
      (this.degreeProgramSearch === '' ||
        application.degreeProgram.toLowerCase().includes(this.degreeProgramSearch.toLowerCase())) &&
      (this.statusFilter === '' || application.status.toLowerCase() === this.statusFilter.toLowerCase())
    );
  }

  approveApplication(index: number): void {
    const app = this.filteredApplications[index];
    Swal.fire({
      title: 'Approve this application?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      confirmButtonColor: 'green',
      cancelButtonColor: 'gray'
    }).then(result => {
      if (result.isConfirmed) {
        app.applicationStatus = 'Approved';
        app.status = 'Approved';
        this.internshipService.updateApplicationStatus(app.internshipApplicationId, app).subscribe(
          () => {
            Swal.fire('Success', 'Application Approved.', 'success');
            this.loadApplications();
          },
          () => Swal.fire('Error', 'Failed to approve application.', 'error')
        );
      }
    });
  }

  rejectApplication(index: number): void {
    const app = this.filteredApplications[index];
    Swal.fire({
      title: 'Reject this application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: 'red',
      cancelButtonColor: 'gray'
    }).then(result => {
      if (result.isConfirmed) {
        app.applicationStatus = 'Rejected';
        app.status = 'Rejected';
        this.internshipService.updateApplicationStatus(app.internshipApplicationId, app).subscribe(
          () => {
            Swal.fire('Success', 'Application Rejected.', 'success');
            this.loadApplications();
          },
          () => Swal.fire('Error', 'Failed to reject application.', 'error')
        );
      }
    });
  }

  viewResume(url: string | null): void {
    if (!url) {
      Swal.fire('No Resume Found', 'This applicant has not uploaded a resume.', 'info');
      return;
    }

    const resumeIframe = `<iframe src="${url}" width="100%" height="500px" style="border:none;"></iframe>`;
    Swal.fire({
      title: 'Resume Preview',
      html: resumeIframe,
      width: '80%',
      customClass: {
        popup: 'resume-popup'
      },
      showCloseButton: true,
      showConfirmButton: false
    });
  }

  handleLinkedInClick(link: string | null, event: Event): void {
    event.preventDefault();
    if (!link || link.trim() === '') {
      Swal.fire({
        icon: 'info',
        title: 'No LinkedIn Profile',
        text: 'The applicant has not provided a LinkedIn profile link.',
        confirmButtonColor: '#0077b5'
      });
    } else {
      window.open(link, '_blank');
    }
  }

  viewDegreeProgramChart(): void {
    this.router.navigate(['/admin/internshippiechart']);
  }
}
