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
    //




    const dl = data.datasets.length;
    const cl = this.chart.data.datasets.length;



    if (dl > cl) {
      data.datasets.forEach((set, dl) => {
        this.chart.data.datasets[dl] = {};
      })
    }



    if (cl > dl) {
      this.chart.data = data;

    } else {

      data.datasets.forEach((set: any, di) => {


        let exset: any = this.chart.data.datasets[di];
        if (exset) {
          exset.data = set.data;
          if (set.label) {
            exset.label = set.label;
          }
          if (set.backgroundColor) {
            exset.backgroundColor = set.backgroundColor;
          }
          if (set.client_slug) {
            exset.client_slug = set.client_slug;
          }
        } else {
          this.chart.data.datasets.push(set);
        }

      });
    }


    console.log(data.datasets);
    console.log(this.chart.data.datasets);



    this.chart.data.labels = data.labels;
    this.chart.update();
  }





}
