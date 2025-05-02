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
      InternshipId : 0, 
      Title: "",
      CompanyName: "",
      Location: "",
      DurationInMonths: 0,
      Stipend: 0,
      Description: "",
      SkillsRequired: "",
      ApplicationDeadline: ""
    };
 
  constructor(private internshipService: InternshipService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((p)=> {
      this.internshipId = Number(p['id']);
      if(this.internshipId){
        this.internshipService.getInternshipById(this.internshipId).subscribe((data)=>{
          this.internship = data;
        });
      }
    })
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.internshipService.updateInternship(this.internshipId, this.internship).subscribe(()=>{
        this.router.navigate(['/viewInternships']);
      })
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

  goBack() {
    this.router.navigate(['/viewInternships']);
  }

}
