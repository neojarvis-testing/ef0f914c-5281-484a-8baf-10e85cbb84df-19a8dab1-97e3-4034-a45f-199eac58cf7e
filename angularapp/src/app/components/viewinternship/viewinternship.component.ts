import { Component, OnInit } from '@angular/core';
 
import { InternshipService } from 'src/app/services/internship.service';
 
import { Internship } from 'src/app/models/internship.model';
 
import { Router } from '@angular/router'; // Import Router for navigation
 
@Component({
 
  selector: 'app-viewinternship',
 
  templateUrl: './viewinternship.component.html',
 
  styleUrls: ['./viewinternship.component.css']
 
})
 
export class ViewinternshipComponent implements OnInit {
 
  internships: Internship[] = []; // List of all internships
 
  filteredInternships: Internship[] = []; // List of internships filtered by search
 
  searchTerm: string = ''; // Search term for CompanyName
  showNoRecordsMessage: boolean = false; // Added for delay handling

 
  // locationSearch: string = ''; // Search term for Location
 
  constructor(private internshipservice:InternshipService, private router: Router) {}
 
  ngOnInit(): void {
 
    this.loadInternships(); // Load internships on component initialization
 
  }
 
  // Load all internships from the service
 
  loadInternships(): void {
    this.internshipservice.getAllInternships().subscribe(
      (data) => {
        this.internships = data;
        this.filteredInternships = data; // Initialize the filtered list
  
        // Introduce a delay before showing the message
        setTimeout(() => {
          this.showNoRecordsMessage = this.filteredInternships.length === 0;
        }, 4000); // 4-second delay
      },
      (error) => {
        console.error('Error fetching internships:', error);
      }
    );
  }
  
 
  // Search internships based on CompanyName and Location
 
  searchInternships(): void {
 
    this.filteredInternships = this.internships.filter(internship =>
 
      internship.companyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      internship.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      internship.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
 
  }
 
  // Navigate to the edit internship page
 
  editInternship(internshipId: number): void {
 
    console.log('Editing internship with ID:', internshipId);
    this.router.navigate([`/admin/admineditinternship/${internshipId}`]);
  }
 
  // Delete an internship
 
  deleteInternship(internshipId: number): void {
 
    const confirmDelete = confirm('Are you sure you want to delete this internship?');
 
    if (confirmDelete) {
 
      this.internshipservice.deleteInternship(internshipId).subscribe(
 
        () => {
 
          alert('Internship deleted successfully'); // Show success alert
 
          this.loadInternships(); // Reload the internships to refresh the table
 
        },
 
        (error) => {
 
          if (error.status === 400) {
 
            alert('Internship cannot be deleted, it is referenced in internshipapplication'); // Show error alert
 
          } else {
 
            alert('Error deleting internship'); // General error alert
 
          }
 
        }
 
      );
 
    }
 
  }
 
}