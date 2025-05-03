import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import { InternshipApplication } from 'src/app/models/internshipapplication.model';
import { AuthService } from 'src/app/services/auth.service';

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
  internships: any[] = []; // Store internships from API

  constructor(private fb: FormBuilder, private router: Router, private internshipService: InternshipService, private authService: AuthService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.internshipForm = this.fb.group({
      universityName: ['', Validators.required],
      degreeProgram: ['', Validators.required],
      linkedInProfile: [''],
      resumeUpload: [null, Validators.required] // Ensure file object is properly validated
    });

    this.loadInternships(); // Load internships dynamically
  }

  get f() {
    return this.internshipForm.controls;
  }

  /** Load internships dynamically */
  loadInternships(): void {
    this.internshipService.getAllInternships().subscribe(
      response => {
        this.internships = response; // Store fetched internships
        console.log('Internships Loaded:', this.internships);
      },
      error => {
        console.error('Error fetching internships:', error);
      }
    );
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
  onSubmit(): void {
    this.submitted = true;
  
    if (this.internshipForm.invalid || !this.resumeFile) {
      alert('All fields are required.');
      return;
    }
  
    const internshipId = this.activatedRoute.snapshot.params['internshipId']; // ✅ Get selected internship ID dynamically
  
    let applicationData: any = {
      userId: +this.authService.getUserId(),
      internshipId: internshipId, 
      universityName: this.internshipForm.value.universityName,
      degreeProgram: this.internshipForm.value.degreeProgram,
      resume: this.resumeFile?.name || '',
      linkedInProfile: this.internshipForm.value.linkedInProfile || 'NA',
      applicationStatus: 'Pending',
      applicationDate: new Date().toISOString().split('T')[0]
    };
  
    console.log('Submitting Application Data:', applicationData);
  
    this.internshipService.addInternshipApplication(applicationData).subscribe(
      response => {
        console.log('Response:', response);
        alert('Application submitted successfully!');
  
        // ✅ Store applied internship locally
        localStorage.setItem(`applied_${internshipId}`, 'true'); 
  
        // ✅ Navigate back to internship list AND refresh UI
        this.router.navigate(['/user/view-internships']).then(() => {
          window.location.reload();
        });
      },
      error => {
        console.error('Submission Error:', error);
        alert('Failed to submit application.');
      }
    );
  }
}  

//   /** Handle form submission */
//   onSubmit(): void {
//     this.submitted = true;

//     if (this.internshipForm.invalid || !this.resumeFile) {
//       alert('All fields are required.');
//       return;
//     }

//     const selectedInternship = this.internships[0]; // ✅ Dynamically get the first internship ID (Modify logic if needed)

//     if (!selectedInternship) {
//       alert('No internship selected.');
//       return;
//     }

//     // ✅ Create the JSON object for API submission
//     let applicationData: any = {
//       userId: +this.authService.getUserId(),
//       internshipId: selectedInternship.internshipId, // ✅ Dynamically set internship ID
//       universityName: this.internshipForm.value.universityName,
//       degreeProgram: this.internshipForm.value.degreeProgram,
//       resume: this.resumeFile?.name || '',
//       linkedInProfile: this.internshipForm.value.linkedInProfile || 'NA',
//       applicationStatus: 'Pending',
//       applicationDate: new Date().toISOString()
//     };

//     console.log('Submitting Application Data:', applicationData);

//     this.internshipService.addInternshipApplication(applicationData).subscribe(
//       response => {
//         console.log('Response:', response);
//         alert('Application submitted successfully!');
//         this.router.navigate(['/user/view-internships']);
//       },
//       error => {
//         console.error('Submission Error:', error);
//         alert('Failed to submit application.');
//       }
//     );
//   }
// }

