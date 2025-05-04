import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { InternshipService } from 'src/app/services/internship.service';

@Component({
  selector: 'app-internshippiechart',
  templateUrl: './internshippiechart.component.html',
  styleUrls: ['./internshippiechart.component.css']
})
export class InternshippiechartComponent implements OnInit {
  degreePrograms: { [key: string]: number } = {}; // ✅ Stores degree program counts
  showChart: boolean = true; // ✅ Controls chart visibility

  constructor(private internshipService: InternshipService, private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadDegreeProgramData(); // ✅ Fetch degree program data from API
  }

  /** Fetch internship applications to count degree programs */
  loadDegreeProgramData(): void {
    this.internshipService.getAllInternshipApplications().subscribe(
      applications => {
        this.degreePrograms = applications.reduce((acc: { [key: string]: number }, app) => {
          acc[app.degreeProgram] = (acc[app.degreeProgram] || 0) + 1;
          return acc;
        }, {});
        this.renderPieChart(); // ✅ Render chart after fetching data
      },
      error => {
        console.error('Error fetching applications:', error);
      }
    );
  }

  /** Render Pie Chart */
  renderPieChart(): void {
    if (!this.showChart) return; // ✅ Prevent rendering if chart is hidden

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
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 18, // ✅ Increase font size for degree program names
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

  /** Hide the chart */
  closeChart(): void {
    this.showChart = false;
    this.router.navigate(['/admin/requestedInternship'])
  }
}
