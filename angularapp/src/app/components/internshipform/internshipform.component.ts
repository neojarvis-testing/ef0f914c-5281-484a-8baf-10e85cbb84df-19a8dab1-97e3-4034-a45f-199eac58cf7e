
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService } from 'src/app/services/internship.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-internshipform',
  templateUrl: './internshipform.component.html',
  styleUrls: ['./internshipform.component.css']
})
export class InternshipformComponent implements OnInit {
  internshipForm!: FormGroup;
  submitted = false;
  resumeFile!: File | null;
  fileError = '';
  internships: any[] = []; // Store internships from API
  base64File: string;

  constructor(private fb: FormBuilder, private router: Router, private internshipService: InternshipService, private authService: AuthService, private activatedRoute: ActivatedRoute) {}

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
        this.internships = response;
        console.log('Internships Loaded:', this.internships);
      },
      error => {
        console.error('Error fetching internships:', error);
      }
    );
  }

  /** Handle file input change for PDF Upload */
  onFileChange(event: any): void {
    const file = event.target.files[0];
    console.log(file);

    if (file) {
      console.log(file);
      
      // ✅ Allow only PDF files
      if (file.type !== 'application/pdf') {
        // this.handleBase64(file).then(
        //   (basestring) =>{
        //     console.log(basestring);
        //   }
        // )
        
        this.fileError = 'Only PDF files are allowed.';
        this.resumeFile = null;
        this.internshipForm.patchValue({ resumeUpload: null });
        return;
      }
      this.handleBase64(file).then(
        (basestring) =>{
          console.log(basestring);
          this.base64File = basestring
          this.internshipForm.patchValue({ resumeUpload: basestring });

        }
      )

      this.fileError = ''; // Clear errors
      this.resumeFile = file;
      // this.internshipForm.patchValue({ resumeUpload: file.name });

      // ✅ Save file locally inside `/assets/resumes/`
      const userId = this.authService.getUserId();
      const fileName = `resume_${userId}_${Date.now()}.pdf`;
      // localStorage.setItem(`resume_${userId}`, `/assets/resumes/${fileName}`);
      localStorage.setItem(`resume_${userId}`, `${this.base64File}`);
      console.log("Saved Resume Path:", `/assets/resumes/${fileName}`); // Debugging
    }
  }

  handleBase64(file: File): Promise<string>{
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve (reader.result as string);
      reader.onerror =(error) => reject(error);
      reader.readAsDataURL(file);
    })
  }

  /** Handle form submission */
  onSubmit(): void {
    this.submitted = true;

    if (this.internshipForm.invalid || !this.resumeFile) {
      alert('All fields are required.');
      return;
    }

    const internshipId = this.activatedRoute.snapshot.params['internshipId'];
    console.log("Internship ID:", internshipId); // Debugging

    // ✅ Validate userId
    const userId = this.authService.getUserId();
    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }
    console.log("User ID:", userId); // Debugging

    // ✅ Get stored resume path from Local Storage
    // const storedResumePath = localStorage.getItem(`resume_${userId}`);
    const storedResumePath = this.base64File;
    if (!storedResumePath) {
      alert("Resume file is missing.");
      return;
    }
    console.log("Stored Resume Path:", storedResumePath); // Debugging
    // console.log(u);
    

    let applicationData: any = {
      userId: +userId,
      internshipId: internshipId, 
      universityName: this.internshipForm.value.universityName,
      degreeProgram: this.internshipForm.value.degreeProgram,
      resume: storedResumePath, // ✅ Save local resume path
      linkedInProfile: this.internshipForm.value.linkedInProfile || 'NA',
      applicationStatus: 'Pending',
      applicationDate: new Date().toISOString().split('T')[0]
    };

    console.log('Submitting Application Data:', JSON.stringify(applicationData, null, 2));

    this.internshipService.addInternshipApplication(applicationData).subscribe(
      response => {
        console.log('Response:', response);
        alert('Application submitted successfully!');
        localStorage.setItem(`applied_${internshipId}`, 'true'); 
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
