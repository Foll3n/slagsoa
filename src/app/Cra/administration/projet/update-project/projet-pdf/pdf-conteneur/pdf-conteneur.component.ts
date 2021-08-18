import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ListPdf} from '../../../../../models/projet/ListPdf';
import {Pdf} from '../../../../../models/projet/Pdf';
import jsPDF, {Html2CanvasOptions} from 'jspdf';
import {Utilisateur} from '../../../../../../Modeles/utilisateur';
import html2canvas from 'html2canvas';
import {UtilisateurSimple} from '../../../../../../Modeles/utilisateurSimple';
@Component({
  selector: 'app-pdf-conteneur',
  templateUrl: './pdf-conteneur.component.html',
  styleUrls: ['./pdf-conteneur.component.scss']
})
export class PdfConteneurComponent implements OnChanges {
  @ViewChild('content', {static: false}) el!: ElementRef;
  @Input()
  ligne!: ListPdf[];
  @Input()
  pdf!: Pdf;
  @Input()
  user!: UtilisateurSimple;
  @Input()
  generate!: boolean;
  currentDate!:string;
  constructor() {
    this.currentDate = formatDate(new Date(),'dd-MM-yyyy','fr');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("je change dans pdf", this.user, this.ligne);
    this.makePdf();
  }
  getDayElem(elem: ListPdf){
    return formatDate(elem.date,'EE','fr');

  }
  getDateElem(elem:ListPdf){
    return formatDate(elem.date,'dd / MM / yyyy','fr');
  }
  sommeDuree(){
    let res = 0;
    for(const e of this.ligne){
      res += +e.duree;
    }
    return res.toPrecision(3);
  }
  getDuree(elem:ListPdf){
    let duree = elem.duree;

    duree = duree.replace('.0','');
    return duree + ' jours';
  }
  makePdf(){
    if(this.generate)
      this.openPDF();
    // let pdf = new jsPDF('p','pt','a4');
    // pdf.html(this.el.nativeElement,{
    //   callback:(pdf) => {
    //     pdf.save("projet.pdf");
    //   }
    // })

  }
  public openPDF():void {
    let DATA = document.getElementById('display');

    if (DATA) {
      html2canvas(DATA).then(canvas => {

        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;

        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);

        PDF.save('test.pdf');
      });
    }
  }

  ngOnInit(): void {
  }
}

import {formatDate} from '@angular/common';
