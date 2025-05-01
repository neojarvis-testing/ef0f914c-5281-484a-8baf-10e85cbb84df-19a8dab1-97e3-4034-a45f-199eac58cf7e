import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import { InternshipApplication } from 'src/app/models/internshipapplication.model';
import { Internship } from 'src/app/models/internship.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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



