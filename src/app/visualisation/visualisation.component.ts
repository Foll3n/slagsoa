import {Component, Input, OnInit} from '@angular/core';
import {HttpClientModule, HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Facture} from '../Modeles/facture';
import { ConnexionComponent } from "../connexion/connexion.component";
import { Categories1 } from "../Modeles/categorie";


export class ReponseGetFacture {
  liste!: Facture[];
  reponse!: string;
}
export class Resultat {
  reponse!: string;
  cat!: Categorie[];

}

export class Categorie {
  nom_Categorie!: string;
  nom_sous_Categorie!: string;
  id_Categorie!: string;

  constructor(nc: string, nomsc: string, id: string) {
    this.id_Categorie = id;
    this.nom_Categorie = nc;
    this.nom_sous_Categorie = nomsc;
  }
}




@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.scss']
})
export class VisualisationComponent implements OnInit {

  //-------------------------------Attributs-------------------------------------------


  //factures permettant de stocker les factures selon la date
  factures!: Facture[];
  facturesFiltre!: Facture[];
  //rf permettant de stocker la reponse du get factures
  rf = new ReponseGetFacture();

  //active permettant la gestion du menu graph - liste
  active = 1;

  //Contient l'ensemble des categories
  categories!: Categorie[];

  //Permet d'ajouter ou enlever des select options dans l'ihm
  selectedCategories!: Categorie[];
  //Cat principal permet de stocker les cat qui n'ont pas de sous cat
  catPrincipal!: Categorie[];
  //sousCat c'est la liste des sous cat qui s'adapte aux cat Principal sous forme de dropdown
  sousCat!: Categorie[];

  tableauCategories!: Categories1[];
  //objet Resultat permettant de stocker la réponse
  resultat!: Resultat;

  //map permet de stocker (Index de l'objet ihm, l'id de la catégorie)
  //map = new Map();
  //map: Array<string> =  [];
  map: Array<Categorie> = [];

  /*
  dateD = '2021-04-29';
  dateF = '2022-03-29';
  dateDebut = "29/04/2021";
  dateFin = "29/03/2022";
   */

  dateD = '2021-04-29';
  dateF = '2022-03-29';
  dateDebut = "29/04/2021";
  dateFin = "29/03/2022";

  httpOptions = {
    headers: new HttpHeaders()
  };
  urlCategories = "http://localhost:5555/rest/ws.categorie";
  //urlCategories= "http://localhost:3000/categories";

  erreurMessage = '';


  //---------------------------------------------------------------------------------------------

  //--------------------------------Construcor---------------------------------------
  //On déclare httpClient pour les requetes api et c pour recuperer les methodes concernant l'authentification

  constructor(
    private httpClient: HttpClient,
    public c: ConnexionComponent) {
  }

  //----------------------------------OnInit()------------------------------------------
  //ngOnInit permet d'initialiser le Header, grâce à test login de voir si on est login si non redirige vers connexion
  //Permet d'initialiser toutes les Listes à vide.
  //De push un element dans map, notre reference concernant le nombre de dropdown sur le site
  //Permet ainsi d'appeler charger Facture qui est la méthode qui récupère les factures et de même pour get categories.


  ngOnInit(): void {
    if(sessionStorage.getItem('dateD') != null && sessionStorage.getItem('dateF')!=null){
      let s1 = sessionStorage.getItem('dateD');
      let s2 = sessionStorage.getItem('dateF');
      if(s1 != null && s2!= null){
        this.dateD = s1;
        this.dateF = s2;
      }
    }
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':'+sessionStorage.getItem('mdp'))})
    this.c.testLogin();
    this.catPrincipal = [];
    this.sousCat = [];
    this.facturesFiltre = [];
    this.map.push(new Categorie('', '', ''));
    this.chargerFacture(this.dateD, this.dateF);
    this.selectedCategories = [];
    this.getCategories();
    this.selectedCategories.push(new Categorie('','',''));

  }

  //----------------------------------------Méthodes chargement----------------------------------------------------


  getCategories() {

    this.httpClient.get<any>(this.urlCategories).subscribe(
      reponse => {
        this.resultat = reponse;
        this.categories = this.resultat.cat;
        if(this.categories != null){
          for(var i=0; i<this.categories.length; i++){

            if(this.categories[i].nom_sous_Categorie == null && this.categories[i].nom_Categorie != ''){
              this.catPrincipal.push(this.categories[i]);

            }
          }
          this.tableauCategories= [];
          this.chargerTableauCategories();
        }
      },
      error => {
        this.erreurMessage = "Le serveur ne répond pas";
      }
    );
  }

  private chargerFacture(dateDebut: string, dateFin: string) {
    let params = new HttpParams().set("dateMin", this.dateD).set("dateMax", this.dateF);

    //'http://localhost:5555/rest/ws.getFacture?dateMin='
    // @ts-ignore
    this.httpClient.get('http://localhost:5555/rest/ws.facture?dateMin=' + dateDebut + '&dateMax=' + dateFin, this.httpOptions).subscribe(
      reponse => {
        // @ts-ignore
        this.rf = reponse;
        this.factures = this.rf.liste;
        this.facturesFiltre = this.factures;
        this.refactoriser();
      },
      error => {
        this.erreurMessage = "le serveur ne répond pas !";
      }

    )
  }

  private chargerTableauCategories() {
    for(let i=0; i<this.catPrincipal.length; i++){
      let c = new Categories1();
      c.nom = this.catPrincipal[i].nom_Categorie;
      c.nomSousCategorie = [];
      for(var j=0; j<this.categories.length;j++){
        if(this.categories[j].nom_Categorie == c.nom && this.categories[j].nom_sous_Categorie != null){
          c.nomSousCategorie.push(this.categories[j].nom_sous_Categorie);
        }
      }

      this.tableauCategories.push(c);
    }

  }

// La méthode refactoriser permet de réecrire les données dans la liste de facture, permettant ainsi d'ajouter ou modifier les formats.

  refactoriser() {
    for (var i = 0; i < this.factures.length; i++) {
      let s = this.factures[i].dateFacture.split('-');
      this.factures[i].dateFacture = s[2] + '/' + s[1] + '/' + s[0];
    }

  }
//-----------------------------------------------FIN Méthodes chargement------------------------------------------------------------------------




//-----------------------------------------------Debut des méthodes de filtrage-----------------------------------------------------------------


  //La methode exists permet de recuperer une valeur et vérifier si elle n'existe pas déjà
  // dans les catégories séléctionné. Cela evite les erreurs de doublons.

  exists(value:string): boolean{
    for(var i=0; i<this.selectedCategories.length; i++){
      let s = value.split('  ');
      if(this.selectedCategories[i].id_Categorie == s[2]){
        return true;
      }
    }
    return false;
  }

  //La methode onOptionsSelected permet de vider les différentes liste, et tout relancer à nouveau
  onOptionsSelected(value: string, i: number) {
    this.facturesFiltre = [];
    this.erreurMessage = '';
    if(this.exists(value)){
      let s = value.split('  ');
      if(s[1] == 'null'){
        s[1] = '';
      }
      this.erreurMessage = s[0] + ' ' + s[1]  + " Existe déjà";
    }
    this.facturesFiltre = [];

    if(value == 'tout'){
      this.facturesFiltre = [];

      this.facturesFiltre = this.factures;
      this.map = [];
      this.selectedCategories = [];
      this.map.push(new Categorie('','',''))
      this.selectedCategories.push(new Categorie('','',''))

    }
    else{
      let s = value.split('  ');

      if(s[1] == 'null'){
        s[1] = '';
      }
      this.selectedCategories[i] = new Categorie(s[0], s[1], s[2]);

      this.filtrerFactures();
    }

  }

  //la methode remove permet de supprimer un element de la liste des categories selectionné ainsi elle supprime de la map un element, de selected categories aussi.
  remove(i: number) {
    this.map.splice(i, 1);
    this.selectedCategories.splice(i,1);
    this.facturesFiltre = [];
    this.filtrerFactures();
    this.erreurMessage = '';


  }

  //filtrer Factures permet de parcourir les factures et de les filtrer selon les catégories séléctionné pour ensuite les stocker
  // dans facturesFiltre qui sera passé en paramètre dans les coposants enfants

  filtrerFactures(){

    //console.log(this.selectedCategories);
    for(var i=0; i<this.factures.length;i++){
      for(var j=0; j<this.selectedCategories.length; j++){
          if(this.selectedCategories[j].nom_sous_Categorie == ''){
            if(this.factures[i].categorie == this.selectedCategories[j].nom_Categorie){
              this.facturesFiltre.push(this.factures[i]);
            }
          }
          else{
            if(this.factures[i].categorie == this.selectedCategories[j].nom_Categorie && this.factures[i].sousCategorie == this.selectedCategories[j].nom_sous_Categorie){
              this.facturesFiltre.push(this.factures[i]);
            }
          }



      }
    }
  }

  //Methode ajouterCat permet d'ajouter une categorie
  ajouterCat() {
    this.map.push(new Categorie('','',''));
    this.selectedCategories.push(new Categorie('', '', ''));

  }
  //-----------------------------------------------FIN des méthodes de filtrage-----------------------------------------------------------------


  //-----------------------------------------------Méthodes datePicker Debut----------------------------------------------------------------------


  //FixerdateD est une méthode qui est appelé par le composant enfant datePicker, il permet de fixer la date de debut
  fixerdateD($event: string) {
    this.dateD = $event;
  }
  //FixerdateF est une méthode qui est appelé par le composant enfant datePicker, il permet de fixer la date de Fin, cependant il déclenche
  //le rechargement de toute la page, il stock ainsi à nouveau les factures...


  fixerdateF($event: string) {
    this.dateF = $event;
    this.chargerFacture(this.dateD, this.dateF);
    let d = this.dateD.split('-');
    this.dateDebut = d[2] + '/' + d[1] + '/' + d[0];
    d = this.dateF.split('-');
    this.dateFin = d[2] + '/' + d[1] + '/' + d[0];

    this.facturesFiltre = [];
    this.facturesFiltre = this.factures;
    this.map = [];
    this.selectedCategories = [];
    this.map.push(new Categorie('','',''))
    this.selectedCategories.push(new Categorie('','',''))
  }

}
