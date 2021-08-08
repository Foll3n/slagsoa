import { Component, OnInit } from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet} from 'ng2-charts';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-visualisation-projet',
  templateUrl: './visualisation-projet.component.html',
  styleUrls: ['./visualisation-projet.component.scss']
})
export class VisualisationProjetComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartData: SingleDataSet = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  minWidth = environment.minWidth;

  public get width() {
    return window.innerWidth;
  }
  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
  }

  // @ts-ignore
  modify(a, b, c) {
    this.pieChartData = [a, b, c];
  }
}
