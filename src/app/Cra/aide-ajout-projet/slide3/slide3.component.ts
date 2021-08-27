import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Message} from '../../models/message';
import {Responsable} from '../../models/responsable/responsable';
import {Projet} from '../../models/projet/Projet';
import {FormControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {environment, resetForm, shortMessage} from '../../../../environments/environment';
import {Subscription} from 'rxjs';
import {ResponsableService} from '../../../services/responsable.service';
import {ProjetService} from '../../../services/projet.service';


@Component({
  selector: 'app-slide3',
  templateUrl: './slide3.component.html',
  styleUrls: ['./slide3.component.scss']
})
export class Slide3Component implements OnInit {
  @Output() eventItem = new EventEmitter<Projet>();
  @Output() eventBack = new EventEmitter();
  lengthProjetCode = environment.lengthProjetCode;
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
    });
    this.projetService.ajout.subscribe(
      (isAdd: boolean) => {
        shortMessage(this.valueAdd, 'projet ajouté');

      });

  }

  ngOnInit(): void {
    this.projetService.emitProjetSubject();
  }

  /**
   * Ajoute un projet grâce au service projetService ce qui permet d'avoir à tous moment la liste des projets
   */
  addProjet(formDirective: FormGroupDirective) {

    const projet = new Projet(this.projet.get('code_projet')?.value, this.color, '', this.projet.get('modeRealisation')?.value, 'true', ''); //mis en brut
    this.eventItem.emit(projet);
  }

  projetNotPresent() {
    if (this.listeProjets.find(p => p.code_projet === this.projet.get('code_projet')?.value)) {
      return true;
    }
    return false;
  }


}
