import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import { InternshipApplication } from 'src/app/models/internshipapplication.model';

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
  userId: number = 1;

  constructor(
    private route: ActivatedRoute,
    private internshipService: InternshipService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // const storedUser = localStorage.getItem('role');
    // const user = JSON.parse(storedUser);
    // this.userId = user.userId;
    this.getInternships();
  }

  getInternships(): void {
    this.internshipService.getAppliedInternships(this.userId).subscribe((data) => {
      console.log("API Response:", data); // Debugging Output
      this.internships = data;
      this.filteredInternshipApplications = data;
    });
  }
  

  searchInternships(): void {
    if (this.searchText.trim() === ''){
      this.filteredInternshipApplications = this.internships;
    } else {
      this.filteredInternshipApplications = this.internships.filter(internship => internship.Intership.companyName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  openDeleteDialog(application: InternshipApplication): void {
    this.selectedApplication = application;
    this.isDeleteDialogOpen = true;
  }

  closeDeleteDialog(): void {
    this.isDeleteDialogOpen = false;
    this.selectedApplication = null;
  }

  confirmDelete(): void {
    if (this.selectedApplication?.InternshipApplicationId) {
      this.internshipService.deleteInternshipApplication(this.selectedApplication.InternshipApplicationId).subscribe(() => {
        this.getInternships();
        this.closeDeleteDialog();
      });
    }
  }

  openResumeDialog(application: InternshipApplication): void {
    if (application.Resume) {
      this.selectedApplication = application;
      this.isResumeDialogOpen = true;
    } else {
      alert('Resume not available');
    }
  }

  closeResumeDialog(): void {
    this.isResumeDialogOpen = false;
    this.selectedApplication = null;
  }
}
