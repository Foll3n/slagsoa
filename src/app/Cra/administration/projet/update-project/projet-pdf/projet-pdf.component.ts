import {Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import { jsPDF } from "jspdf";
import {Projet} from '../../../../models/projet/Projet';
import {ActivatedRoute} from '@angular/router';
import {ProjetHttpDatabase} from '../../../../../configuration-http/ProjetHttpDatabase';
import {HttpClient} from '@angular/common/http';
import {formatDate} from '@angular/common';
import {Pdf} from '../../../../models/projet/Pdf';
@Component({
  selector: 'app-projet-pdf',
  templateUrl: './projet-pdf.component.html',
  styleUrls: ['./projet-pdf.component.scss']
})
export class ProjetPdfComponent implements OnInit {
  @ViewChild('content', {static:false}) el!: ElementRef
  firstDay!:string;
  lastDay!:string;
  pdf!:Pdf;

  projet!: Projet;
  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.firstDay = formatDate(new Date(y, m, 1),'yyyy-MM-dd','fr');
    this.lastDay = formatDate(new Date(y, m + 1, 0),'yyyy-MM-dd','fr');
  }

  ngOnInit(): void {
    this.projet = this.route.snapshot.queryParams as Projet;
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    console.log(this.projet, this.firstDay,this.lastDay);
    this.chargerProjet();
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
    const response = projetHttp.getPdF(this.firstDay.toString(),this.lastDay.toString(),this.projet.code_projet,'99');
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
