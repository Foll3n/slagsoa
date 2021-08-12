import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ListPdf} from '../../../../../models/projet/ListPdf';
import {Pdf} from '../../../../../models/projet/Pdf';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-pdf-conteneur',
  templateUrl: './pdf-conteneur.component.html',
  styleUrls: ['./pdf-conteneur.component.scss']
})
export class PdfConteneurComponent implements OnInit, AfterViewInit {
  @ViewChild('content', {static:false}) el!: ElementRef
  @Input()
  ligne!:ListPdf[];
  @Input()
  pdf!:Pdf;
  constructor() {

  }


  makePdf(){

    let pdf = new jsPDF('p','pt','a4');
    pdf.html(this.el.nativeElement,{
      callback:(pdf) => {
        pdf.save("projet.pdf");
      }
    });
  }

  ngAfterViewInit(): void {
    this.makePdf();
  }

  ngOnInit(): void {
  }
}
