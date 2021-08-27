import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet} from 'ng2-charts';
import {environment} from '../../../../../../environments/environment';
import {ProjetHttpDatabase} from '../../../../../configuration-http/ProjetHttpDatabase';
import {HttpClient} from '@angular/common/http';
import {Stat} from '../../../../models/projet/Stat';
import {ProjetService} from '../../../../../services/projet.service';
import {CommandeService} from '../../../../../services/commande.service';

@Component({
  selector: 'app-visualisation-projet',
  templateUrl: './visualisation-projet.component.html',
  styleUrls: ['./visualisation-projet.component.scss']
})
/**
 * chart permettant de visualiser différentes informations sur un projet
 */
export class VisualisationProjetComponent implements OnInit, OnChanges {
  @Input()
  index!: number;
  @Input()
  projet!: string;
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  doughnutChartColors = [
    {
      backgroundColor: ['red'],
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

  constructor(private commandeService: CommandeService, private proejtService: ProjetService, private httpClient: HttpClient) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.statsUsers(this.projet);
    this.statsCommandes(this.projet);
    this.statsDurees();
  }

  ngOnInit() {
  }

  /**
   * rempli le graphique
   * @param stats
   */
  fillChart(stats: Stat[], isGlobal = false) {
    this.doughnutChartLabels = [];
    this.doughnutChartData = [];
    let colors = [];
    for (const stat of stats) {

      if (isGlobal) {
        const color = this.proejtService.getColorProject(stat.key)!;
        colors.push(color);
      }

      this.doughnutChartLabels.push(stat.key);
      this.doughnutChartData.push(+stat.duree);
    }
    if (!isGlobal) {
      colors = ['rgba(123,206,80,0.8)', 'rgba(255,206,80,0.8)', 'rgba(255,25,80,0.8)', 'rgba(255,250,80,0.8)', 'rgba(255,101,152,0.8)', 'rgba(0,0,50,0.8)', 'rgba(160,40,100,0.8)', 'rgba(0,255,0,0.8)', 'rgba(0,40,255,0.8)', 'rgba(123,206,80,0.8)', 'rgba(255,206,80,0.8)', 'rgba(255,25,80,0.8)', 'rgba(255,250,80,1)', 'rgba(255,101,152,1)', 'rgba(0,0,50,1)', 'rgba(160,40,100,1)', 'rgba(0,255,0,1)', 'rgba(0,40,255,1)'];
    }
    this.doughnutChartColors.fill({backgroundColor: colors});

  }

  public doughnutChartOptions = {
    tooltips: {
      callbacks: {
        // @ts-ignore
        label: (tooltipItems, data) => {
          let s = 0;
          for (var i in data.datasets[tooltipItems.datasetIndex].data) {
            s = s + data.datasets[tooltipItems.datasetIndex].data[i];
          }
          let pourcentage = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] / s;
          pourcentage = Math.round((pourcentage) * 10000) / 100;

          return data.labels[tooltipItems.index] + ': ' + data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] + ' jours -- ' + pourcentage + ' %';
        }
      },
    },
  };

  /**
   * statistiques sur les utilsiateurs qui réalisent un projet donné
   */
  statsUsers(codeProjet: string) {
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.getAllStatsUsers('2000-01-01', '2040-01-01', codeProjet);
    response.subscribe(reponse => {
      if (reponse.status == 'OK') {
        if (reponse.stats != null) {
          this.fillChart(reponse.stats);
        } else {
          console.log('pas de stats');
        }
      } else {
        console.log('Erreur de requete de base de données');
      }
    });
  }

  /**
   * statistiques sur les commandes associées à un projet
   */
  statsCommandes(codeProjet: string) {
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.getAllStatsCommandes('2000-01-01', '2040-01-01', codeProjet);
    response.subscribe(reponse => {
      if (reponse.status == 'OK') {
        if (reponse.stats != null) {
          this.fillChart(reponse.stats);
        } else {
          console.log('pas de stats');
        }
      } else {
        console.log('Erreur de requete de base de données');
      }
    });
  }

  /**
   * statistiques sur le projet qui a pris le plus de temps à l'entreprise
   */
  statsDurees() {
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.getAllStatsDurees('2000-01-01', '2040-01-01');
    response.subscribe(reponse => {
      if (reponse.status == 'OK') {
        if (reponse.stats != null) {
          this.fillChart(reponse.stats, true);
        } else {
          console.log('pas de stats');
        }
      } else {
        console.log('Erreur de requete de base de données');
      }
    });
  }

  // @ts-ignore
  modify() {
    switch (this.index) {
      case 0 : {
        this.statsDurees();
        break;
      }
      case 1 : {
        this.statsCommandes(this.projet);
        break;
      }
      case 2 : {
        this.statsUsers(this.projet);
        break;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.modify();
  }
}
