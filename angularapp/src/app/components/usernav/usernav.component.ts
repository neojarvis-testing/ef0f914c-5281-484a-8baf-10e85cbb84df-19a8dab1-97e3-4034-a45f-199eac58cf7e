import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Internship } from 'src/app/models/internship.model';
import { AuthService } from 'src/app/services/auth.service';
import { InternshipService } from 'src/app/services/internship.service';



@Component({
  selector: 'app-usernav',
  templateUrl: './usernav.component.html',
  styleUrls: ['./usernav.component.css']
})
export class UsernavComponent implements OnInit {
  userRole: string;
  internship: Internship = {
    InternshipId: 0,
    Title: '',
    CompanyName: '',
    Location: '',
    DurationInMonths: 3,
    Stipend: 10000,
    Description: '',
    SkillsRequired: '',
    ApplicationDeadline: '',
  }

  constructor(private authService: AuthService, private internshipService:InternshipService) { }

  ngOnInit(): void {
    this.authService.getUserRole().subscribe(data => {
      this.userRole = data;
    }); // Assuming AuthService retrieves user role

  }

  addInternship(): void {
    this.internshipService.addInternship(this.internship).subscribe(() => {
      alert('Internship added successfully!');
    });
  }



}
