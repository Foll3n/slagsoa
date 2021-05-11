import {Component, Input, OnInit} from '@angular/core';
import {HttpHeaders, HttpClient, HttpClientModule} from "@angular/common/http";
import {stringify} from "@angular/compiler/src/util";
import {NgbNavConfig} from '@ng-bootstrap/ng-bootstrap';
import {Categorie, Resultat} from "../visualisation/visualisation.component";
// @ts-ignore
import * as url from "url";
import {Facture} from "../Modeles/facture";
import {tryCatch} from "rxjs/internal-compatibility";
import {ConnexionComponent} from "../connexion/connexion.component";
import {Categories1} from "../Modeles/categorie";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DATEPICKER_VALIDATORS} from "@angular/material/datepicker";

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
  upload!: boolean;
  jsondata = '  ';
  facture!: Facture[];
  rp!: ResultatUpload;
  resultat!: Resultat;
  categories!: Categorie[];

  messageerreur = "";
  urlCategories = "http://localhost:5555/rest/ws.categorie";

  httpOptions = {
    headers: new HttpHeaders()
  };

  catPrincipal!: Categorie[];
  sousCat !: string[];
  tableauCategories!: Categories1[];


  //-------------------------------------------------- DEBUT CONSCTRUCTOR ET NGONINIT ----------------------------------------------------


  constructor(private http: HttpClient, config: NgbNavConfig, public c: ConnexionComponent) {
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
      reader.readAsText(file);
      reader.onload = () => {
        let text = reader.result;
        this.text = text;
        this.traiterDonnees(this.text);
        this.upload = true;
      }
      this.message = file.name + " a bien été séléctionné, appuyez sur le boutton upload pour valider";

    } else {
      this.message = "Ce n'est pas un fichier csv";
    }
  }

  debutChargement() {
    this.upload = false;
    this.jsondata = '';
    this.message = "chargement";
  }


  traiterDonnees(donnees: string) {
    //console.log("debut");
    try {
      var tligne = donnees.split('\n');
      for (var i = 1; i < tligne.length - 1; i++) {
        var ligne = tligne[i].split(';');
        // @ts-ignore
        let commentaire = ligne[4].split('\r');
        if (ligne[0] != '') {
          let fact = new Facture(ligne[0], ligne[1], ligne[2], ligne[3], commentaire[0]);
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
      let facture = new Facture(this.insertion.get('montantttc')?.value, this.insertion.get('categorie')?.value, sousCategorieF, this.insertion.get('dateFacture')?.value, this.insertion.get('commentaire')?.value);
      this.upload = true;
      this.stockerDonnees('[' + JSON.stringify(facture) + ']');
    }
  }


  getCategories() {
    this.http.get<any>(this.urlCategories).subscribe(
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

  stockerDonnees(jsondata: string) {
    if (this.upload) {
      //"http://localhost:5555/rest/ws/stocker_csv_ws/"
      this.http.post("http://localhost:5555/rest/ws.facture/", JSON.parse(jsondata), this.httpOptions).subscribe(
        reponse => {
          // @ts-ignore
          this.rp = reponse;
          this.message = this.rp.message;
          if (this.rp.reponse == 'OK') {
            this.upload = false;
          }
          this.insertion.reset();
          this.sousCat = [];
          this.insertion.get('montantttc')?.setValue('');
          this.insertion.get('dateFacture')?.setValue('');
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
}

//-------------------------------------------------- FIN METHODES STOCKAGE ------------------------------------------------------------------------