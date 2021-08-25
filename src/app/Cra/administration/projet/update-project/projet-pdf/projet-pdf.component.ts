import {Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, OnChanges} from '@angular/core';
import { jsPDF } from 'jspdf';
import {Projet} from '../../../../models/projet/Projet';
import {ActivatedRoute} from '@angular/router';
import {ProjetHttpDatabase} from '../../../../../configuration-http/ProjetHttpDatabase';
import {HttpClient} from '@angular/common/http';
import {formatDate} from '@angular/common';
import {Pdf} from '../../../../models/projet/Pdf';
import {ListPdf} from '../../../../models/projet/ListPdf';
import {Subscription} from 'rxjs';
import {UserService} from '../../../../../services/user.service';
import {Utilisateur} from '../../../../../Modeles/utilisateur';
import {UtilisateursHttpService} from '../../../../../configuration-http/utilisateurs-http.service';
import {UtilisateurSimple} from '../../../../../Modeles/utilisateurSimple';
import html2canvas from 'html2canvas';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// @ts-ignore
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;
// tslint:disable-next-line:no-duplicate-imports
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-projet-pdf',
  templateUrl: './projet-pdf.component.html',
  styleUrls: ['./projet-pdf.component.scss'],
  providers:[{
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class ProjetPdfComponent implements OnInit, OnChanges {
  @ViewChild('content', {static:false}) el!: ElementRef
  date = new FormControl(moment());
  firstDayString!:string;
  lastDayString!:string;
  firstDay!:Date;
  lastDay!:Date;
  pdf!:Pdf;
  pdfInfoListe = new Array<Pdf>();
  listepdf= new Array<ListPdf[]>();
  pdfList:ListPdf[] = [];
  load = false;
  listeUtilisateurs: UtilisateurSimple[] = [];
  listeAllUsers: UtilisateurSimple[] = [];
  generate = false;
  projet!: Projet;
  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private utilisateurService: UserService) {
    this.route.queryParams.subscribe(params => {
      this.projet = this.route.snapshot.queryParams as Projet;
      console.log("--------", this.projet);
      this.initAllPdf();
    });
  }

  /**
   * charge tous les utilisateurs en meme temps pour télécharger tous les pdf à la fois
   */
  initUsersProjet(){
    this.generate = false;
    this.listeUtilisateurs = [];
    this.initAllPdf();
  }

  /**
   * charge un utilisateur particulier
   * @param usr
   */
  loadUserPdf(usr:UtilisateurSimple){
    this.listeUtilisateurs = [usr];
    this.generate = false;
  }

  /**
   * retourne le mois actuel bien formé MMMM_yyyy
   */
  getMonth(){
    return formatDate(new Date(),'MMMM_yyyy','fr');
  }
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    console.log("date :", this.date);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
    console.log("date :", this.date.value._d as Date);
  }
  /**
   * télécharge un pdf
   */

  public createPDF():void {
    for (const user of this.listeUtilisateurs) {
      const DATA = document.getElementById('display' + user.id);
      if (DATA) {
        html2canvas(DATA).then(canvas => {
          const fileWidth = 210.2;
          const fileHeight = 297.3;
          const FILEURI = canvas.toDataURL('image/png', 1.0);
          const PDF = new jsPDF('p', 'mm', 'a4');
          const position = 0;
          PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);

          PDF.save('CRA_' + this.getMonth() + "_" + this.pdfInfoListe[this.indexOflisteUtilisateurs(user)] + "_" + user.nom + '.pdf');
        });
      }
    }
  }
  /**
   * initialisation des pdf
   */
  initAllPdf(): void {
    const userHttp = new UtilisateursHttpService(this.httpClient);
    const response = userHttp.getUtilisateursProjet(this.projet.code_projet);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        if(reponse.users)
          this.listeUtilisateurs = reponse.users;
        this.listeAllUsers = reponse.users;
        for (let user in this.listeUtilisateurs){
          this.initCurrentMonth(+user);
        }
        this.makePdf();
      }
      else{
        console.log("Erreur : get All users");
      }
    });
  }

  ngOnInit(): void {
    this.utilisateurService.emitUsersSubject();

  }

  /**
   * retourne l'index de l'utilisateur
   * @param user
   */
  indexOflisteUtilisateurs(user: UtilisateurSimple){
    let index = 0;
    for (let usr of this.listeAllUsers){
      if(usr.id == user.id){
        return index;
      }
      index ++;
    }
    return 0;
  }

  /**
   * rempli le pdf
   * @param index
   */
  fill(index:number) {
    for (let elem of this.listepdf[index]) {
      let e = this.isInpdfList(this.pdfInfoListe[index].listeFill, elem);
      elem.duree = e.duree;
      elem.date = e.date;
    }
  }

  /**
   * initialise le pdf avec tous les jours du mois mais une durée à 0 en appelant getDaysInMonth
   * @param user
   */
  initCurrentMonth(user: number){
    this.pdfList=[];
    var date = this.date.value._d as Date, y = date.getFullYear(), m = date.getMonth();
    this.firstDayString = formatDate(new Date(y, m, 1),'yyyy-MM-dd','fr');
    this.lastDayString = formatDate(new Date(y, m + 1, 0),'yyyy-MM-dd','fr');
    this.firstDay = new Date(y, m, 1);
    this.lastDay = new Date(y, m + 1, 0);
    this.getDaysInMonth(user);
  }

  /**
   * met la durée de tous les jours à 0
   * @param user
   */
  getDaysInMonth(user: number) {
    this.listepdf[user] = [];
    this.pdfList = [];
    let first = new Date(this.firstDay);
    while(first <= this.lastDay){
      let dateString = formatDate(first,'yyyy-MM-dd','fr');
      let res = new ListPdf(dateString, this.projet.code_projet+'', '0');
      this.listepdf[user].push(res);
      first.setDate(first.getDate()+1);
    }
  }

  /**
   * appel le chargement d'un pdf associé au projet pour chaque utilisateurs
   */
  makePdf(){
    let index = 0;
    for (let usr of this.listeUtilisateurs){
      this.chargerProjet(usr.id, index);
      index ++;
    }

  }

  isInpdfList(liste: ListPdf[], pdf:ListPdf){
    for (let elem of liste){
      if (elem.date == pdf.date) {
        return new ListPdf(elem.date, this.projet.code_projet,elem.duree);
      }
    }
    return pdf;
  }

  /**
   * récupère les valeurs en bdd pour charger le pdf associé au projet
   * @param idUser
   * @param index
   */
  chargerProjet(idUser:string, index:number){
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.getPdF(this.firstDayString,this.lastDayString,this.projet.code_projet,idUser);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        this.pdfInfoListe[index] = reponse.result;
        if(reponse.result.listeFill){
          this.fill(index);
        }
      }
      else{
        console.log("Erreur de requete de base de données");
      }

    });
  }

  ngOnChanges(): void {
    this.utilisateurService.emitUsersSubject();
  }
}
