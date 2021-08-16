import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {Projet} from '../../models/projet/Projet';
import {CommandeInsert} from '../../models/commande/CommandeInsert';
import {CraWeekInsert} from '../../models/logCra/craWeekInsert';
import {resetForm} from '../../../../environments/environment';

@Component({
  selector: 'app-slide4',
  templateUrl: './slide4.component.html',
  styleUrls: ['./slide4.component.scss']
})
export class Slide4Component implements OnInit {
  @Output() listeCom = new EventEmitter<CommandeInsert[]>();
  commandes!: FormGroup;
  listeCommandes: CommandeInsert[] = [];

  constructor() {
    this.commandes = new FormGroup({
      num_com: new FormControl()
    });
  }

  ngOnInit(): void {
  }
  /**
   * Ajoute une commande a un projet
   */
  addCommandesList(formDirective: FormGroupDirective){
    const commande = new CommandeInsert(this.commandes.get('num_com')?.value, '','', 'true',''); //mis en brut
    this.listeCommandes.push(commande);
    formDirective.resetForm();
    resetForm(this.commandes);
  }
  retirerCom(commande:CommandeInsert){
    const c = this.listeCommandes.find(
      (c) => c.num_com === commande.num_com);
    if (c){
      const index = this.listeCommandes.indexOf(c, 0);
      this.listeCommandes.splice(index, 1);
    }
  }
  addCommandes(){
    console.log(this.listeCommandes);
    this.listeCom.emit(this.listeCommandes);
  }

}
