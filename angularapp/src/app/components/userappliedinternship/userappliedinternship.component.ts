import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import { InternshipApplication } from 'src/app/models/internshipapplication.model';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
 
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
  showNoRecordsMessage: boolean = false; // Added for delay handling
  resume: string

 
  constructor(
    private route: ActivatedRoute,
    private internshipService: InternshipService,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer
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
      console.log(data[5].resume);
      
      this.filteredInternshipApplications = data;
  
      // Introduce a delay before showing the message
      setTimeout(() => {
        this.showNoRecordsMessage = this.filteredInternshipApplications.length === 0;
      }, 4000); // 4-second delay
    });
  }
  
 
  searchInternships(): void {
    if (this.searchText.trim()) {
      this.filteredInternshipApplications = this.internships.filter(appliedInternship =>
        appliedInternship.internship?.companyName?.toLowerCase().includes(this.searchText.toLowerCase()) || // ✅ Ensure `internship` exists before filtering
        appliedInternship.internship?.title?.toLowerCase().includes(this.searchText.toLowerCase())
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
 
  openDemo(item: string){
    console.log("hai");
    this.selectedResume = this.sanitizer.bypassSecurityTrustResourceUrl(item);
    console.log(this.selectedResume);
    
    this.isResumeDialogOpen=true
    let resume = item
    // this.resume = this.selectedResume 

  }
  openResumeDialog(item: any): void {
    console.log(item);
    
    const storedResumePath = item.resume; // ✅ Get stored resume URL
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
 