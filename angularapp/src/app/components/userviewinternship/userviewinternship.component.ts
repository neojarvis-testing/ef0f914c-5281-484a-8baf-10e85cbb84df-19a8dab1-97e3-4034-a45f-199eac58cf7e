import { Component, OnInit } from '@angular/core';
import { InternshipService } from 'src/app/services/internship.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userviewinternship',
  templateUrl: './userviewinternship.component.html',
  styleUrls: ['./userviewinternship.component.css']
})
export class UserviewinternshipComponent implements OnInit {
  internships: any[] = []; // List of internships
  appliedInternships: number[] = []; // List of IDs of internships already applied

  constructor(private internshipService: InternshipService, private router: Router) {}

  ngOnInit(): void {
    this.loadInternships(); // Load internships on initialization
  }

  // Load all internships posted by admin
  loadInternships(): void {
    this.internshipService.getAllInternships().subscribe(
      (data) => {
        this.internships = data;
      },
      (error) => {
        console.error('Error loading internships:', error);
      }
    );
  }

  // Check if the internship has been applied for
  isApplied(internshipId: number): boolean {
    return this.appliedInternships.includes(internshipId);
  }

  // Navigate to the Internship Application Form
  applyInternship(internshipId: number): void {
    this.router.navigate(['/internshipform', internshipId]);
  }

  // Navigate back to the User View Internship page
  goBack(): void {
    this.router.navigate(['/userviewinternship']);
  }
}
