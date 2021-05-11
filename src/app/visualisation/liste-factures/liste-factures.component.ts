import {Component, Input, OnChanges} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Facture} from "../../Modeles/facture";
import {Categorie, ReponseGetFacture} from "../visualisation.component";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Categories1 } from "../../Modeles/categorie";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { ResultatUpload } from "../../ajouter/ajouter.component";

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

  @Input() dateDebut!: string;
  @Input() dateFin!: string;
  @Input() factures!: Facture[];
  @Input() categories!: Categorie[];
  @Input() tableauCat!: Categories1[];




  sousCat !: string[];
  dateD!:string;
  dateF!:string;
  searchTerm!: string;
  searchTerm1!: string;
  searchTerm2!: string;
  rpd = new reponseDelete();
  message = '';
  message1 = '';
  rp!: ResultatUpload;

  erreur!: string;
  httpOptions = {
    headers: new HttpHeaders()
  };

  //rf = new ReponseGetFacture();

  facture!: Facture;
  modification: FormGroup;

  constructor(private http: HttpClient, config: NgbModalConfig, private modalService: NgbModal) {
    this.modification = new FormGroup({
      idFacture: new FormControl(),
      montantTTC: new FormControl('',[Validators.required, Validators.pattern('^(([0-9]([0-9]*))([.,](([0-9]?)[0-9]))?)$')]),
      dateFacture: new FormControl('', [Validators.pattern('^((([0-2][0-9])||([3][0-1]))[\\/][0-1][0-9][\\/][1-2][0-9][0-9][0-9]){1,1}$'), Validators.required]),
      commentaire: new FormControl(),
      categorie: new FormControl('', [Validators.pattern('^[a-zA-Z]*$') ,Validators.required]),
      sousCategorie: new FormControl(),
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
    this.http.delete('http://localhost:5555/rest/ws.facture/?id='+ id , this.httpOptions).subscribe(
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

  // @ts-ignore
  open(content , fact: Facture) {
    this.facture = fact;
    this.modification.reset();
    this.modification.patchValue({
      idFacture: fact.idFacture,
      montantTTC: fact.montantTTC,
      dateFacture: fact.dateFacture,
      commentaire: fact.commentaire,
      categorie: fact.categorie,
      sousCategorie: fact.sousCategorie
    })
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
    this.http.put("http://localhost:5555/rest/ws.facture/" , s , this.httpOptions).subscribe(
      reponse => {
        // @ts-ignore
        this.rp = reponse;
        this.message1 = this.rp.message;
        location.reload();
      },
      error => {
        this.message1 = error;
      }
    )
  }
}
