import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Internship } from 'src/app/models/internship.model';
import { InternshipService } from 'src/app/services/internship.service';

@Component({
  selector: 'app-admineditinternship',
  templateUrl: './admineditinternship.component.html',
  styleUrls: ['./admineditinternship.component.css']
})
export class AdmineditinternshipComponent implements OnInit {
  internshipId: number;
  showSuccess = false;
  formError = '';

  internship: Internship = 
    { 
      internshipId : 0, 
      title: "",
      companyName: "",
      location: "",
      durationInMonths: 0,
      stipend: 0,
      description: "",
      skillsRequired: "",
      applicationDeadline: ""
    };


  constructor(private internshipService: InternshipService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((p) => {
      this.internshipId = Number(p['internshipId']);
      console.log('Internship ID:', this.internshipId); // ✅ Debugging log

      if (this.internshipId) {
        this.internshipService.getInternshipById(this.internshipId).subscribe(
          (data) => {
            if (data) {
              console.log('Fetched internship data:', data); // ✅ Debugging log
              this.internship = data;
            } else {
              console.warn('Received empty internship data');
            }
          },
          (error) => {
            console.error('Error fetching internship:', error);
          }
        );
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.internshipService.updateInternship(this.internshipId, this.internship).subscribe(() => {
        this.showSuccess = true;
        form.reset(); // ✅ Reset after successful update
        this.router.navigate(['/admin/viewinternship']);
      });
    } else {
      this.formError = '*All fields are required';
    }
  }

  closeSuccessPopup(): void {
    this.showSuccess = false;
  }

  goBack() {
    this.router.navigate(['/admin/viewinternship']);
  }
}

