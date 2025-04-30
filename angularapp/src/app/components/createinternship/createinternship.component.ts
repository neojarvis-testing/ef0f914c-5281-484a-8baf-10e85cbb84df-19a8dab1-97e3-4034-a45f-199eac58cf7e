import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';

@Component({
  selector: 'app-createinternship',
  templateUrl: './createinternship.component.html',
  styleUrls: ['./createinternship.component.css']
})

export class CreateinternshipComponent {
  showSuccess = false;
  formError = '';

  constructor(private internshipService: InternshipService, private router: Router) { }

  ngOnInit() : void {
    
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const formData = form.value;

      // Optional: Check for duplicate company name
      const isDuplicate = this.checkDuplicateCompany(formData.companyName);
      if (isDuplicate) {
        this.formError = '*Company with the same name already exists';
        return;
      }

      this.formError = '';
      console.log('Form submitted successfully:', formData);

      // adding internships to internships list
      this.internshipService.addInternship(formData).subscribe(()=> {
        this.router.navigate(['/viewInternships']);
      });
      this.showSuccess = true;

      // Optional: Reset form
      form.reset();
    } else {
      this.formError = '*All fields are required';
    }
  }

  closeSuccessPopup() {
    this.showSuccess = false;
  }

  checkDuplicateCompany(companyName: string): boolean {
    const existingCompanies = ['Google', 'Microsoft', 'Apple']; // Replace with real data or API check
    return existingCompanies.includes(companyName.trim());
  }
}