import { Component, OnInit } from '@angular/core';
import {Projet} from '../../../models/projet/Projet';
import {ProjetService} from '../../../../services/projet.service';
import {FormControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {resetForm, shortMessage} from '../../../../../environments/environment';
import {Subscription} from "rxjs";
import {Message} from '../../../models/message';
import {ResponsableService} from '../../../../services/responsable.service';
import {Responsable} from '../../../models/responsable/responsable';

@Component({
  selector: 'app-add-projet',
  templateUrl: './add-projet.component.html',
  styleUrls: ['./add-projet.component.scss']
})

/**
 * Ajout d'un nouveau projet avec une couleur
 */
export class AddProjetComponent implements OnInit {
  projet!: FormGroup;
  color = '#B6E0F7';
  isAdd = false;
  modeRealisations: string[] = ['forfait', 'regie'];
  isAddSubscription!: Subscription;
  projetSubscription!: Subscription;
  listeProjets: Projet[] = [];
  listeResponsables: Responsable[] = [];
  valueAdd: Message = new Message('');

  constructor(private projetService: ProjetService, private responsableService: ResponsableService) {
    this.projetService.projetSubject.subscribe((projets: Projet[]) => this.listeProjets = projets);
    this.responsableService.responsablesSubject.subscribe((responsables: Responsable[]) => this.listeResponsables = responsables);

    this.projet = new FormGroup({
      code_projet: new FormControl(),
      color: new FormControl(),
      modeRealisation: new FormControl(),
      responsable : new FormControl()
    });
    this.projetService.ajout.subscribe(
    (isAdd: boolean) => {
      shortMessage(this.valueAdd,'projet ajouté');

    });

  }

  ngOnInit(): void {
  }

  /**
   * Ajoute un projet grâce au service projetService ce qui permet d'avoir à tous moment la liste des projets
   */
  addProjet(formDirective: FormGroupDirective){
    let projet = new Projet(this.projet.get('code_projet')?.value,this.color,'', this.projet.get('modeRealisation')?.value, 'true',this.projet.get('responsable')?.value); //mis en brut
    console.log(this.listeProjets);
    if (this.listeProjets.find(p => p.code_projet === projet.code_projet)){
      shortMessage(this.valueAdd,'Projet déja présent');
    }
    else{
      this.projetService.addProjet(projet);
    }

      resetForm(this.projet);
    formDirective.resetForm();

  }




}
