import { Component, OnInit } from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Type } from "../Modeles/type";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/ja';
import 'moment/locale/fr';
import {TypesHttpService} from "../configuration-http/types-http.service";
import {Conge} from "../Modeles/conge";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CongesHttpService} from "../configuration-http/conges-http.service";
import * as _moment from 'moment';
import {ConnexionService} from "../connexion/connexion.service";
import {Utilisateur} from "../Modeles/utilisateur";
import {Subscription} from "rxjs";
const moment = _moment;

export class date {
  date!: string;
  month!: string;
  year!: string;
}

@Component({
  selector: 'app-visualisation-conges',
  templateUrl: './visualisation-conges.component.html',
  styleUrls: ['./visualisation-conges.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class VisualisationCongesComponent implements OnInit {
  congesCumules = '';
  congesPoses = '';
  congesRestant = '';

  typePreccedent: any;

  //date = new FormControl(moment());
  minDate: Date;
  maxDate: Date;

  users!: Utilisateur[];
  user!: Utilisateur;

  userSubscription!: Subscription;

  email = new FormControl('', [Validators.required, Validators.email]);

  messageErreur = '';

  typesConges!: Type[];
  formulaire: FormGroup;
  messageSucces= '';

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  constructor(private connexionService: ConnexionService,private _adapter: DateAdapter<any>,private modalService: NgbModal ,private congesServices:CongesHttpService, private typeServices: TypesHttpService, httpClient: HttpClient) {

    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date().getDate() + 8;
    this.minDate = new Date(year, month, day);
    this.maxDate = new Date(year + 1, 11, 31);
    this.formulaire = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
      typeConge: new FormControl(),
      dateDebutChoix: new FormControl(),
      dateFinChoix: new FormControl(),
      raisonConge: new FormControl(),
    });
  }



  ngOnInit(): void {
    this.userSubscription = this.connexionService.usersSubject.subscribe(
      (users: Utilisateur[]) => {
        if(users){
          this.users = users;
          this.user = this.users[0];
          this.congesCumules = this.user.nbCongesCumules;
          this.congesPoses = this.user.nbCongesPoses;
          this.congesRestant = this.user.nbCongesRestant;
        }
      }
    );
    this._adapter.setLocale('fr');
    this.remplirTypes();

  }

  remplirTypes(){
    this.typeServices.getTypes().subscribe(
      resultat => {
        console.log(resultat);
        this.typesConges = resultat.outputType;
        console.log(this.typesConges)
      },
      error => {
        console.log(error.error);
      }
    )
  }

  changementEtatCongeExceptionnel(value: any) {

    if(value == 'URGENT'){
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = new Date().getDate();
      this.minDate = new Date(year, month, day);
      this.maxDate = new Date(year + 1, 11, 31);
    }
    if((value != 'URGENT') && (this.typePreccedent == 'URGENT')){
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = new Date().getDate() + 8;
      this.minDate = new Date(year, month, day);
      this.maxDate = new Date(year + 1,  11, 31);
      this.formulaire.reset();
      console.log(this.formulaire.value);
    }
    this.typePreccedent = value;
  }


  addConges() {
    let congeTemp = new Conge();
    let dateDebut = this.formulaire.get('start')?.value._i;
    let dateFin = this.formulaire.get('end')?.value._i;
    // congeTemp.dateDebut = '2040-04-10 12:00:00';
    congeTemp.dateDebut = `${dateDebut.year}-${dateDebut.month}-${dateDebut.date} ${this.formulaire.get('dateDebutChoix')?.value}`;
    congeTemp.dateFin = `${dateFin.year}-${dateFin.month}-${dateFin.date} ${this.formulaire.get('dateFinChoix')?.value}`;
    congeTemp.type = this.formulaire.get('typeConge')?.value;
    congeTemp.commentaire= this.formulaire.get('raisonConge')?.value;

    congeTemp.etat= 'EN_COURS';

    let idUtilisateur = sessionStorage.getItem('id');
    if(idUtilisateur){
      congeTemp.idUtilisateur = idUtilisateur;
    }
    else {
      this.connexionService.testLogin();
    }

    if(this.formulaire.valid){
      console.log(congeTemp);
      this.congesServices.addConges(congeTemp).subscribe(
        reponse => {
          this.formulaire.reset();
          this.messageSucces = "La demande de congé a bien été prise en compte";

        },
        error => {
          this.messageErreur = 'Erreur formulaire incorrecte'

        }
      )
    }

  }
}
