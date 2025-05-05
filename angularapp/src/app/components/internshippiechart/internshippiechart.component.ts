import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import Swal from 'sweetalert2';
import { InternshipService } from 'src/app/services/internship.service';

@Component({
  selector: 'app-internshippiechart',
  templateUrl: './internshippiechart.component.html',
  styleUrls: ['./internshippiechart.component.css']
})
export class InternshippiechartComponent implements OnInit {
  degreePrograms: { [key: string]: number } = {};
  showChart: boolean = true;

  constructor(private internshipService: InternshipService, private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadDegreeProgramData();
  }

  loadDegreeProgramData(): void {
    this.internshipService.getAllInternshipApplications().subscribe(
      applications => {
        this.degreePrograms = applications.reduce((acc: { [key: string]: number }, app) => {
          acc[app.degreeProgram] = (acc[app.degreeProgram] || 0) + 1;
          return acc;
        }, {});
        setTimeout(() => this.renderPieChart(), 300); // Delay to ensure DOM is ready
      },
      error => {
        console.error('Error fetching applications:', error);
      }
    );
  }

  renderPieChart(): void {
    if (!this.showChart) return;
    const ctx = document.getElementById('degreeProgramChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(this.degreePrograms),
        datasets: [{
          data: Object.values(this.degreePrograms),
          backgroundColor: [
            '#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d',
            '#17a2b8', '#ff5733', '#9b59b6'
          ],
          hoverOffset: 10,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateScale: true,
          animateRotate: true
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 18,
                weight: 'bold'
              }
            }
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  }

  closeChart(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to close the chart and return to the internship requests?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, go back!',
      backdrop: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.showChart = false;
        this.router.navigate(['/admin/requestedInternship']);
      }
    });
  }
}
