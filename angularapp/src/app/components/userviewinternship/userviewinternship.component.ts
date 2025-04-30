import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
 
@Component({
  selector: 'app-userviewinternship',
  templateUrl: './userviewinternship.component.html',
  styleUrls: ['./userviewinternship.component.css']
})
export class UserviewinternshipComponent implements OnInit {
  feedbackList: Feedback[] = [
    {
      FeedbackId: 0,
      UserId: 0,
      FeedbackText: '',
      Date: new Date('2024-04-05')
  }
  ];
  showDeleteConfirm = false;
  FeedbackByUserId: number;
  constructor(private feedbackService:FeedbackService, private router: Router,private activatedRoute: ActivatedRoute) { }
 
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((feedbackdata)=>{
      this.FeedbackByUserId = Number(feedbackdata['id']);
      
    });
    this.loadFeedbacks();
  }

  loadFeedbacks(): void
  {
    this.feedbackService.getAllFeedbacksByUserId(this.FeedbackByUserId).subscribe((data)=>{
      this.feedbackList=data;
    });
  }

  confirmDelete(feedbackId: number): void {
    this.FeedbackByUserId = feedbackId;
    this.showDeleteConfirm = true;
  }

  deleteFeedback(): void {
    this.feedbackService.deleteFeedback(this.FeedbackByUserId).subscribe(() => {
      this.feedbackList = this.feedbackList.filter(f => f.FeedbackId !== this.FeedbackByUserId);
      this.showDeleteConfirm = false;
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }
 
}
 
 