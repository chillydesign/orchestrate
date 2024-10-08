import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() chart_data: ChartData;
  @Input() chart_config: ChartConfiguration;
  @ViewChild('chartContainer', { static: true }) public chartContainer: ElementRef;
  public chart: Chart;

  ngOnInit(): void {

  }


  ngOnChanges(): void {
    if (this.chart_data) {
      this.addData();
    }
  }

  addData(): void {

    if (!this.chart) {
      const canvas = this.chartContainer.nativeElement;
      this.chart = new Chart(canvas, this.chart_config);
    }

    setTimeout(() => {
      this.chart_data.datasets.forEach((set, i) => {
        this.chart.data.datasets[i].data = set.data;
      })
      this.chart.data.labels = this.chart_data.labels;
      this.chart.update();
    }, 200);
  }





}
