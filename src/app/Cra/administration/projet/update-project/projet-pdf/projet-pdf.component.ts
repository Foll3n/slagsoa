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
  pdfList:ListPdf[] = [];
  listeUtilisateursSubscription!: Subscription;
  listeUtilisateurs: Utilisateur[] = [];
  idUser = '99';

  projet!: Projet;
  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private utilisateurService: UserService) {
    this.listeUtilisateursSubscription = utilisateurService.usersSubject.subscribe( (listeUsers: Utilisateur[]) => {
      console.log("je charle les utilisateurs",listeUsers);
      this.listeUtilisateurs = listeUsers;
    });


  }

  ngOnInit(): void {
    this.utilisateurService.emitUsersSubject();
    this.projet = this.route.snapshot.queryParams as Projet;

    this.initCurrentMonth();
    // this.getDaysInMonth();

  }
  initList(){
    this.getDaysInMonth();
  }
  fill() {
    if (this.pdf){
      for (let elem of this.pdfList) {
        let e = this.isInpdfList(this.pdf.listeFill, elem);
        elem.duree = e.duree;
        elem.date = e.date;
      }
      console.log('je suis dans fill pdf',this.pdf);
    }


  }


  initCurrentMonth(){
    this.pdfList=[];
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.firstDayString = formatDate(new Date(y, m, 1),'yyyy-MM-dd','fr');
    this.lastDayString = formatDate(new Date(y, m + 1, 0),'yyyy-MM-dd','fr');
    this.firstDay = new Date(y, m, 1);
    this.lastDay = new Date(y, m + 1, 0);
    this.getDaysInMonth();
  }
  getDaysInMonth() {
    this.pdfList = [];
    console.log("--------------------",this.projet);
    let first = new Date(this.firstDay);
      while(first < this.lastDay){
        let dateString = formatDate(first,'yyyy-MM-dd','fr');
        console.log(this.projet.code_projet+'<------------');
          this.pdfList.push(new ListPdf(dateString, this.projet.code_projet+'', '0'));
          first.setDate(first.getDate()+1);
      }
      console.log("iciiii ",this.pdfList);

  }
  makePdf(user:string='99'){
    this.chargerProjet(user);

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

  chargerProjet(idUser:string){
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.getPdF(this.firstDayString,this.lastDayString,this.projet.code_projet,idUser);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse,'ppppppppppppppppppppppppppp');
        this.pdf = reponse.result;
        this.getDaysInMonth();
        this.fill();
        console.log('ici' , this.pdfList);

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
