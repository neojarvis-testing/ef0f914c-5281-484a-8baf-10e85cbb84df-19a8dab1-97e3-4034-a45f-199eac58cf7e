import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-internshipform',
  templateUrl: './internshipform.component.html',
  styleUrls: ['./internshipform.component.css']
})
export class InternshipformComponent implements OnInit {
  internshipForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.internshipForm = this.fb.group({
      universityName: ['', Validators.required],
      degreeProgram: ['', Validators.required],
      linkedInProfile: [''],
      resumeUpload: ['', Validators.required] // Resume is required
    });
  }

  ngOnInit(): void {}

  // Getter for form controls
  get f() {
    return this.internshipForm.controls;
  }

  // Handle file input change
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.internshipForm.patchValue({ resumeUpload: file });
    }
  }

  // Handle form submission
  onSubmit(): void {
    this.submitted = true;

    if (this.internshipForm.invalid) {
      alert('All fields are required'); // Validation error
      return;
    }

    alert('Successfully Submitted!'); // Success popup
    this.router.navigate(['/admin/userviewinternship']); // Redirect to userviewinternship
  }
}
