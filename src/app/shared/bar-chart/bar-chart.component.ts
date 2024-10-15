import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as Chart from 'chart.js';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  @Input() chart_data_sub: BehaviorSubject<ChartData>;
  @Input() chart_data: ChartData;
  @Input() chart_config: ChartConfiguration;

  @ViewChild('chartContainer', { static: true }) public chartContainer: ElementRef;
  public chart: Chart;

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    if (this.chart_data_sub) {
      this.chart_data_sub.subscribe({
        next: (data) => {
          this.updateData(data);
        }
      });
    };

    this.initChart();
  }



  initChart(): void {
    const canvas = this.chartContainer.nativeElement;
    this.chart = new Chart(canvas, this.chart_config);
    this.chart.options.onClick = (e, i) => {
      if (i.length > 0) {
        const activePoint: any = this.chart.getElementAtEvent(e)[0];
        if (activePoint) {
          const datasetIndex = activePoint._datasetIndex;
          const set: any = this.chart.data.datasets[datasetIndex];
          if (set) {
            if (set.client_slug) {
              this.router.navigate(['/clients', set.client_slug, 'stats']);
            }
          }
        }
      }
    }
  }


  updateData(data: ChartData): void {
    console.log(data);



    const dl = data.datasets.length;


    console.log(data);

    setTimeout(() => {
      // this.chart.data.datasets = data.datasets;
      data.datasets.forEach((set, di) => {
        this.chart.data.datasets[di].data = set.data;
        this.chart.data.datasets[di].label = set.label;
      });
      this.chart.data.labels = data.labels;
      this.chart.update();
    }, 200);
  }





}
