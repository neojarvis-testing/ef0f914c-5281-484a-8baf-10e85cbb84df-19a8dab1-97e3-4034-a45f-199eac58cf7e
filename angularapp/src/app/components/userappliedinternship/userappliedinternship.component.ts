import { Component, OnInit } from '@angular/core';
import { InternshipService } from 'src/app/services/internship.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-userappliedinternship',
  templateUrl: './userappliedinternship.component.html',
  styleUrls: ['./userappliedinternship.component.css']
})
export class UserappliedinternshipComponent implements OnInit {
  internshipId: number;
  mergedList: any[] = [];



  constructor(private internshipservice: InternshipService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
     this.internshipId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchAppliedInternship();
  }

  fetchAppliedInternship(): void
  {
    this.internshipservice.getAllInternshipApplications().subscribe(applications => {
      const filteredinternships = applications.filter(app=>app.IntershipId === this.internshipId);
      this.internshipservice.getAppliedInternships(this.internshipId).subscribe(internship=>{
        this.mergedList = filteredinternships.map(app=>{
          ApplicationDate
        })
      })
    })
  } 
 


 

  viewResume(url: string) {
    this.selectedResume = url;
    this.showResumePopup = true;
  }

  closeResumePopup() {
    this.showResumePopup = false;
    this.selectedResume = '';
  }

  confirmDelete(id: number) {
    this.deleteId = id;
    this.showDeletePopup = true;
  }

  deleteInternship() {
    if (this.deleteId !== null) {
      this.internshipservice.deleteInternshipApplication(this.deleteId).subscribe(() => {
        this.appliedInternships = this.appliedInternships.filter(internship => internship.id !== this.deleteId);
        this.filteredAppliedInternships = this.filteredAppliedInternships.filter(internship => internship.id !== this.deleteId);
      });
    }
    this.showDeletePopup = false;
    this.deleteId = null;
  }
  
  closeDeletePopup() {
    this.showDeletePopup = false;
    this.deleteId = null;
  }
}
