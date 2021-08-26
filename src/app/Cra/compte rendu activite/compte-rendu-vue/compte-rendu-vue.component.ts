import {Component, Input, OnInit} from '@angular/core';
import {CraService} from '../../../services/cra.service';
import {Subscription} from 'rxjs';
import {CraWeek} from '../../models/cra/craWeek';
import {Commande} from '../../models/commande/Commande';
import {environment} from '../../../../environments/environment';
import {ProjetService} from '../../../services/projet.service';
import {JoursferiesService} from '../../../services/joursferies.service';

@Component({
  selector: 'app-compte-rendu-vue',
  templateUrl: './compte-rendu-vue.component.html',
  styleUrls: ['./compte-rendu-vue.component.scss']
})
export class CompteRenduVueComponent implements OnInit {
  @Input()
  index!: number;
  @Input()
  craWeek!: CraWeek;
  minWidth = environment.minWidth;
  listeCraSubscription!: Subscription;
  listeCommande: Commande[] = [];
  jourFerieSubscription!: Subscription;
  listeJoursFeries: Date[] = [];

  constructor(private jourFerie: JoursferiesService, public craService: CraService, private projetService: ProjetService) {
    this.jourFerieSubscription = this.jourFerie.joursSubject.subscribe((jours: Date[]) => this.listeJoursFeries = jours);
    this.jourFerie.emitJoursFeriesSubject();
  }

  /**
   * récupère la taille de la fenetre
   */
  public get width() {
    return window.innerWidth;
  }

  /**
   * Renvoie true si on peut supprimer la ligne
   */
  canDelete() {
    return this.craWeek.status === '0';
  }

  ngOnInit() {
  }

  isFerie(date: Date) {
    return this.listeJoursFeries.find(d => this.isDatesEqual(d, date));
  }

  isDatesEqual(date1: Date, date2: Date) {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  /**
   * renvoie le status d'une semaine de cra
   */
  getStatus() {
    return +this.craWeek.status;
  }

  /**
   * renvoie la date du jour actuel
   */
  getDay(): Date {
    return new Date();
  }

  /**
   * Appel API plus au service pour supprimer une ligne dans notre cra à la semaine (c'est à dire supprimer une commande)
   * * @param commande
   */
  deleteLine(commande: Commande) {
    this.craService.deleteLineToServer(commande, this.index);
  }

  /**
   * Afficher le jour en francais
   * @param day
   */
  afficherjour(day: number): string {
    return ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][day];
  }

  getProjetName(id: string) {
    return this.projetService.getNameProjet(id);
  }

  LightenDarkenColor(col: string, amt: number) {
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    var b = ((num >> 8) & 0x00FF) + amt;
    var g = (num & 0x0000FF) + amt;
    var newColor = g | (b << 8) | (r << 16);
    return '#' + newColor.toString(16);
  }
}
