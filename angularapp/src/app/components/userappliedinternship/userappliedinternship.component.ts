import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import { InternshipApplication } from 'src/app/models/internshipapplication.model';
import { AuthService } from 'src/app/services/auth.service';

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
  selectedApplication: InternshipApplication | null = null;
  userId: number;

  constructor(
    private route: ActivatedRoute,
    private internshipService: InternshipService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // const storedUser = localStorage.getItem('role');
    // const user = JSON.parse(storedUser);
    // this.userId = user.userId;
    this.userId = +this.authService.getUserId();
    console.log("User ID:", this.userId);
    this.getInternships();
  }

  getInternships(): void {
    this.internshipService.getAppliedInternships(this.userId).subscribe((data) => {
      console.log("API Response:", data); // ✅ Log full data
      this.internships = data;
      this.filteredInternshipApplications = data;
    });
  }

  searchInternships(): void {
    if (this.searchText.trim()) {
      this.filteredInternshipApplications = this.internships.filter(appliedInternship =>
        appliedInternship.internship?.companyName?.toLowerCase().includes(this.searchText.toLowerCase()) // ✅ Ensure `internship` exists before filtering
      );
    } else {
      this.filteredInternshipApplications = this.internships; // ✅ Reset list when input is empty
    }
    // console.log(this.filteredInternshipApplications);
  }
  
  openDeleteDialog(application: InternshipApplication): void {
    if (application) {
      this.selectedApplication = application; // ✅ Ensures correct assignment
      this.isDeleteDialogOpen = true;
      console.log("Selected Application for Deletion:", this.selectedApplication); // ✅ Debugging log
    } else {
      console.error("Invalid Internship Application received."); // ✅ Error handling
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
  
  openResumeDialog(application: InternshipApplication): void {
    if (application && application.resume) {
      this.selectedApplication = application;
      this.isResumeDialogOpen = true;
      console.log("Opening Resume for:", application.resume); // ✅ Debugging log
    } else {
      alert('Resume not available or missing.');
      console.warn("Resume is missing for:", application); // ✅ Additional debugging log
    }
  }
  

  closeResumeDialog(): void {
    this.isResumeDialogOpen = false;
    this.selectedApplication = null;
  }
}
