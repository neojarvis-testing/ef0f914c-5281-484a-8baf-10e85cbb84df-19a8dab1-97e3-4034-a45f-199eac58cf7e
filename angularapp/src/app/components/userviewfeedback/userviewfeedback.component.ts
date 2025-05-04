import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
import { AuthService } from 'src/app/services/auth.service';
import { FeedbackService } from 'src/app/services/feedback.service';
 
@Component({
  selector: 'app-userviewfeedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit {
  feedbackList: Feedback[]=[];
  showDeleteConfirm = false;
  FeedbackByUserId: number;
  constructor(private feedbackService: FeedbackService, private router: Router, private activatedRoute:ActivatedRoute, private authService : AuthService ) { }
 
  ngOnInit(): void {
   this.loadFeedbacks();
   
  }
  loadFeedbacks(): void
  {
  const userid = +this.authService.getUserId();
    this.feedbackService.getAllFeedbacksByUserId(userid).subscribe(data => {
      console.log(data);
     
      this.feedbackList = data;
    });
  }
 
  confirmDelete(feedback: Feedback): void {
    console.log("Selected Feedback:", feedback);
    this.FeedbackByUserId = feedback?.feedbackId; // Notice the lowercase `feedbackId`
    console.log("Stored Feedback ID:", this.FeedbackByUserId);
    this.showDeleteConfirm = true;
  }
 
  deleteFeedback(): void {
    console.log(this.FeedbackByUserId);
   
    this.feedbackService.deleteFeedback(this.FeedbackByUserId).subscribe(() => {
       this.feedbackList = this.feedbackList.filter(f => f.feedbackId !== this.FeedbackByUserId);
      this.showDeleteConfirm = false;
    });
  }
  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }
 
 
 
}