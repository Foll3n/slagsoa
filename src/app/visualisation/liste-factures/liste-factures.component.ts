import {Component, Input, OnChanges} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Facture} from "../../Modeles/facture";
import {Categorie, ReponseGetFacture} from "../visualisation.component";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Categories1 } from "../../Modeles/categorie";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { ResultatUpload } from "../../ajouter/ajouter.component";
import { ConnexionComponent } from "../../connexion/connexion.component";
import {environment} from "../../../environments/environment";

//---------------------------------------------- Class temporaire qui stock la reponse de la requete delete -----------------
export class reponseDelete{
  reponse!: string;
  message!: string;
}
@Component({
  selector: 'app-liste-factures',
  templateUrl: './liste-factures.component.html',
  styleUrls: ['./liste-factures.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})

export class ListeFacturesComponent implements OnChanges {

  //Attributs qui récupèrent les données du composant père, on y retrouve ainsi:
  // - la date de debut
  // - la date de fin
  // - une liste de facture déjà trié
  // - Une liste des categories
  // - Une liste des categories avec leurs sous categories
  @Input() dateDebut!: string;
  @Input() dateFin!: string;
  @Input() factures!: Facture[];
  @Input() categories!: Categorie[];
  @Input() tableauCat!: Categories1[];



  sousCat !: string[];

  dateD!:string;
  dateF!:string;

  //Les attributs searchTerm permettent de stocker en temps réel les mots recherchés dans le filtre
  searchTerm!: string;
  searchTerm1!: string;
  searchTerm2!: string;

  //rpd servira de stockage pour la reponse delete
  rpd = new reponseDelete();


  message = '';
  message1 = '';


  rp!: ResultatUpload;

  erreur!: string;
  httpOptions = {
    headers: new HttpHeaders()
  };

  type!: string;
  facture!: Facture;
  modification!: FormGroup;

  urlFacture = ""

  constructor(public con: ConnexionComponent, private http: HttpClient, config: NgbModalConfig, private modalService: NgbModal) {
    this.urlFacture = environment.urlFacture;
    this.modification = new FormGroup({
      idFacture: new FormControl(),
      montantTTC: new FormControl('',[Validators.required, Validators.pattern('^(([0-9]([0-9]*))([.,](([0-9]?)[0-9]))?)$')]),
      dateFacture: new FormControl('', [Validators.pattern('^((([0-2][0-9])||([3][0-1]))[\\/][0-1][0-9][\\/][1-2][0-9][0-9][0-9]){1,1}$'), Validators.required]),
      commentaire: new FormControl(),
      categorie: new FormControl('', [Validators.pattern('^[a-zA-Z]*$') ,Validators.required]),
      sousCategorie: new FormControl(),
      image: new FormControl(),
    });
  }
  get dateFacture() {
    return this.modification.get('dateFacture');
  }

  get montantttcF() {
    return this.modification.get('montantTTC');
  }

  get categorie() {
    return this.modification.get('categorie');
  }

  ngOnChanges() {
    if(this.sousCat != null){
      this.sousCat = this.tableauCat[0].nomSousCategorie;
    }
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':'+sessionStorage.getItem('mdp'))})
    let d = this.dateDebut.split('-');
    this.dateD = d[2] + '/' + d[1] + '/' + d[0];
    d = this.dateFin.split('-');
    this.dateF = d[2] + '/' + d[1] + '/' + d[0];
    if(this.factures != null){
      this.message = this.factures.length + ' factures';
    }
    if(this.factures == null){
      this.message = "Aucune donnnées aux date séléctionné";
    }
  }

  supprimerFacture(id: string){
    this.http.delete(this.urlFacture + '?id='+ id , this.httpOptions).subscribe(
      reponse => {
        // @ts-ignore
        this.rpd = reponse;
        this.erreur = this.rpd.message;
        for(var i=0; i<this.factures.length; i++){
          if(this.factures[i].idFacture == id){
            this.factures.splice(i);
            location.reload();
          }
        }
      },
      error => {
        this.erreur = error;
      }
    )
  }

  //Ouverture de la fenetre modifier facture
  // @ts-ignore
  open(content , fact: Facture) {
    this.facture = fact;
    this.modification.reset();
    //boucle permettant d'initialiser la liste des sous categories selon la categorie
    for(let i=0; i<this.tableauCat.length;i++){
      if(this.tableauCat[i].nom == fact.categorie){
        this.sousCat = this.tableauCat[i].nomSousCategorie;
        this.modification.get('sousCategorie')?.setValue(this.sousCat[0]);
      }
    }
    //permet d'attribuer des valeurs à chaque champs
    this.modification.patchValue({
      idFacture: fact.idFacture,
      montantTTC: fact.montantTTC,
      dateFacture: fact.dateFacture,
      commentaire: fact.commentaire,
      categorie: fact.categorie,
      sousCategorie: fact.sousCategorie,
      image: fact.image
    })
    if(this.modification.get('image')?.value != null && this.modification.get('image')?.value != ''){
      let a = this.modification.get('image')?.value;
      let s = a.split('/');
      s = s[1].split(';');
      this.type = s[0];
    }
    this.modalService.open(content);
  }

  onOptionsSelected(value: string) {
    this.modification.get('sousCategorie')?.setValue('');
    for(let i=0; i<this.tableauCat.length;i++){
      if(this.tableauCat[i].nom == value){
        this.sousCat = this.tableauCat[i].nomSousCategorie;
        this.modification.get('sousCategorie')?.setValue(this.sousCat[0]);
      }
    }
  }

  modifierFacture() {
    let s = '[' + JSON.stringify(this.modification.value) + ']';
    this.http.put(this.urlFacture, s , this.httpOptions).subscribe(
      reponse => {
        // @ts-ignore
        this.rp = reponse;
        this.message1 = this.rp.message;
        location.reload();
      },
      error => {
        this.message1 = error;
        location.reload();
      }
    )
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
      //me.facture.image = reader.result;
      me.modification.get('image')?.setValue(reader.result);
    };
    reader.onerror = function (error) {
      //console.log('Error: ', error);
    };
  }

  nettoyer(f: Facture) {
    //console.log(f.image);
    this.modification.get('image')?.setValue('');
    //f.image = '';
    //f.image = null;
    this.type = '';

  }

  showPdf(linkSource: string) {
    const downloadLink = document.createElement("a");
    let fileName = '';
    if(this.type == 'pdf'){
      fileName = "facture" + this.facture.idFacture + ".pdf";
    }
    else{
      fileName = "facture" + this.facture.idFacture + ".png";
    }


    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}

