import {Component, OnInit, ViewChild} from '@angular/core';
import {Projet} from '../../../models/projet/Projet';
import {ProjetService} from '../../../../services/projet.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-administration-projet',
  templateUrl: './administration-projet.component.html',
  styleUrls: ['./administration-projet.component.scss']
})
/**
 * composant comprotant un tab group permettant de vaviguer de droite à gauche
 */
export class AdministrationProjetComponent implements OnInit {
  listeProjets!: Projet[];
  listeProjetSubscription!: Subscription;
  color = '';

  constructor(private projetService: ProjetService) {
    // this.tabGroup.selectedIndex = 3; // si' l'on souhaite sélectionner de base un autre onglet que le premier
  }

  /**
   * initalisation
   */
  ngOnInit(): void {
    this.listeProjetSubscription = this.projetService.projetSubject.subscribe(
      (projets: Projet[]) => {
        this.listeProjets = projets;
      });
  }

  /**
   * Retourne la taille de la fenêtre actuelle
   */
  public get width() {
    return window.innerWidth;
  }

}
