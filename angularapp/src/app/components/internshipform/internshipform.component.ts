import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import { InternshipApplication } from 'src/app/models/internshipapplication.model';

@Component({
  selector: 'app-internshipform',
  templateUrl: './internshipform.component.html',
  styleUrls: ['./internshipform.component.css']
})
export class InternshipformComponent implements OnInit {
  internshipForm!: FormGroup;
  submitted: boolean = false;
  resumeFile!: File | null;
  fileError: string = '';

  constructor(private fb: FormBuilder, private router: Router, private internshipService: InternshipService) { }

  ngOnInit(): void {
    this.internshipForm = this.fb.group({
      universityName: ['', Validators.required],
      degreeProgram: ['', Validators.required],
      linkedInProfile: [''],
      resumeUpload: [null, Validators.required] // Ensure file object is properly validated
    });
  }

  get f() {
    return this.internshipForm.controls;
  }
  

  /** Handle file input change for PNG/TXT */
  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      if (!['image/png', 'text/plain'].includes(file.type)) {
        this.fileError = 'Only PNG or TXT files are allowed.';
        this.resumeFile = null;
        this.internshipForm.patchValue({ resumeUpload: null });
        return;
      }

      this.fileError = ''; // Clear previous error
      this.resumeFile = file; // Store the actual file
      this.internshipForm.patchValue({ resumeUpload: file.name }); // Store file name (for UI purposes)
      this.internshipForm.get('resumeUpload')?.updateValueAndValidity();
    }
  }

  /** Handle form submission */
  onSubmit(): void {
    this.submitted = true;

    if (this.internshipForm.invalid || !this.resumeFile) {
      alert('All fields are required.');
      return;
    }

    // Create the JSON object that matches InternshipApplication model
    const applicationData: InternshipApplication = {
      UserId: Number(localStorage.getItem('userId')) || 1, // Ensure valid userId
      IntershipId: 101, // Provide internshipId dynamically if needed
      UniversityName: this.internshipForm.value.universityName,
      DegreeProgram: this.internshipForm.value.degreeProgram,
      Resume: this.resumeFile?.name || '', // Store only file name, not actual file
      LinkedInProfile: this.internshipForm.value.linkedInProfile || 'NA',
      ApplicationStatus: 'Pending',
      ApplicationDate: new Date().toISOString()
    };

    console.log('Submitting Application Data:', applicationData);

    // Use the existing method in InternshipService
    this.internshipService.addInternshipApplication(applicationData).subscribe(
      response => {
        console.log('Response:', response);
        alert('Successfully Submitted!');
        this.router.navigate(['/user/view-internships']);
      },
      error => {
        console.error('Submission Error:', error);
        alert('Failed to submit application.');
      }
    );
  }
}
