import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import { InternshipApplication } from 'src/app/models/internshipapplication.model';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userappliedinternship',
  templateUrl: './userappliedinternship.component.html',
  styleUrls: ['./userappliedinternship.component.css']
})
export class UserappliedinternshipComponent implements OnInit {
  internships: InternshipApplication[] = [];
  filteredInternshipApplications: InternshipApplication[] = [];
  searchText: string = '';
  deleteId: number | null = null;
  isDeleteDialogOpen: boolean = false;
  isResumeDialogOpen: boolean = false;
  selectedResume: SafeResourceUrl | null = null;
  selectedApplication: InternshipApplication | null = null;
  userId: number;
  showNoRecordsMessage: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private internshipService: InternshipService,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.userId = +this.authService.getUserId();
    console.log("User ID:", this.userId);
    this.getInternships();
  }

  getInternships(): void {
    this.internshipService.getAppliedInternships(this.userId).subscribe((data) => {
      console.log("API Response:", data);
      this.internships = data;
      this.filteredInternshipApplications = data;
      setTimeout(() => {
        this.showNoRecordsMessage = this.filteredInternshipApplications.length === 0;
      }, 4000);
    });
  }

  searchInternships(): void {
    if (this.searchText.trim()) {
      this.filteredInternshipApplications = this.internships.filter(appliedInternship =>
        appliedInternship.internship?.companyName?.toLowerCase().includes(this.searchText.toLowerCase()) || 
        appliedInternship.internship?.title?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredInternshipApplications = this.internships;
    }
  }

  openDeleteDialog(application: InternshipApplication): void {
    if (application) {
      this.selectedApplication = application;
      this.isDeleteDialogOpen = true;
      console.log("Selected Application for Deletion:", this.selectedApplication);
    } else {
      console.error("Invalid Internship Application received.");
    }
  }

  closeDeleteDialog(): void {
    this.isDeleteDialogOpen = false;
    this.selectedApplication = null;
  }

  confirmDelete(): void {
    if (!this.selectedApplication || !this.selectedApplication.internshipApplicationId) {
      console.error("Error: No internship selected for deletion.");
      return;
    }
    console.log("Attempting to delete Internship ID:", this.selectedApplication.internshipApplicationId);

    this.internshipService.deleteInternshipApplication(this.selectedApplication.internshipApplicationId).subscribe(() => {
      console.log("Internship deleted successfully.");
      this.filteredInternshipApplications = this.filteredInternshipApplications.filter(
        (i) => i.internshipApplicationId !== this.selectedApplication.internshipApplicationId
      );
      this.internships = this.internships.filter(
        (i) => i.internshipApplicationId !== this.selectedApplication.internshipApplicationId
      );
      this.closeDeleteDialog();
    }, (error) => {
      console.error("Error deleting internship:", error);
    });
  }

  viewResume(resumeUrl: string) {
    Swal.fire({
      title: '<strong>Resume Preview</strong>',
      html: `
      <div style="overflow:hidden; border-radius:12px; box-shadow:0 0 10px rgba(0,0,0,0.2);">
        <iframe src="${resumeUrl}" width="100%" height="500px" style="border:none;"></iframe>
      </div>
    `,
      width: '90%',
      padding: '1.5rem',
      background: '#f4f9ff',
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Close',
      confirmButtonColor: '#0d6efd',
      focusConfirm: false,
      customClass: {
        popup: 'rounded-4 border-0 shadow'
      },
      didOpen: () => {
        const iframe = document.querySelector('iframe');
        if (iframe) iframe.focus();
      }
    });
  }

  openResumeDialog(item: any): void {
    console.log(item);
    const storedResumePath = item.resume;
    if (!storedResumePath) {
      alert('No resume found.');
      return;
    }
    this.selectedApplication = item;
    this.isResumeDialogOpen = true;
  }

  closeResumeDialog(): void {
    this.isResumeDialogOpen = false;
    this.selectedApplication = null;
  }
}
