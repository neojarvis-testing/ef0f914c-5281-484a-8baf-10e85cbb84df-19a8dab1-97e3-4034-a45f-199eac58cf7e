import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-internshippiechart',
  templateUrl: './internshippiechart.component.html',
  styleUrls: ['./internshippiechart.component.css']
})
export class InternshippiechartComponent implements OnInit {

  constructor() {
    // Register Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.renderPieChart(); // Render the pie chart during initialization
  }

  // Render Pie Chart
  renderPieChart(): void {
    const ctx = document.getElementById('degreeProgramChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Computer Science', 'Business Administration', 'Engineering', 'Arts', 'Others'], // Degree programs
        datasets: [{
          data: [40, 30, 20, 5, 5], // Example data (percentages)
          backgroundColor: [
            '#007bff', // Blue
            '#28a745', // Green
            '#ffc107', // Yellow
            '#dc3545', // Red
            '#6c757d'  // Gray
          ],
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Disable aspect ratio to control sizing
        plugins: {
          legend: {
            position: 'top', // Position of the legend
          },
          tooltip: {
            enabled: true // Display tooltips on hover
          }
        }
      }
    });
  }
}
