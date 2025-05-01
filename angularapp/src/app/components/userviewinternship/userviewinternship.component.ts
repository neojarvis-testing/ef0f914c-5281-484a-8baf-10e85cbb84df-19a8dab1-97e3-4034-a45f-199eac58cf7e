
import { Component, OnInit } from '@angular/core';

import { InternshipService } from 'src/app/services/internship.service';

import { Internship } from 'src/app/models/internship.model';

import { Router } from '@angular/router';
 
@Component({

  selector: 'app-userviewinternship',

  templateUrl: './userviewinternship.component.html',

  styleUrls: ['./userviewinternship.component.css']

})

export class UserviewinternshipComponent implements OnInit {

  internships: Internship[] = []; // List of internships

  appliedInternships: number[] = []; // List of IDs for applied internships
 
  constructor(private internshipService: InternshipService, private router: Router) {}
 
  ngOnInit(): void {

    this.loadInternships(); // Load internships on initialization

    this.loadAppliedInternships(); // Mock or real data for applied internships

  }
 
  // Load internships from the service

  loadInternships(): void {

    this.internshipService.getAllInternships().subscribe(

      (data) => {

        this.internships = data;

      },

      (error) => {

        console.error('Error fetching internships:', error);

      }

    );

  }
 
  // Mock: Load applied internships (replace with API call if needed)

  loadAppliedInternships(): void {

    this.appliedInternships = [1, 3]; // Example applied internship IDs (mock data)

  }
 
  // Check if the user has applied for the internship

  hasApplied(internshipId: number): boolean {

    return this.appliedInternships.includes(internshipId);

  }
 
  // Navigate to the internship application form

  applyForInternship(internshipId: number): void {

    this.router.navigate(['/internshipform', internshipId]);

  }

}
