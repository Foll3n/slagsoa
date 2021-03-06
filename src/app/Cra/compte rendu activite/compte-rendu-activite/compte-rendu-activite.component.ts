import {AfterViewInit, Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Cra} from '../../models/cra/Cra';
import {CompteRendu} from '../../models/compteRendu/CompteRendu';
import {Subscription} from 'rxjs';
import {CraService} from '../../../services/cra.service';
import {NgbCarousel, NgbCarouselConfig, NgbSlideEvent, NgbSlideEventSource} from '@ng-bootstrap/ng-bootstrap';
import {CraWeek} from '../../models/cra/craWeek';
import {Commande} from '../../models/commande/Commande';
import {UserService} from '../../../services/user.service';
import {Realisation} from '../../models/realisation/Realisation';
import {CraWaitingService} from '../../../services/craWaiting.service';
import {environment, hexToRGB, isDatesEqual} from '../../../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {CommandeService} from '../../../services/commande.service';
import {ProjetService} from '../../../services/projet.service';
import {JoursferiesService} from '../../../services/joursferies.service';

@Component({
  selector: 'app-compte-rendu-activite',
  templateUrl: './compte-rendu-activite.component.html',
  styleUrls: ['./compte-rendu-activite.component.scss'],
  styles: [`
    /deep/ .carousel-item.active {
      border: none;
    }`, `
    /deep/ .carousel {
      outline: none;
    }`, `

    /deep/ .carousel-indicators > li {
      background-color: #97C8E2;
      box-sizing: content-box;
      flex: 0 1 auto;
      width: 30px;
      height: 20px;
      border-radius: 20px;
      margin-right: 3px;
      margin-left: 3px;
      text-indent: -999px;
      cursor: pointer;
      background-clip: padding-box;
      border-top: 10px solid transparent;
      border-bottqdom: 10px solid transparent;
      opacity: .5;
      transition: opacity .6s ease;

    }`,
    `
      /deep/ .carousel-indicators {
        position: absolute;
        top: -80px;
        height: 20px;
        margin-top: 40px;


      }`
  ]
})
export class CompteRenduActiviteComponent implements OnInit {
  // @ViewChild(NgbCarousel) myCarousel!: NgbCarousel ;
  @ViewChild('carousel', {static: false}) myCarousel: NgbCarousel | undefined;

  // tslint:disable-next-line:typedef
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.keyDown(event);
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.myCarousel!.select(this.currentSlide);
  //   });
  // }
  craWeek!: CraWeek[];
  selectedWeek = -1;
  currentSlide!: string;
  // @Input()
  // date!: number;
  listeCraSubscription!: Subscription;
  listeCrSubscription!: Subscription;
  firstDate = '';
  lastDate = '';
  listeCommande: Commande[] = [];
  listeRealisations: Realisation[] = [];
  realisationSubscription!: Subscription;
  commandeSubscription!: Subscription;
  listeAddCommande: Map<string, Commande[]> = new Map();
  minWidth = environment.minWidth;
  givenDate!: Date;
  jourFerieSubscription!: Subscription;
  listeJoursFeries: Date[] = [];

  public get width() {
    return window.innerWidth;
  }

  constructor(private jourFerie: JoursferiesService, private projetService: ProjetService, private commandeService: CommandeService, public craService: CraService, private craWaintingService: CraWaitingService, private userService: UserService, config: NgbCarouselConfig, private route: ActivatedRoute) {
    config.interval = 0;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = true;
    // r??cup??ration des jours de cong??s
    this.jourFerieSubscription = this.jourFerie.joursSubject.subscribe((jours: Date[]) => this.listeJoursFeries = jours);
    this.jourFerie.emitJoursFeriesSubject();

    this.realisationSubscription = this.userService.realisationsSubject.subscribe(
      (realisations: Realisation[]) => {
        this.listeRealisations = realisations;
        this.update();
      });
    this.route.params.subscribe(params => {
      this.currentSlide = '';
      this.givenDate = params.date;
      this.selectedWeek = -1;
      if (this.givenDate) {
        this.craService.initialisation(new Date(this.givenDate));
      } else {
        this.craService.initialisation(new Date());
      }
      this.listeCraSubscription = this.craService.craSubject.subscribe(
        (craWeek: CraWeek[]) => {
          this.craWeek = craWeek; ///////////////////////////////////////////////////////////////////////////////// a check ici je comprends pas
          if (this.selectedWeek == -1) {
            this.selectedWeek = this.craService.currentSlide;
          }
          this.currentSlide = 'ngb-slide-' + this.selectedWeek.toString();
          // this.myCarousel!.select(this.currentSlide);
          // this.activeIndex = this.selectedWeek;
          // this.update();
          this.userService.emitRealisationSubject();
        });

      this.craService.emitCraSubject();
    });
    // craService.initialisation(new Date());
  }

  ngOnInit() {
    // if(this.givenDate)this.craService.initialisation(this.givenDate);
    // this.craService.emitCraSubject();
    this.userService.refreshRealisationsUser();
  }

  hexToRGB(hex: string, alpha: string) {

    return hexToRGB(hex, alpha);
  }

  getColor(projetName: string) {
    return this.projetService.getColor(projetName);
  }

  keyDown($event: Event) {

    const event = ($event) as KeyboardEvent;
    if (event.key === 'ArrowLeft' || event.key === 'q') {
      // tslint:disable-next-line:no-non-null-assertion
      this.myCarousel!.prev();
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
      // tslint:disable-next-line:no-non-null-assertion
      this.myCarousel!.next();
    }

  }

  /**
   * R??cup??re une commande pr??cise r??alis??e par un utilisateur
   * @param num
   */
  public getCommandeById(num: string): Realisation {
    const commande = this.listeRealisations.find(
      (real) => real.num_commande === num);
    return commande as Realisation;
  }

  /**
   * Fonction permettant de v??rifier si la r??alisation d'un utilisateur est dans la liste des commandes et que la commande est dispo
   * @param num_com
   */
  checkRelInListeCommande(real: Realisation): Commande | null {
    if (this.listeCommande) {
      for (const com of this.listeCommande) {
        if (com.id === real.id) {
          return com;
        }
      }

    }
    return null;
  }

  /**
   * Permet de renvoyer la liste des commandes possible ?? ajouter pour un utilisateur dans sa semaine ( c'est ?? dire qu'il n'est pas d??ja en train de la r??aliser )
   */
  getAvailableCommande() {
    this.listeAddCommande = new Map();
    for (const real of this.listeRealisations) {
      const com = this.checkRelInListeCommande(real);
      if (!com) // listeCommande est la liste des commandes d'un cra
      {
        const projetId = this.commandeService.getProjetId(real.id);
        const projetName = this.getProjetName(projetId);
        const commande = new Commande(real.num_commande, projetId, real.id, 'true', real.color); //ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
        let check = this.listeAddCommande.get(projetName);
        if (check) {
          check.push(commande);
        } else {
          this.listeAddCommande.set(projetName, [commande]);
        }
      }
    }
  }

  getProjetName(id: string) {
    return this.projetService.getNameProjet(id);
  }

  /**
   * renvoie la liste des commandes d'une semaine de cra
   */
  initListeCommandes() {

    this.listeCommande = this.craWeek[this.selectedWeek].listeCommandesWeek;

  }

  /**
   Met ?? jour la date de d??but de semaine et de fin de semaine afin de les afficher au dessus de mon calendrier
   */
  initDates() {
    this.firstDate = this.craWeek[this.selectedWeek].firstDate;
    this.lastDate = this.craWeek[this.selectedWeek].lastDate;
  }


  /**
   * Ajoute un compte rendu (appel API) -> ajoute une ligne dans mon emploi du temps ?? la semaine d'une commande pr??cise
   * @param com
   */
  addSousProjet(com: Commande): void { ///////////////////////////////////////////////
    // @ts-ignore
    // this.craService.getCraToServer();
    // this.craService.addCraServer();
    if (!com.color) {
      com.color = '';
    }
    const commande = new Commande(com.num_com, com.id_projet, com.id, 'true', com.color);    // id -> 1 ou id 2 pour le projet pour le moment et 2/5 pour id commande
    this.craService.addCr(new CompteRendu(0, com.id, 0.0, com.color), this.selectedWeek, commande);

  }

  /**
   * Renvoie la date du jour actuel
   */
  getDay(): Date {
    return new Date();
  }

  /**
   * Renvoie la date du jour sous forme de string que l'on utilise tout en haut de la page pour afficher la date du jour actuel
   */
  getDateToday(): string {
    return this.afficherjour(this.getDay().getDay()) + ' ' + this.craService.getDateToday();
  }


  // select(slideId: string, source: NgbSlideEventSource){
  // }
  /**
   * Appuie sur le bouton enregistrer de notre IHM
   */
  push() {

    this.craService.saveCra(this.selectedWeek);
  }


  /**
   * Permet de supprimer tous les cras d'une semaine mais ne s'utilisera jamais
   */
  delete() {
    this.craService.supprimer(this.selectedWeek);
  }

  /**
   * Permet d'??diter un cran pr??cis mais jamais utilis?? car ce n'est pas le cra en lui meme que nous ??ditons
   * @param cra
   */
  onEdit(cra: Cra) {
    this.craService.editCra(cra, this.selectedWeek);
  }

  /**
   * Permet d'afficher le jour en fran??ais plut??t que sous forme de num??ro
   * @param day
   */
  afficherjour(day: number): string {
    return ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][day];
  }


  /**
   * Fonction appel??e lors du slide du caroussel qui permet de s??lectionner le cra de la semaine dans la liste
   * @param $event
   */
  onSlide($event: NgbSlideEvent) {
    let res = ($event.current.split('-').pop());
    if (res) {
      this.selectedWeek = +res;
    }


    this.update();
  }

  /**
   * Fonction permettant d'initialiser les commandes Disponibles dans la semaine ainsi que d'initialiser les dates de la semaine
   */
  update() {
    this.initDates();
    this.initListeCommandes();
    this.getAvailableCommande();


    //this.craService.emitCraSubject();
  }

  /**
   * permet ?? l'utilisateur de valider sa semaine elle sera donc envoy?? aux administrateurs afin qu'ils la valident d??finitivement
   */
  save() {
    this.push();
    this.craService.setStatusUser(this.selectedWeek, '1');

  }

  /**
   * Est ce que la semaine est correctement remplie ? c'est ?? dire que chaque jour ?? une dur??e totale ?? 1
   */
  canUpdateStatus() {
    for (const cra of this.craWeek[this.selectedWeek].listeCra) {
      if ((cra.duree_totale < (1 - cra.statusConge) && !this.isFerie(cra.date)) || (cra.duree_totale > (1 - cra.statusConge) && !this.isFerie(cra.date))) {
        return false;
      }
    }
    return true;
  }

  isFerie(date: Date) {
    return this.listeJoursFeries.find(d => isDatesEqual(d, date));
  }

  /**
   * Permet de ne pas afficher le bouton si le status est valid??
   */
  seeButton() {
    return this.craWeek[this.selectedWeek].status === '0';

  }

  /**
   * permet de renvoyer le status du cra ?? la semaine afin de g??rer l'affichage en fonction de son status
   */
  seeMessage() {
    return +this.craWeek[this.selectedWeek].status;
  }
}
