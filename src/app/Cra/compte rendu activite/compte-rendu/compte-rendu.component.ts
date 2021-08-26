import {Component, Input, OnInit} from '@angular/core';
import {CraService} from '../../../services/cra.service';
import {Cra} from '../../models/cra/Cra';

@Component({
  selector: 'app-compte-rendu',
  templateUrl: './compte-rendu.component.html',
  styleUrls: ['./compte-rendu.component.scss']
})
export class CompteRenduComponent implements OnInit {
  @Input()
  cra!: Cra;
  @Input()
  duree!: number;
  @Input()
  color!: string;
  @Input()
  index!: number;
  @Input()
  idCra!: number;
  @Input()
  indexWeek!: number;
  @Input()
  nomSp!: string;
  @Input()
  status!: number;
  isInsideComponent = false;
  dureeString: string = '';

  constructor(private craService: CraService) {

  }

  ngOnInit(): void {
    this.dureeString = this.duree.toString();
    if (this.dureeString == '0') {
      this.dureeString = '';
    }
  }

  /**
   * Fonction appelée lorsque l'on modifie une case de notre emploi du temps à la semaine
   */
  onModifyCase() {
    // console.log(this.indexWeek,'<---------');
    this.craService.editCraDuree(this.idCra, +this.dureeString, this.index, this.indexWeek);
    // this.craService.getCraById(this.idCra, this.indexWeek);
  }

  /**
   * retourne la durée totale d'un compte rendu
   */
  checkDureeTotale() {
    return this.cra.duree_totale < (1 - this.cra.statusConge);
  }

  /**
   * renvoie la couleur de la case actuelle
   */
  getColor() {
    return this.color;
  }

  /**
   * Permet de mettre la durée d'une case à 1
   */
  setDureeToOne() {
    console.log('indeeeeeeeeexxxxxxxxxxx', this.indexWeek);
    const duree = this.craService.getDureeTotaleCra(this.idCra, this.indexWeek);
    this.dureeString = ((1 - this.cra.statusConge) - duree).toPrecision(1).toString();
    this.onModifyCase();
  }
}
