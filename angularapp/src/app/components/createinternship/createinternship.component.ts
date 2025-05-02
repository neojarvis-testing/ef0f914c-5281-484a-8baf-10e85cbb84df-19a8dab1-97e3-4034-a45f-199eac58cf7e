import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import { Internship } from 'src/app/models/internship.model';

@Component({
  selector: 'app-createinternship',
  templateUrl: './createinternship.component.html',
  styleUrls: ['./createinternship.component.css']
})
export class CreateinternshipComponent implements OnInit {
  showSuccess = false;
  formError = '';
  existingCompanies: string[] = []; // Array to store fetched company names

  constructor(private internshipService: InternshipService, private router: Router) {}

  ngOnInit(): void {
    this.internshipService.getAllInternships().subscribe(
      internships => {
        this.existingCompanies = internships
          .filter(internship => internship.CompanyName) // Ensure companyName exists
          .map(internship => internship.CompanyName.trim().toLowerCase()); // Handle data cleanly
      },
      error => {
        console.error('Error fetching internships:', error);
        this.formError = '*Failed to load existing internships';
      }
    );
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const formData = form.value;

      // Check for duplicate company name using fetched data
      const isDuplicate = this.checkDuplicateCompany(formData.companyName);
      if (isDuplicate) {
        this.formError = '*Company with the same name already exists';
        return;
      }

      this.formError = '';
      console.log('Form submitted successfully:', formData);

      // Add internships to the internships list
      this.internshipService.addInternship(formData).subscribe(() => {
        this.router.navigate(['/view-internships']);
      });
      this.showSuccess = true;

      // Reset form
      form.reset();
    } else {
      this.formError = '*All fields are required';
    }
  }

  closeSuccessPopup(): void {
    this.showSuccess = false;
  }

  checkDuplicateCompany(companyName: string): boolean {
    // Check if the company name exists in the fetched list
    return this.existingCompanies.includes(companyName.trim().toLowerCase());
  }
}
