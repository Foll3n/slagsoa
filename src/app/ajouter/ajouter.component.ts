import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpHeaders, HttpClient, HttpClientModule} from "@angular/common/http";
import {stringify} from "@angular/compiler/src/util";
import {NgbNavConfig} from '@ng-bootstrap/ng-bootstrap';
import { environment} from "../../environments/environment";
import {Categorie, Resultat} from "../visualisation/visualisation.component";
// @ts-ignore
import * as url from "url";
import {Facture} from "../Modeles/facture";
import {tryCatch} from "rxjs/internal-compatibility";
import {ConnexionComponent} from "../connexion/connexion.component";
import {Categories1} from "../Modeles/categorie";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DATEPICKER_VALIDATORS} from "@angular/material/datepicker";
import WebViewer from "@pdftron/webviewer";

export class ResultatUpload {
  message!: string;
  reponse!: string;
}


@Component({
  selector: 'app-ajouter',
  templateUrl: './ajouter.component.html',
  styleUrls: ['./ajouter.component.scss']
})


export class AjouterComponent implements OnInit {


  message: string = "Aucune donnée détéctée";
  fileName = '';
  text: any;
  text1: any;
  upload!: boolean;
  jsondata = '  ';
  facture!: Facture[];
  rp!: ResultatUpload;
  resultat!: Resultat;
  categories!: Categorie[];
  erreur!: boolean;
  msgErreurTab = "";
  tableauErreur = [];
  messageerreur = "";
  urlCategories = "";
  message1: any;
  type!: string;
  urlFacture = "";


  httpOptions = {
    headers: new HttpHeaders()
  };

  catPrincipal!: Categorie[];
  sousCat !: string[];
  tableauCategories!: Categories1[];


  //-------------------------------------------------- DEBUT CONSCTRUCTOR ET NGONINIT ----------------------------------------------------
  chargement: any;


  constructor(private http: HttpClient, config: NgbNavConfig, public c: ConnexionComponent) {
    this.urlFacture = environment.urlFacture;
    this.urlCategories = environment.urlCategories;
    config.destroyOnHide = false;
    config.roles = false;
  }


  ngOnInit() {
    if (this.sousCat != null) {
      this.sousCat = this.tableauCategories[0].nomSousCategorie;
    }
    this.catPrincipal = [];
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    })
    this.c.testLogin();
    this.getCategories();
  }


  //-------------------------------------------------- FIN CONSCTRUCTOR ET NGONINIT ----------------------------------------------------
  /*
  -
  -
  -
  -
   */

//-------------------------------------------------- DEBUT FORMULAIRE + GETTERS ----------------------------------------------------

  insertion = new FormGroup({
    montantttc: new FormControl('', [Validators.required, Validators.pattern('^(([0-9]([0-9]*))([.,](([0-9]?)[0-9]))?)$')]),
    dateFacture: new FormControl('', [Validators.pattern('^((([0-2][0-9])||([3][0-1]))[\\/][0-1][0-9][\\/][1-2][0-9][0-9][0-9]){1,1}$'), Validators.required]),
    commentaire: new FormControl(),
    categorie: new FormControl('', [Validators.pattern('^[a-zA-Z]*$'), Validators.required]),
    sousCategorie: new FormControl(),
    image: new FormControl(),
  });

  get dateFacture() {
    return this.insertion.get('dateFacture');
  }

  get montantttcF() {
    return this.insertion.get('montantttc');
  }

  get categorie() {
    return this.insertion.get('categorie');
  }
  //-------------------------------------------------- FIN FORMULAIRE + GETTERS ----------------------------------------------------

  /*
  -
  -
  -
  -
   */

  //-------------------------------------------------- DEBUT METHODES UPLOAD CSV  ----------------------------------------------------


  onFileSelected(event: any) {
    this.upload = false;
    this.facture = [];
    const file: File = event.target.files[0];
    let s = file.name.split('.');

    if (s[1] == "csv") {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        let text = reader.result;
        this.text = text;
        this.traiterDonnees(this.text);
        this.upload = true;
        if(!this.erreur){
          this.message = file.name + " a bien été séléctionné, appuyez sur le boutton charger pour valider";
        }
        else{
          this.message = '';
        }
      }


    } else {
      this.message = "Ce n'est pas un fichier csv";
    }
  }

  debutChargement() {
    this.msgErreurTab = "";
    this.upload = false;
    this.jsondata = '';
    this.message = "chargement";
  }


  traiterDonnees(donnees: string) {
    this.msgErreurTab = "";
    let s = "";
    this.erreur = false;
    //console.log("debut");
    try {
      var tligne = donnees.split('\n');
      for (var i = 1; i < tligne.length - 1; i++) {
        var ligne = tligne[i].split(';');
        // @ts-ignore
        let commentaire = ligne[4].split('\r');
        if (ligne[0] != '') {
          let fact = new Facture(ligne[0], ligne[1], ligne[2], ligne[3], commentaire[0]);

          //On inseres la facture dans le formulaire pour utiliser les validators pour vérifier les lignes
          this.insertion.patchValue({
            idFacture: fact.idFacture,
            montantttc: fact.montantTTC,
            dateFacture: fact.dateFacture,
            commentaire: fact.commentaire,
            categorie: fact.categorie,
            sousCategorie: fact.sousCategorie
          })


          //Ainsi on renvoies un message d'erreur si les champs sont null ou vides, ou bien si ils ne correspondent pas au validators.
          if(this.montantttcF?.value == null || this.montantttcF.value == '' || this.categorie?.value == null || this.categorie.value == '' || this.dateFacture?.value == null || this.dateFacture.value == '' || this.montantttcF.errors?.pattern || (this.categorie.errors?.pattern || !this.valideCategorie(fact.categorie, fact.sousCategorie)) || ((this.dateFacture!= null && this.dateFacture.errors?.pattern))) {
            this.erreur = true;
            s = s+' Il y a des erreurs à la ligne ' + i + ": ";
            if((this.montantttcF!= null && this.montantttcF.errors?.pattern)){
              s = s+ " - Le montant ttc est incorrecte";
            }
            if((this.categorie!= null && this.categorie.errors?.pattern) || !this.valideCategorie(fact.categorie , fact.sousCategorie)) {
              s = s+ " - La categorie ou la sous categorie est incorrecte";
            }
            if((this.dateFacture!= null && this.dateFacture.errors?.pattern)){
              s = s+ " - La date facture est incorrecte";
            }
            s =   s + ' -- |||' ;
          }
          this.msgErreurTab = s;

          this.facture.push(fact);
          // @ts-ignore
          this.jsondata = this.jsondata + JSON.stringify(fact);
          let ligneapres = tligne[i + 1].split(';');
          if (ligneapres[0] != '') {
            this.jsondata = this.jsondata + ',';
          }
        }
      }
      this.jsondata = '[' + this.jsondata + ']';
    } catch (error) {
      this.message = "Le fichier ne respecte pas les normes : " + error;
      this.upload = false;
    }
    this.insertion.reset();
    this.insertion.get('montantttc')?.setValue('');
    this.insertion.get('dateFacture')?.setValue('');
  }

  valideCategorie(nom: string, sousn: string): boolean{
    for(let i=0; i<this.tableauCategories.length ; i++){
      if(nom == this.tableauCategories[i].nom){
        if(this.tableauCategories[i].nomSousCategorie.length == 0 && ((sousn ==null) || (sousn == ''))){
          return true;
        }
        if((this.tableauCategories[i].nomSousCategorie.length > 0 && sousn !=null)){
          for(let j=0; j< this.tableauCategories[i].nomSousCategorie.length ; j++){
            if(sousn == this.tableauCategories[i].nomSousCategorie[j]){
              return true
            }
          }
        }
      }
    }
      return false;
  }

  //------------------------------------------------ FIN METHODES UPLOAD CSV------------------------------------------------------------------------
  /*
-
-
-
-
 */

  //-------------------------------------------------- DEBUT METHODES UPLOAD MANUEL  ----------------------------------------------------------------

  onOptionsSelected(value: string) {
    this.insertion.get('sousCategorie')?.setValue('');
    for (let i = 0; i < this.tableauCategories.length; i++) {
      if (this.tableauCategories[i].nom == value) {
        this.sousCat = this.tableauCategories[i].nomSousCategorie;
        if (this.sousCat.length > 0) {
          this.insertion.get('sousCategorie')?.setValue(this.sousCat[0]);
        }
      }
    }
  }

  addFacture() {
    let sousCategorieF = this.insertion.get('sousCategorie')?.value;
    if (this.insertion.get('categorie')?.value != null && this.insertion.get('dateFacture')?.value != null && this.insertion.get('montantttc')?.value != null) {
      if (sousCategorieF == "null") {
        sousCategorieF = "";
      }
      let facture = new Facture(this.insertion.get('montantttc')?.value, this.insertion.get('categorie')?.value, sousCategorieF, this.insertion.get('dateFacture')?.value, this.insertion.get('commentaire')?.value );
      facture.image = this.insertion.get('image')?.value;
      this.upload = true;
      this.stockerDonnees('[' + JSON.stringify(facture) + ']' , 1);
    }
  }


  getCategories() {
    this.http.get<any>(this.urlCategories, this.httpOptions).subscribe(
      reponse => {
        this.resultat = reponse;
        this.categories = this.resultat.cat;
        if (this.categories != null) {
          for (var i = 0; i < this.categories.length; i++) {

            if (this.categories[i].nom_sous_Categorie == null && this.categories[i].nom_Categorie != '') {
              this.catPrincipal.push(this.categories[i]);
            }
          }
          this.tableauCategories = [];
          this.chargerTableauCategories();
        }
      }
    )
  }

  chargerTableauCategories() {
    for (let i = 0; i < this.catPrincipal.length; i++) {
      let c = new Categories1();
      c.nom = this.catPrincipal[i].nom_Categorie;
      c.nomSousCategorie = [];
      for (var j = 0; j < this.categories.length; j++) {
        if (this.categories[j].nom_Categorie == c.nom && this.categories[j].nom_sous_Categorie != null) {
          c.nomSousCategorie.push(this.categories[j].nom_sous_Categorie);
        }
      }

      this.tableauCategories.push(c);
    }

  }

  //------------------------------------------------ FIN METHODES UPLOAD MANUEL------------------------------------------------------------------------
  /*
-
-
-
-
 */

  //-------------------------------------------------- DEBUT METHODES STOCKAGE ------------------------------------------------------------------------

  stockerDonnees(jsondata: string , nb: number) {
    console.log(jsondata);
    if (this.upload) {
      //"http://localhost:5555/rest/ws/stocker_csv_ws/"
      this.http.post(this.urlFacture, JSON.parse(jsondata), this.httpOptions).subscribe(
        reponse => {
          // @ts-ignore
          this.rp = reponse;
          if(nb == 0){
            this.message = this.rp.message;
          }
          if(nb == 1){
            this.message1 = this.rp.message;
          }

          if (this.rp.reponse == 'OK') {
            this.upload = false;
          }
          this.insertion.reset();
          this.sousCat = [];
          this.insertion.get('montantttc')?.setValue('');
          this.insertion.get('dateFacture')?.setValue('');
          this.insertion.get('image')?.setValue('');
          this.type = '';
        },
        error => {
          this.message = error;
          this.upload = false;
        }
      )
    } else {
      this.message = "Aucune donnée détéctée";
      this.upload = false;
    }
  }

  nettoyer(facture: Facture[]) {
    this.insertion.get('image')?.setValue('');
    this.type = '';
  }

  chargerImage($event: Event) {
    let me = this;
    // @ts-ignore
    let file = $event.target.files[0];
    let s = file.name.split('.');
    this.type  = s[1];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.insertion.get('image')?.setValue(reader.result);

    };
    reader.onerror = function (error) {
      //console.log('Error: ', error);
    };
  }

  showPdf(linkSource: string) {
    const downloadLink = document.createElement("a");
    let fileName = '';
    if(this.type == 'pdf'){
      fileName = "facture.pdf";
    }
    else{
      fileName = "facture.png";
    }


    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

}

//-------------------------------------------------- FIN METHODES STOCKAGE ------------------------------------------------------------------------

