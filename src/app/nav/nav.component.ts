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



  notificationsConges = 8;
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

  constructor(public c: ConnexionService,public cgeService: CongesHttpService, private breakpointObserver: BreakpointObserver) {
    if(this.c.isLogged()){
      console.log('ici constructor');
      this.c.chargerUtilisateur();
    }
    // c.chargerUtilisateur();
    // setTimeout(() => {this.user = c.getUtilisateur();}, 200);

  }

  getData(){
    if(this.c.isLogged()){
      this.userSubscription = this.c.usersSubject.subscribe(
        (users: Utilisateur[]) => {
          if(users){
            console.log('ici');
            this.users = users;
            this.user = this.users[0];
            if(this.user.role == "MANAGER"){
              this.getCongesEnAttente();
            }
          }
        }
      );
    }
  }

  getCongesEnAttente() {
    this.cgeService.getConges().subscribe(
      reponse => {
        console.log(reponse);
      },
      error => {
        console.log(error);
      }
    )
  }
}
