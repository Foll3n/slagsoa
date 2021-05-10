import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { Facture } from '../../facture/facture';
import {CategorieComponent} from "../../categorie/categorie.component";
import {Categorie} from "../visualisation.component";
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

export class TotalCategorie {
  cat!: Categorie;
  total!: number;

  constructor(c: Categorie, t: number) {
    this.cat = c;
    this.total = t;
  }

}export class TotalCategorieMois {
  cat!: Categorie;
  total!: number;
  mois!: string;

  constructor(c: Categorie, t: number, mois: string) {
    this.cat = c;
    this.total = t;
  }
}

@Component({
  selector: 'app-graph-ligne',
  templateUrl: './graph-ligne.component.html',
  styleUrls: ['./graph-ligne.component.scss']
})
export class GraphLigneComponent implements OnChanges{

  @Input() dateD!: string;
  @Input() dateF!: string;
  @Input() factures!: Facture[];
  @Input() categories!: Categorie[];
  @Input() catPrincipal!: Categorie[];

  totalCats = [];
  totalCats1 = [];

  public pieChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
  public pieChartData = [120, 150, 180, 90];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(123,206,80,0.4)', 'rgba(255,206,80,0.8)', 'rgba(255,25,80,0.8)', 'rgba(255,250,80,0.8)', 'rgba(255,101,152,0.8)', 'rgba(0,0,50,0.8)','rgba(160,40,100,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,40,255,0.3)', 'rgba(50,65,255,0.3)', 'rgba(30,42,185,0.3)', 'rgba(46,38,120,0.3)', 'rgba(0,48,116,0.3)', 'rgba(89,32,255,0.3)'],
    },
  ];
  //TTC si true - HT si false
  mode!: boolean;
  modestring = 'Mode Taxes';
  // Mode false (tout avec ss categories) Mode true (sans ss cat)
  modeCat!: boolean;
  modeCatString = 'Mode Vision';
  etatT = '';
  etatC = '';
  message = '';

  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }


  ngOnChanges() {
    this.totalCats = [];
    this.totalCats1 = [];
    this.pieChartData = [];
    this.pieChartLabels = [];
    if(this.factures != null){
      this.message = this.factures.length + ' factures';
      this.calculerTotalCategories(this.categories , this.totalCats, this.mode, this.factures);
      this.calculerTotalCategories1(this.catPrincipal , this.totalCats1, this.mode, this.factures);
      this.remplirDiagramme(this.totalCats, this.totalCats1);
    }
    if(this.factures == null){
      this.message = "Aucune donnnées aux date séléctionné";
    }
  }



//-----------------------------------------------------------------------------------------------------------------------------------------

  //MODE 1 TTC - 0 HT
  calculerTotal(nom: string, sousnom: string , mode: boolean, factures: Facture[]){
    var s=0

    for(var i=0; i<factures.length; i++){
      if(sousnom == ''){
        if(factures[i].categorie == nom && factures[i].sousCategorie == null){
          if(mode){
            this.modestring = "Mode: TTC";
            this.etatT = "Mode: TTC";
            s=s+Number(factures[i].montantTTC);
          }
          else{
            this.modestring = "Mode: HT";
            this.etatT = "Mode: HT";
            s=s+Number(factures[i].montantHT);
          }
        }
      }
      else{
        if(factures[i].categorie == nom && factures[i].sousCategorie == sousnom){

          if(mode){
            this.modestring = "Mode: TTC";
            this.etatT = "Mode: TTC";
            s=s+Number(factures[i].montantTTC);
          }
          else{
            this.modestring = "Mode: HT";
            this.etatT = "Mode: HT";
            s=s+Number(factures[i].montantHT);
          }
        }
      }
    }

    return Math.round((s) * 100) / 100;
  }

  //On insère une liste de catégories, une liste de stockage (catégorie, total), un mode et la liste des factures)
  calculerTotalCategories(listeCat: Categorie[], listeStockage: TotalCategorie[], mode: boolean, factures: Facture[]){

    if(listeCat != null){
      for(var i=0; i<listeCat.length;i++){
        let total = this.calculerTotal(listeCat[i].nom_Categorie, listeCat[i].nom_sous_Categorie, mode,factures);
        let tot = new TotalCategorie(listeCat[i], total);
        listeStockage.push(tot);
      }
    }

  }


  //---------------------------------------------------------------------------------------------------------------------------

  calculerTotalCategories1(listeCat: Categorie[], listeStockage: TotalCategorie[], mode: boolean, factures: Facture[]){
    for(var i=0; i<listeCat.length;i++){
      let total = this.calculerTotal1(listeCat[i].nom_Categorie, mode,factures);
      let tot = new TotalCategorie(listeCat[i], total);
      listeStockage.push(tot);
    }
  }


  //MODE 1 TTC - 0 HT
  calculerTotal1(nom: string , mode: boolean, factures: Facture[]){
    var s=0
    for(var i=0; i<factures.length; i++){
        if(factures[i].categorie == nom){
          if(mode){
            this.etatT = "Mode: TTC";
            this.modestring = "Mode: TTC";
            s=s+Number(factures[i].montantTTC);
          }
          else{
            this.etatT = "Mode: HT";
            this.modestring = "Mode: HT";
            s=s+Number(factures[i].montantHT);
          }
        }
    }

    return Math.round((s) * 100) / 100;
  }




  //--------------------------------------------------------------------------------------------------------------------------

  remplirDiagramme(listeStockage: TotalCategorie[], listeStockage1: TotalCategorie[]) {
    // Si modeCat == false, ça veut dire qu'on veut que les sous catégories
    if(!this.modeCat){
      this.etatC = 'Précis - affichage des sous catégories'
      this.modeCatString = "Vision: Précis";
      for(var i=0; i< listeStockage.length; i++){
        if(listeStockage[i].total > 0){
          if(listeStockage[i].cat.nom_sous_Categorie == null){
            listeStockage[i].cat.nom_sous_Categorie = "";
          }
          let nom = listeStockage[i].cat.nom_Categorie + ' ' + listeStockage[i].cat.nom_sous_Categorie;
          this.pieChartLabels.push(nom);
          this.pieChartData.push(listeStockage[i].total);
        }
      }
    }
    // Si modeCat == true, ça veut dire qu'on veut que les catégories principales
    if(this.modeCat){
      this.modeCatString = "Vision: General";
      this.etatC = 'General - sans sous catégories';
      for(var i=0; i< listeStockage1.length; i++){
        if(listeStockage1[i].total > 0){
          let nom = listeStockage1[i].cat.nom_Categorie;
          console.log(nom);
          this.pieChartLabels.push(nom);
          this.pieChartData.push(listeStockage1[i].total);
        }
      }
    }
  }

  changerMode() {
    this.mode = !this.mode;
    this.totalCats = [];
    this.totalCats1 = [];
    this.pieChartData = [];
    this.pieChartLabels = [];
    this.calculerTotalCategories(this.categories , this.totalCats, this.mode, this.factures);
    this.calculerTotalCategories1(this.catPrincipal , this.totalCats1, this.mode, this.factures);
    this.remplirDiagramme(this.totalCats, this.totalCats1);

  }
  changerModeCat() {
    this.modeCat = !this.modeCat;
    this.totalCats = [];
    this.totalCats1 = [];
    this.pieChartData = [];
    this.pieChartLabels = [];
    this.calculerTotalCategories(this.categories , this.totalCats, this.mode, this.factures);
    this.calculerTotalCategories1(this.catPrincipal , this.totalCats1, this.mode, this.factures);
    this.remplirDiagramme(this.totalCats, this.totalCats1);

  }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------
