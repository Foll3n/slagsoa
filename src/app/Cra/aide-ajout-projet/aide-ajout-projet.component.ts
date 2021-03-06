import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgbCarousel, NgbCarouselConfig, NgbSlideEvent} from '@ng-bootstrap/ng-bootstrap';
import {Client} from '../models/client/Client';
import {Responsable} from '../models/responsable/responsable';
import {Projet} from '../models/projet/Projet';
import {environment} from '../../../environments/environment';
import {Commande} from '../models/commande/Commande';
import {Utilisateur} from '../../Modeles/utilisateur';

@Component({
  selector: 'app-aide-ajout-projet',
  templateUrl: './aide-ajout-projet.component.html',
  styleUrls: ['./aide-ajout-projet.component.scss'],
  styles: [`
    /deep/ .carousel-item.active {
      border: none;
    }`, `
    /deep/ .carousel {
      outline: none;
    }`
  ]
})
export class AideAjoutProjetComponent implements OnInit, OnChanges {
  @ViewChild('caroussel2') myCarousel: NgbCarousel | undefined;

  numeroPage = 0;
  client!: Client;
  responsable!: Responsable;
  projet!: Projet;
  listeCommandes: Commande[] = [];
  mapUserCom: Map<string, Utilisateur[]> = new Map();
  minWidth = environment.minWidth;

  constructor(config: NgbCarouselConfig) {

    config.interval = 0;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = false;
    config.animation = true;
  }

  ngOnInit(): void {
  }

  setClient(event: Client) {
    console.log(event, 'èèèèèèèèèèèèèèèèèèèèè');
    const c = event as Client;
    this.client = new Client(c.idClient, c.nomSociete, c.adresse, c.mail, c.siret);
    console.log('client dans le pere:', this.client);
    this.myCarousel?.next();
  }

  setListeCom(commandes: Commande[]) {
    this.listeCommandes = commandes;
    if (commandes.length == 0) {
      console.log('je ravance');
      this.myCarousel!.select('ngb-slide-5');
    } else {
      this.myCarousel?.next();
    }
  }

  setComUser(map: Map<string, Utilisateur[]>) {
    console.log('map -> ', map);
    this.mapUserCom = map;
    this.myCarousel?.next();
  }

  setResponsable(event: Responsable) {
    const c = event as Responsable;
    this.responsable = c;
    console.log('responsable dans le pere:', this.responsable);
    this.myCarousel?.next();
  }

  setProjet(event: Projet) {
    console.log('projet ! :', event);
    this.projet = event;
    this.myCarousel?.next();
  }

  public get width() {
    return window.innerWidth;
  }

  onSlide($event: NgbSlideEvent) {

    let res = ($event.current.split('-').pop());
    if (res) {
      this.numeroPage = +res;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('on changes de aide ajout projet');
  }
}
