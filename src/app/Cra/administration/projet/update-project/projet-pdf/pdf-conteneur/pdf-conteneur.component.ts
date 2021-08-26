import {EventEmitter, Component, ElementRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ListPdf} from '../../../../../models/projet/ListPdf';
import {Pdf} from '../../../../../models/projet/Pdf';
import {UtilisateurSimple} from '../../../../../../Modeles/utilisateurSimple';

@Component({
  selector: 'app-pdf-conteneur',
  templateUrl: './pdf-conteneur.component.html',
  styleUrls: ['./pdf-conteneur.component.scss']
})
export class PdfConteneurComponent {
  @Output() eventItem = new EventEmitter();
  @ViewChild('content', {static: false}) el!: ElementRef;
  @Input()
  ligne!: ListPdf[];
  @Input()
  pdf!: Pdf;
  @Input()
  user!: UtilisateurSimple;
  currentDate!: string;

  constructor() {
    this.currentDate = formatDate(new Date(), 'dd-MM-yyyy', 'fr');
  }

  /**
   * lorsque les paramètres d'entrée changent j'essaye de générer le pdf
   * @param changes
   */

  getDayElem(elem: ListPdf) {
    return formatDate(elem.date, 'EE', 'fr');
  }

  getMonth() {
    return formatDate(new Date(), 'MMMM_yyyy', 'fr');
  }

  getDateElem(elem: ListPdf) {
    return formatDate(elem.date, 'dd / MM / yyyy', 'fr');
  }

  /**
   * renvoie la durée totale des activités de l'utilisateur pour l'entreprise au cours du mois
   */
  sommeDuree() {
    let res = 0;
    for (const e of this.ligne) {
      res += +e.duree;
    }
    return res.toPrecision(3);
  }

  /**
   * remplace .0 d'un jour par vide ce qui donne 0.0 jours -> 0 jours
   * @param elem
   */
  getDuree(elem: ListPdf) {
    let duree = elem.duree;
    duree = duree.replace('.0', '');
    return duree + ' jours';
  }


  ngOnInit(): void {
  }
}

import {formatDate} from '@angular/common';
