import {Component, OnInit, ViewChild} from '@angular/core';
import {CraHttpDatabase} from '../../../../configuration-http/CraHttpDatabase';
import {ProjetHttpDatabase} from '../../../../configuration-http/ProjetHttpDatabase';
import {HttpClient} from '@angular/common/http';
import {Projet} from '../../../models/projet/Projet';
import {ProjetService} from '../../../../services/projet.service';
import {CraWeek} from '../../../models/cra/craWeek';
import {Subscription} from 'rxjs';
import {MatTabGroup} from '@angular/material/tabs';

@Component({
  selector: 'app-administration-projet',
  templateUrl: './administration-projet.component.html',
  styleUrls: ['./administration-projet.component.scss']
})
export class AdministrationProjetComponent implements OnInit {
  // @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  listeProjets!: Projet[];
  listeProjetSubscription!: Subscription;
  color = '';
  constructor(private projetService: ProjetService) {
    // this.tabGroup.selectedIndex = 3;
  }

  ngOnInit(): void {
    this.listeProjetSubscription = this.projetService.projetSubject.subscribe(
      (projets: Projet[]) => {this.listeProjets = projets;
      });
  }

  /**
   * Retourne la taille de la fenêtre actuelle
   */
  public get width() {
    return window.innerWidth;
  }



}
