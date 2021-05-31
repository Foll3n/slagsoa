import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { Facture } from '../../Modeles/facture';
import {Categorie} from "../visualisation.component";
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';


/*
 Class temporaire permettant de stocker une categorie et son total.
 */
export class TotalCategorie {
  cat!: Categorie;
  total!: number;

  constructor(c: Categorie, t: number) {
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

  //Attributs qui récupèrent les données du composant père, on y retrouve ainsi:
  // - la date de debut
  // - la date de fin
  // - une liste de facture déjà trié
  // - Une liste des categories
  // - Une liste des categories principales
  @Input() dateD!: string;
  @Input() dateF!: string;
  @Input() factures!: Facture[];
  @Input() categories!: Categorie[];
  @Input() catPrincipal!: Categorie[];

  //--totalCats et totalCats1 sont de forme TotalCategorie, la class temporaire au dessus. Les deux permettent de stocker des categories, avec leurs total.

  //totalCats permet un stockage avec une vision précise avec nom cat et nom sous cat
  totalCats = [];
  //totalCats1 permet un stockage avec une vision GENERAL avec seulment les categories.
  totalCats1 = [];

  //----------------------------------------------------

  /*
    Déclarations des paramètres du diagramme:
    Nom des champs
   */
  public pieChartLabels = [''];
  //Valeur des champs
  public pieChartData = [0];
  //Couleur des champs
  public pieChartColors = [
    {
      backgroundColor: ['rgba(123,206,80,0.8)', 'rgba(255,206,80,0.8)', 'rgba(255,25,80,0.8)', 'rgba(255,250,80,0.8)', 'rgba(255,101,152,0.8)', 'rgba(0,0,50,0.8)','rgba(160,40,100,0.8)', 'rgba(0,255,0,0.8)', 'rgba(0,40,255,0.8)', 'rgba(123,206,80,0.8)', 'rgba(255,206,80,0.8)', 'rgba(255,25,80,0.8)', 'rgba(255,250,80,1)', 'rgba(255,101,152,1)', 'rgba(0,0,50,1)','rgba(160,40,100,1)', 'rgba(0,255,0,1)', 'rgba(0,40,255,1)']
    },
  ];


  public chartOptions = {
    tooltips: {
      callbacks: {
        // @ts-ignore
        label: (tooltipItems, data) => {

          return  data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] + ' € ' ;
        }
      },
    },
  };

  //----------------------------------------------------

  //TTC si true - HT si false
  mode!: boolean;
  modestring = 'Mode Taxes';
  // Mode false (tout avec ss categories) Mode true (sans ss cat)
  modeCat!: boolean;
  modeCatString = 'Mode Vision';
  etatT = '';
  etatC = '';
  message = '';

  //-----------------------------------------------------
  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }


  ngOnChanges() {
    //On commence en VISION GENERAL et en mode TTC
    this.modeCat = true;
    this.mode = true;

    //On vide tous les tableaux de stockage
    this.totalCats = [];
    this.totalCats1 = [];
    this.pieChartData = [];
    this.pieChartLabels = [];

    //Si les factures transmis par le composant père n'est pas vide alors on procède au stockage et au remplissage du diagramme.
    if(this.factures != null){
      this.message = this.factures.length + ' factures';
      this.calculerTotalCategories(this.categories , this.totalCats, this.mode, this.factures);
      this.calculerTotalCategories1(this.catPrincipal , this.totalCats1, this.mode, this.factures);
      this.remplirDiagramme(this.totalCats, this.totalCats1);
    }

    //Si il n'y a aucune facture, on laisse un message d'erreur
    if(this.factures == null){
      this.message = "Aucune donnnées aux date séléctionné";
    }
  }




//-----------------------------------------------------------------------------------------------------------------------------------------

  //On insère une liste de catégories, une liste de stockage (catégorie, total), un mode(true:TTC ou false:HT) et la liste des factures), calcul pour vision précis.
  calculerTotalCategories(listeCat: Categorie[], listeStockage: TotalCategorie[], mode: boolean, factures: Facture[]){

    if(listeCat != null){
      for(var i=0; i<listeCat.length;i++){
        let total = this.calculerTotal(listeCat[i].nom_Categorie, listeCat[i].nom_sous_Categorie, mode,factures);
        let tot = new TotalCategorie(listeCat[i], total);
        listeStockage.push(tot);
      }
    }

  }


  //CalculerTotal parcourt selon une categorie et sous categorie donnée, la liste des factures pour faire la somme à chaque fois du montant ttc ou ht
  //CalculerTotal permet ainsi de parcourir les factures et de retourner le total d'une *SOUS CATEGORIE* passé en paramètre
  calculerTotal(nom: string, sousnom: string , mode: boolean, factures: Facture[]){
    var s=0

    //On parcourt la liste des factures
    for(var i=0; i<factures.length; i++){
      //si la sous categorie est vide mais qu'on est quand même en mode précis.
      if(sousnom == '' || sousnom == null){
        //Si nom categorie et sous categorie existe dans la liste de factures
        if(factures[i].categorie == nom && (factures[i].sousCategorie == null || factures[i].sousCategorie == '')){
          //Alors on l'ajoute à la somme s selon le mode actuel ttc ou ht.
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


  //---------------------------------------------------------------------------------------------------------------------------


  //On insère une liste de catégories, une liste de stockage (catégorie, total), un mode(true:TTC ou false:HT) et la liste des factures)

  calculerTotalCategories1(listeCat: Categorie[], listeStockage: TotalCategorie[], mode: boolean, factures: Facture[]){
    for(var i=0; i<listeCat.length;i++){
      let total = this.calculerTotal1(listeCat[i].nom_Categorie, mode,factures);
      let tot = new TotalCategorie(listeCat[i], total);
      listeStockage.push(tot);
    }
  }


  //CalculerTotal1 permet ainsi de parcourir les factures et de retourner le total d'une *CATEGORIE* passé en paramètre
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


  //remplirDiagramme permet selon le mode(Vision General ou Vision precis) de remplir le diagramme.

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
          this.pieChartLabels.push(nom);
          this.pieChartData.push(listeStockage1[i].total);
        }
      }
    }
  }
//Changer mode est appelé pour changer de TTC à HT ou inversement, dans l'ordre: on change le mode et on reset tout.
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

//Changer modeCat est appelé pour changer de Vision précis à Vision general ou inversement, dans l'ordre: on change le mode et on reset tout.
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
