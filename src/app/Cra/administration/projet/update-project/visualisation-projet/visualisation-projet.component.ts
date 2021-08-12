import { Component, OnInit } from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet} from 'ng2-charts';
import {environment} from '../../../../../../environments/environment';
import {CraHttpDatabase} from '../../../../../configuration-http/CraHttpDatabase';
import {ProjetHttpDatabase} from '../../../../../configuration-http/ProjetHttpDatabase';
import {HttpClient} from '@angular/common/http';
import {Stat} from '../../../../models/projet/Stat';

@Component({
  selector: 'app-visualisation-projet',
  templateUrl: './visualisation-projet.component.html',
  styleUrls: ['./visualisation-projet.component.scss']
})
export class VisualisationProjetComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public doughnutChartColors = [
    {
      backgroundColor: ['rgba(123,206,80,0.8)', 'rgba(255,206,80,0.8)', 'rgba(255,25,80,0.8)', 'rgba(255,250,80,0.8)', 'rgba(255,101,152,0.8)', 'rgba(0,0,50,0.8)','rgba(160,40,100,0.8)', 'rgba(0,255,0,0.8)', 'rgba(0,40,255,0.8)', 'rgba(123,206,80,0.8)', 'rgba(255,206,80,0.8)', 'rgba(255,25,80,0.8)', 'rgba(255,250,80,1)', 'rgba(255,101,152,1)', 'rgba(0,0,50,1)','rgba(160,40,100,1)', 'rgba(0,255,0,1)', 'rgba(0,40,255,1)']
    },
  ];
  public doughnutChartLabels: Label[] = [];
  public doughnutChartData: SingleDataSet = [];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartLegend = true;
  public doughnutChartPlugins = [];
  minWidth = environment.minWidth;

  public get width() {
    return window.innerWidth;
  }
  constructor(private httpClient: HttpClient) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.statsUsers('Lidl');
    this.statsCommandes('gifi projet');
    this.statsDurees();
  }

  ngOnInit() {
  }
  fillChart(stats: Stat[]){
    console.log("je rempli le chart");
    this.doughnutChartLabels = [];
    this.doughnutChartData = [];
    for(const stat of stats){
      this.doughnutChartLabels.push(stat.key);
      this.doughnutChartData.push(+stat.duree);
    }
    console.log(this.doughnutChartLabels);
  }
  public doughnutChartOptions = {
    tooltips: {
      callbacks: {
        // @ts-ignore
        label: (tooltipItems, data) => {
          let s=0;
          for(var i in data.datasets[tooltipItems.datasetIndex].data){
            s= s+ data.datasets[tooltipItems.datasetIndex].data[i];
          }
          let pourcentage = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]/s;
          pourcentage = Math.round((pourcentage) * 10000) / 100;

          return   data.labels[tooltipItems.index] + ': ' +data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] + ' jours -- ' + pourcentage + ' %';
        }
      },
    },
  };
  statsUsers(codeProjet: string){
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.getAllStatsUsers('2000-01-01','2040-01-01',codeProjet);
    response.subscribe(reponse => {
      if (reponse.status == 'OK') {
        console.log("ici : ",reponse);
        if (reponse.stats != null) {
          console.log("stats users : ",reponse.stats);
          this.fillChart(reponse.stats);
        } else {
          console.log("pas de stats");

          //this.getCraToServer(index);
        }
      } else {
        console.log("Erreur de requete de base de données");
      }
    });
  }
  statsCommandes(codeProjet: string){
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.getAllStatsCommandes('2000-01-01','2040-01-01',codeProjet);
    response.subscribe(reponse => {
      if (reponse.status == 'OK') {
        if (reponse.stats != null) {
          console.log("stats commandes: ",reponse.stats);
          this.fillChart(reponse.stats);
        } else {
          console.log("pas de stats");

          //this.getCraToServer(index);
        }
      } else {
        console.log("Erreur de requete de base de données");
      }
    });
  }
  statsDurees(){
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.getAllStatsDurees('2000-01-01','2040-01-01');
    response.subscribe(reponse => {
      console.log(reponse);
      if (reponse.status == 'OK') {
        if (reponse.stats != null) {
          console.log("stats durees: ",reponse.stats);
          this.fillChart(reponse.stats);
        } else {
          console.log("pas de stats");

          //this.getCraToServer(index);
        }
      } else {
        console.log("Erreur de requete de base de données");
      }
    });
  }
  // @ts-ignore
  modify(value) {
    switch (value){
      case 0 :{ this.statsDurees(); break;}
      case 1 :{ this.statsCommandes('projet1'); break;}
      case 2 :{ this.statsUsers('projet1'); break;}

    }

  }
}
