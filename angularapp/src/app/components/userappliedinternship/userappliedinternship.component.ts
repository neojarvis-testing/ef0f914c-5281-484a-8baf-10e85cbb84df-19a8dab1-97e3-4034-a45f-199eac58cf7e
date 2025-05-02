import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import { InternshipApplication } from 'src/app/models/internshipapplication.model';
import { Internship } from 'src/app/models/internship.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InternshipService } from 'src/app/services/internship.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-userappliedinternship',
  templateUrl: './userappliedinternship.component.html',
  styleUrls: ['./userappliedinternship.component.css']
})
export class UserappliedinternshipComponent implements OnInit {
  userId!: number;

  // this will hold the merged data
  mergedApplications: {
    application: InternshipApplication;
    internship: Internship | null;
  }[] = [];

  searchText: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private internshipService: InternshipService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      console.log("Extracted userid:"+this.userId);
      this.fetchUserApplications(this.userId);
    });
  }

  fetchUserApplications(userId: number): void {
    this.isLoading = true;

    this.internshipService.getAppliedInternships(userId).subscribe({
      next: (applications) => {
        if (applications.length === 0) {
          this.mergedApplications = [];
          this.isLoading = false;
          return;
        }

        const internshipRequests = applications.map(app =>
          this.internshipService.getInternshipById(app.IntershipId).pipe(
            catchError(() => of(null)) // handle missing internship
          )
        );

        forkJoin(internshipRequests).subscribe(internshipData => {
          this.mergedApplications = applications.map((app, i) => ({
            application: app,
            internship: internshipData[i]
          }));

          this.isLoading = false;
          console.log('✅ Final mergedApplications:', this.mergedApplications);
        });
      },
      error: error => {
        console.error('Error fetching applications:', error);
        this.mergedApplications = [];
        this.isLoading = false;
      }
    });
  }

  get filteredApplications() {
    return this.mergedApplications.filter(item =>
      item.internship?.CompanyName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  deleteApplication(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this application?');
    if (confirmDelete) {
      this.internshipService.deleteInternshipApplication(id).subscribe(() => {
        this.fetchUserApplications(this.userId);
      });
    }
  }

  viewResume(resume: string): void {
    alert(`Resume: ${resume}`);
    // Replace with popup logic if needed
  }
}



  userId: number;
  appliedInternships: any[] = [];
  filteredAppliedInternships: any[] = [];
  searchQuery = '';
  selectedResume = '';
  showResumePopup = false;
  showDeletePopup = false;
  deleteId: number | null = null;

  constructor(private internshipservice: InternshipService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadAppliedInternships();
  }

  loadAppliedInternships() {
    this.route.params.subscribe((params) => {
      this.userId = Number(params['id']);
      if (this.userId) {
        this.internshipservice.getAppliedInternships(this.userId).subscribe(
          applications => {
            let mergedData: any[] = [];

            applications.forEach(application => {
              this.internshipservice.getInternshipById(application.IntershipId).subscribe(
                internship => {
                  mergedData.push({
                    companyName: internship.CompanyName,  // ✅ From Internship model
                    resumeUrl: application.Resume,       // ✅ From InternshipApplication model
                    applicationDate: application.ApplicationDate, // ✅ From InternshipApplication model
                    applicationStatus: application.ApplicationStatus, // ✅ From InternshipApplication model
                    id: application.InternshipApplicationId  // ✅ Needed for delete functionality
                  });

                  // Once all internship data is fetched, update the lists
                  this.appliedInternships = mergedData;
                  this.filteredAppliedInternships = [...this.appliedInternships];
                  console.log("Merged Internships:", this.filteredAppliedInternships); // ✅ Debug Log
                },
                error => {
                  console.error("Error fetching internship details:", error);
                }
              );
            });

          },
          error => {
            console.error("Error fetching applied internships:", error);
          }
        );
      }
    });
  }

  filteredInternships() {
    if (this.searchQuery.trim()) {
      this.filteredAppliedInternships = this.appliedInternships.filter(internship =>
        internship.companyName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredAppliedInternships = [...this.appliedInternships]; // ✅ Reset to original list
    }
  }  

  viewResume(url: string) {
    this.selectedResume = url;
    this.showResumePopup = true;
  }

  closeResumePopup() {
    this.showResumePopup = false;
    this.selectedResume = '';
  }

  confirmDelete(id: number) {
    this.deleteId = id;
    this.showDeletePopup = true;
  }

  deleteInternship() {
    if (this.deleteId !== null) {
      this.internshipservice.deleteInternshipApplication(this.deleteId).subscribe(() => {
        this.appliedInternships = this.appliedInternships.filter(internship => internship.id !== this.deleteId);
        this.filteredAppliedInternships = this.filteredAppliedInternships.filter(internship => internship.id !== this.deleteId);
      });
    }
    this.showDeletePopup = false;
    this.deleteId = null;
  }
  
  closeDeletePopup() {
    this.showDeletePopup = false;
    this.deleteId = null;
  }
}

