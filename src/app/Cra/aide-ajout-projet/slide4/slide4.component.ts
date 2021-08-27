import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {Commande} from '../../models/commande/Commande';
import {environment, resetForm} from '../../../../environments/environment';

@Component({
  selector: 'app-slide4',
  templateUrl: './slide4.component.html',
  styleUrls: ['./slide4.component.scss']
})
export class Slide4Component implements OnInit {
  @Output() listeCom = new EventEmitter<Commande[]>();
  @Output() eventBack = new EventEmitter();
  lengthComNum = environment.lengthComNum;
  commandes!: FormGroup;
  listeCommandes: Commande[] = [];

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
    let isPresent = this.listeCommandes.find(c => c.num_com == this.commandes.get('num_com')?.value);
    if (!isPresent){
      const commande = new Commande(this.commandes.get('num_com')?.value, '','', 'true',''); //mis en brut
      this.listeCommandes.push(commande);
      formDirective.resetForm();
      resetForm(this.commandes);
    }

  }
  retirerCom(commande:Commande){
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
