import {Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import { jsPDF } from "jspdf";
import {Projet} from '../../../../models/projet/Projet';
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-projet-pdf',
  templateUrl: './projet-pdf.component.html',
  styleUrls: ['./projet-pdf.component.scss']
})
export class ProjetPdfComponent implements OnInit {
  @ViewChild('content', {static:false}) el!: ElementRef

  projet!: Projet;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.projet = this.route.snapshot.queryParams as Projet;
    console.log(this.projet);
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
}
