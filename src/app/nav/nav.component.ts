import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon'
import { map, shareReplay } from 'rxjs/operators';
import {ConnexionComponent} from "../connexion/connexion.component";
import { MatIcon } from "@angular/material/icon";
import {Utilisateur} from "../Modeles/utilisateur";
import {ConnexionService} from "../connexion/connexion.service";
import {CongesHttpService} from "../configuration-http/conges-http.service";
import {CraWaitingService} from "../services/craWaiting.service";
import {CraWeekInsert} from "../Cra/models/logCra/craWeekInsert";
import {Router} from '@angular/router';
import {CraService} from '../services/cra.service';
import {formatDate} from '@angular/common';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit{

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  hidden = false;

  users!: Utilisateur[];
  user!: Utilisateur;

  userSubscription!: Subscription;

  notificationCraSubscription!: Subscription;
  notificationsCraWait!:number;
  notificationsConges!: number;
  @ViewChild('navdrop') dp: ElementRef | undefined;

  ngOnInit() {
    this.getData();

  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  clickdp1(){
    // @ts-ignore
    this.dp.nativeElement.classList.toggle("visibility");
  }
  goToCompteRenduActivite(){
    // this.router.navigate(['/compte-rendu-activite'], { queryParams: { date: formatDate(new Date(),'MM-dd-yyyy','en') }});
    this.router.navigate(['/compte-rendu-activite', formatDate(new Date(),'MM-dd-yyyy','en')]);
  }

  constructor(private router: Router, public c: ConnexionService,public cgeService: CongesHttpService, private breakpointObserver: BreakpointObserver, private craWaitService: CraWaitingService, private craService:CraService) {
    if(this.c.isLogged()){
      this.c.chargerUtilisateur();
      craWaitService.initialisation();
      this.notificationCraSubscription = this.craWaitService.waitingSubject.subscribe((res: CraWeekInsert[] )=> {
          this.notificationsCraWait = res.length;
      });
    }
    // c.chargerUtilisateur();
    // setTimeout(() => {this.user = c.getUtilisateur();}, 200);

  }

  getData(){
    if(this.c.isLogged()){
      this.userSubscription = this.c.usersSubject.subscribe(
        (users: Utilisateur[]) => {
          if(users){
            this.users = users;
            this.user = this.users[0];
            if(this.user.role == "MANAGER"){
              this.getCongesEnAttente();
            }
          }
        }
      );
      this.getCongesEnAttente();
    }
  }

  getCongesEnAttente() {
    let s=0;
    this.cgeService.getConges().subscribe(
      reponse => {
        if (reponse.listeConges)
        for(var i=0; i<reponse.listConges.length ; i++){
          let etatDeChaqueConge = reponse.listConges[i].etat;
          if(etatDeChaqueConge == "EN_COURS")s++;

        }
        this.notificationsConges = s;
      },
      error => {
        console.log(error);
      }
    )
  }
}
