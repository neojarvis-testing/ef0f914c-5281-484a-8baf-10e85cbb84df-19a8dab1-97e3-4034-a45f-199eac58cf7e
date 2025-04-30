import { Component, OnInit } from '@angular/core';

import { InternshipService } from 'src/app/services/internship.service';

import { ActivatedRoute } from '@angular/router';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({

  selector: 'app-userappliedinternship',

  templateUrl: './userappliedinternship.component.html',

  styleUrls: ['./userappliedinternship.component.css']

})

export class UserappliedinternshipComponent implements OnInit {

  userId!: number;

  appliedInternships: any[] = [];

  filteredAppliedInternships: any[] = [];

  searchQuery = '';

  showResumePopup = false;

  sanitizedResumeUrl: SafeResourceUrl | null = null;

  showDeletePopup = false;

  deleteId: number | null = null;

  constructor(

    private internshipService: InternshipService,

    private route: ActivatedRoute,

    private sanitizer: DomSanitizer

  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {

      this.userId = +params['id'];

      if (this.userId) this.loadAppliedInternships();

    });

  }

  loadAppliedInternships(): void {

    this.internshipService.getAppliedInternships(this.userId).subscribe(applications => {

      const mergedData: any[] = [];

      let loaded = 0;

      applications.forEach(app => {

        this.internshipService.getInternshipById(app.IntershipId).subscribe(internship => {

          mergedData.push({

            companyName: internship.CompanyName,

            resumeUrl: app.Resume,

            applicationDate: app.ApplicationDate,

            applicationStatus: app.ApplicationStatus,

            id: app.InternshipApplicationId

          });

          loaded++;

          if (loaded === applications.length) {

            this.appliedInternships = mergedData;

            this.filteredAppliedInternships = [...mergedData];

          }

        });

      });

    });

  }

  filterInternships(): void {

    const query = this.searchQuery.trim().toLowerCase();

    this.filteredAppliedInternships = this.appliedInternships.filter(i =>

      i.companyName.toLowerCase().includes(query)

    );

  }

  viewResume(url: string): void {

    this.sanitizedResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    this.showResumePopup = true;

  }

  closeResumePopup(): void {

    this.showResumePopup = false;

    this.sanitizedResumeUrl = null;

  }

  confirmDelete(id: number): void {

    this.deleteId = id;

    this.showDeletePopup = true;

  }

  deleteInternship(): void {

    if (this.deleteId !== null) {

      this.internshipService.deleteInternshipApplication(this.deleteId).subscribe(() => {

        this.appliedInternships = this.appliedInternships.filter(i => i.id !== this.deleteId);

        this.filteredAppliedInternships = this.filteredAppliedInternships.filter(i => i.id !== this.deleteId);

        this.closeDeletePopup();

      });

    }

  }

  closeDeletePopup(): void {

    this.showDeletePopup = false;

    this.deleteId = null;

  }

}