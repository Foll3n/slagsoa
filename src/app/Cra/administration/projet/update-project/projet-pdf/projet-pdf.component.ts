import {Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import { jsPDF } from "jspdf";
import {Projet} from '../../../../models/projet/Projet';
import {ActivatedRoute} from '@angular/router';
import {ProjetHttpDatabase} from '../../../../../configuration-http/ProjetHttpDatabase';
import {HttpClient} from '@angular/common/http';
import {formatDate} from '@angular/common';
import {Pdf} from '../../../../models/projet/Pdf';
import {ListPdf} from '../../../../models/projet/ListPdf';
@Component({
  selector: 'app-projet-pdf',
  templateUrl: './projet-pdf.component.html',
  styleUrls: ['./projet-pdf.component.scss']
})
export class ProjetPdfComponent implements OnInit {
  @ViewChild('content', {static:false}) el!: ElementRef
  firstDayString!:string;
  lastDayString!:string;
  firstDay!:Date;
  lastDay!:Date;
  pdf!:Pdf;
  pdfList:ListPdf[] = [];

  projet!: Projet;
  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {



  }

  ngOnInit(): void {
    this.projet = this.route.snapshot.queryParams as Projet;
    this.initCurrentMonth();
    // this.getDaysInMonth();
    this.chargerProjet();
  }
  initCurrentMonth(){
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.firstDayString = formatDate(new Date(y, m, 1),'yyyy-MM-dd','fr');
    this.lastDayString = formatDate(new Date(y, m + 1, 0),'yyyy-MM-dd','fr');
    this.firstDay = new Date(y, m, 1);
    this.lastDay = new Date(y, m + 1, 0);
    this. getDaysInMonth();
  }
  getDaysInMonth() {
    let first = new Date(this.firstDay);
      while(first < this.lastDay){
        let dateString = formatDate(first,'yyyy-MM-dd','fr');
          this.pdfList.push(new ListPdf(dateString, this.projet.code_projet, '0'));
          first.setDate(first.getDate()+1);
      }
      console.log("iciiii ",this.pdfList)
  }
  makePdf(){
    console.log("projet ---> ",this.projet);
    let pdf = new jsPDF('p','pt','a4');
    pdf.html(this.el.nativeElement,{
      callback:(pdf) => {
        pdf.save("projet.pdf");
      }
    });
  }

  chargerProjet(){
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.getPdF(this.firstDayString,this.lastDayString,this.projet.code_projet,'99');
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse,'ppppppppppppppppppppppppppp');
        this.pdf = reponse.result;

      }
      else{
        console.log("Erreur de requete de base de données");
      }

    });
  }
}
