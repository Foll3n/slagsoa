import {AfterViewInit, Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Cra} from '../../models/cra/Cra';
import {CompteRendu} from '../../models/compteRendu/CompteRendu';
import {Subscription} from 'rxjs';
import {CraService} from '../../../services/cra.service';
import {NgbCarousel, NgbCarouselConfig, NgbSlideEvent, NgbSlideEventSource} from '@ng-bootstrap/ng-bootstrap';
import {CraWeek} from '../../models/cra/craWeek';
import {CommandeInsert} from '../../models/commande/CommandeInsert';
import {UserService} from '../../../services/user.service';
import {Realisation} from '../../models/realisation/Realisation';
import {CraWaitingService} from "../../../services/craWaiting.service";
import {environment} from '../../../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {CommandeService} from '../../../services/commande.service';
import {ProjetService} from '../../../services/projet.service';

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

    /deep/  .carousel-indicators> li {
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
      /deep/  .carousel-indicators {
        position: absolute;
        top : -80px;
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
  craWeek!: CraWeek[] ;
  selectedWeek = -1;
  currentSlide!:string;
  // @Input()
  // date!: number;
  listeCraSubscription!: Subscription;
  listeCrSubscription!: Subscription;
  firstDate = '';
  lastDate = '';
  listeCommande: CommandeInsert[] = [];
  listeRealisations: Realisation[] = [];
  realisationSubscription!: Subscription;
  listeAddCommande: CommandeInsert[] = [];
  minWidth = environment.minWidth;
  givenDate!: Date;

  public get width() {
    return window.innerWidth;
  }
  constructor(private projetService : ProjetService, private commandeService: CommandeService, public craService: CraService, private craWaintingService: CraWaitingService, private userService: UserService, config: NgbCarouselConfig, private route: ActivatedRoute) {
    config.interval = 0;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = true;

    this.route.params.subscribe(params => {
      console.log("je rentre dans les params");
      this.currentSlide = '';
      this.givenDate = params.date;
      if (this.givenDate) {
        this.craService.initialisation(new Date(this.givenDate));
      } else {
        this.craService.initialisation(new Date());
      }

      this.listeCraSubscription = this.craService.craSubject.subscribe(
        (craWeek: CraWeek[]) => {this.craWeek = craWeek;
          if (this.selectedWeek==-1)
          this.selectedWeek = this.craService.currentSlide;
          this.currentSlide = 'ngb-slide-' + this.selectedWeek.toString();
          // this.myCarousel!.select(this.currentSlide);
          // this.activeIndex = this.selectedWeek;
          // this.update();
          this.userService.emitRealisationSubject();
        });
      this.realisationSubscription = this.userService.realisationsSubject.subscribe(


        (realisations: Realisation[]) => {this.listeRealisations = realisations;
          this.update();
        });

      this.craService.emitCraSubject();

    });
    // craService.initialisation(new Date());
  }
  ngOnInit(){
    // if(this.givenDate)this.craService.initialisation(this.givenDate);

  }

  keyDown($event: Event){

    const event = ($event) as KeyboardEvent;
    console.log(event.key);
    if ( event.key === 'ArrowLeft' || event.key === 'q') {
      // tslint:disable-next-line:no-non-null-assertion
      this.myCarousel!.prev();
    }
    else if ( event.key === 'ArrowRight' || event.key === 'd') {
      // tslint:disable-next-line:no-non-null-assertion
      this.myCarousel!.next();
    }

  }
  /**
   * Récupère une commande précise réalisée par un utilisateur
   * @param num
   */
  public getCommandeById(num: string): Realisation {
    const commande = this.listeRealisations.find(
      (real) => real.num_commande === num);
    return commande as Realisation;
  }

  /**
   * Fonction permettant de vérifier si la réalisation d'un utilisateur est dans la liste des commandes et que la commande est dispo
   * @param num_com
   */
  checkRelInListeCommande(real: Realisation): CommandeInsert | null{
    if (this.listeCommande){
      for (const com of this.listeCommande){
        if (com.id === real.id ){
          return com;
        }
      }

    }
    return null;
  }

  /**
   * Permet de renvoyer la liste des commandes possible à ajouter pour un utilisateur dans sa semaine ( c'est à dire qu'il n'est pas déja en train de la réaliser )
   */
  getAvailableCommande(){
    this.listeAddCommande = [];
    for (const real of this.listeRealisations ){
      let com = this.checkRelInListeCommande(real);
      if (!com) // listeCommande est la liste des commandes d'un cra
      {
        let projetId = this.commandeService.getProjetId(real.id);
        const commande = new CommandeInsert(real.num_commande, projetId , real.id, 'true', real.color); //ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
        this.listeAddCommande.push(commande);

      }
    }
  }
  getProjetName(id:string){
    return this.projetService.getNameProjet(id);
  }
  /**
   * renvoie la liste des commandes d'une semaine de cra
   */
  initListeCommandes(){

    this.listeCommande = this.craWeek[this.selectedWeek].listeCommandesWeek;

  }
  /**
   Met à jour la date de début de semaine et de fin de semaine afin de les afficher au dessus de mon calendrier
   */
  initDates(){
    this.firstDate = this.craWeek[this.selectedWeek].firstDate;
    this.lastDate = this.craWeek[this.selectedWeek].lastDate;
  }


  /**
   * Ajoute un compte rendu (appel API) -> ajoute une ligne dans mon emploi du temps à la semaine d'une commande précise
   * @param com
   */
  addSousProjet(com: CommandeInsert): void { ///////////////////////////////////////////////
    // @ts-ignore
    // this.craService.getCraToServer();
    // this.craService.addCraServer();
    if (!com.color){
      com.color = '';
    }
    console.log("ajout d'un projet semaine :", this.selectedWeek);
    const commande = new CommandeInsert(com.num_com, com.id_projet, com.id, 'true', com.color);    // id -> 1 ou id 2 pour le projet pour le moment et 2/5 pour id commande
    this.craService.addCr(new CompteRendu(0, com.id, 0.0, com.color), this.selectedWeek, commande);

  }

  /**
   * Renvoie la date du jour actuel
   */
  getDay(): Date{
    return new Date();
  }

  /**
   * Renvoie la date du jour sous forme de string que l'on utilise tout en haut de la page pour afficher la date du jour actuel
   */
  getDateToday(): string{
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
   * Permet d'éditer un cran précis mais jamais utilisé car ce n'est pas le cra en lui meme que nous éditons
   * @param cra
   */
  onEdit(cra: Cra) {
    this.craService.editCra(cra, this.selectedWeek);
  }

  /**
   * Permet d'afficher le jour en français plutôt que sous forme de numéro
   * @param day
   */
  afficherjour(day: number): string {
    return ['Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][day];
  }

  test1(){
    console.log('pppppppppppppppppppp');
  }


  /**
   * Fonction appelée lors du slide du caroussel qui permet de sélectionner le cra de la semaine dans la liste
   * @param $event
   */
  onSlide($event: NgbSlideEvent) {
    let res = ($event.current.split("-").pop());
    if (res){
        this.selectedWeek = +res;
      }



    this.update();
  }

  /**
   * Fonction permettant d'initialiser les commandes Disponibles dans la semaine ainsi que d'initialiser les dates de la semaine
   */
  update(){
    this.initDates();
    this.initListeCommandes();
    this.getAvailableCommande();


    //this.craService.emitCraSubject();
  }

  /**
   * permet à l'utilisateur de valider sa semaine elle sera donc envoyé aux administrateurs afin qu'ils la valident définitivement
   */
  save(){
    this.push();
    this.craService.setStatusUser(this.selectedWeek, '1');

  }

  /**
   * Est ce que la semaine est correctement remplie ? c'est à dire que chaque jour à une durée totale à 1
   */
  canUpdateStatus(){
    for (const cra of this.craWeek[this.selectedWeek].listeCra){
      console.log(cra.duree_totale);
      if ( cra.duree_totale < (1-cra.statusConge) || cra.duree_totale > (1-cra.statusConge)){
        return false;
      }
    }
    return true;
  }

  /**
   * Permet de ne pas afficher le bouton si le status est validé
   */
  seeButton(){
    console.log("selected week", this.selectedWeek,this.craWeek[this.selectedWeek].status);
    return this.craWeek[this.selectedWeek].status === '0';

  }

  /**
   * permet de renvoyer le status du cra à la semaine afin de gérer l'affichage en fonction de son status
   */
  seeMessage(){
    return +this.craWeek[this.selectedWeek].status;
  }}
