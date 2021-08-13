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
@Component({
  selector: 'app-projet-pdf',
  templateUrl: './projet-pdf.component.html',
  styleUrls: ['./projet-pdf.component.scss']
})
export class ProjetPdfComponent implements OnInit, OnChanges {
  @ViewChild('content', {static:false}) el!: ElementRef
  firstDayString!:string;
  lastDayString!:string;
  firstDay!:Date;
  lastDay!:Date;
  pdf!:Pdf;
  pdfInfoListe = new Array<Pdf>();
  listepdf= new Array<ListPdf[]>();
  pdfList!:ListPdf[];
  load = false;
  listeUtilisateurs!: UtilisateurSimple[];
  listeAllUsers!: UtilisateurSimple[];
  idUser = '99';
  generate = false;

  projet!: Projet;
  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private utilisateurService: UserService) {
    this.route.queryParams.subscribe(params => {
      this.projet = this.route.snapshot.queryParams as Projet;
      console.log("--------", this.projet.code_projet);
      this.initUsersProjet();
    });
  }

  loadUserPdf(usr:UtilisateurSimple){
    this.listeUtilisateurs = [usr];
  }
  initUsersProjet(): void {
    const userHttp = new UtilisateursHttpService(this.httpClient);
    const response = userHttp.getUtilisateursProjet(this.projet.code_projet);
    response.subscribe(reponse => {
      console.log("reponse ---> ", reponse);
      if(reponse.status == 'OK'){
        if(reponse.users)
          this.listeUtilisateurs = reponse.users;
          this.listeAllUsers = reponse.users;
        for (let user in this.listeUtilisateurs){
          this.initCurrentMonth(+user);
        }
        console.log("iciiii ",this.listepdf);
        this.makePdf();
      }
      else{
        console.log("Erreur : get All users");
      }
    });
  }

  ngOnInit(): void {

    this.utilisateurService.emitUsersSubject();


    // this.getDaysInMonth();

  }

  fill(index:number) {

      for (let elem of this.listepdf[index]) {
        let e = this.isInpdfList(this.pdfInfoListe[index].listeFill, elem);
        elem.duree = e.duree;
        elem.date = e.date;
      }
      console.log('je suis dans fill pdf',this.pdf);



  }


  initCurrentMonth(user: number){
    this.pdfList=[];
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.firstDayString = formatDate(new Date(y, m, 1),'yyyy-MM-dd','fr');
    this.lastDayString = formatDate(new Date(y, m + 1, 0),'yyyy-MM-dd','fr');
    this.firstDay = new Date(y, m, 1);
    this.lastDay = new Date(y, m + 1, 0);
    this.getDaysInMonth(user);
  }
  getDaysInMonth(user: number) {
    this.listepdf[user] = [];
    this.pdfList = [];
    console.log("--------------------",this.projet);
    let first = new Date(this.firstDay);
      while(first < this.lastDay){
        let dateString = formatDate(first,'yyyy-MM-dd','fr');
        let res = new ListPdf(dateString, this.projet.code_projet+'', '0');
          this.listepdf[user].push(res);
          first.setDate(first.getDate()+1);
      }


  }
  makePdf(){
    let index = 0;
    for (let usr of this.listeUtilisateurs){
      this.chargerProjet(usr.id, index);
      console.log("ooo");
      index ++;
    }


    // console.log("projet ---> ",this.projet);
    // let pdf = new jsPDF('p','pt','a4');
    // pdf.html(this.el.nativeElement,{
    //   callback:(pdf) => {
    //     pdf.save("projet.pdf");
    //   }
    // });
  }

  isInpdfList(liste: ListPdf[], pdf:ListPdf){
    console.log(liste,"uuuuuuuuuuuuukkkkkkkkkkkkkkkuuuuuuuuuuuu",pdf);
    for (let elem of liste){
      if (elem.date == pdf.date) {
        console.log("__" , elem,pdf);
        return new ListPdf(elem.date, this.projet.code_projet,elem.duree);
      }
    }
    return pdf;
  }

  chargerProjet(idUser:string, index:number){
    const projetHttp = new ProjetHttpDatabase(this.httpClient);

    const response = projetHttp.getPdF(this.firstDayString,this.lastDayString,this.projet.code_projet,idUser);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){

        this.pdfInfoListe[index] = reponse.result;
        if(reponse.result.listeFill){
          this.fill(index);
          console.log("this.pdf list", this.pdfInfoListe);
          console.log("this.listepdf ", this.listepdf);
        }
        // this.pdf = reponse.result;
        // this.getDaysInMonth();

        // console.log('ici-> pdf bien formé' , this.pdfList);

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
