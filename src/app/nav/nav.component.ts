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

  userSubscription!: Subscription;
  user!: Utilisateur | null;

  notificationsConges = 8;
  @ViewChild('navdrop') dp: ElementRef | undefined;

  ngOnInit() {
    this.userSubscription = this.c.userSubject.subscribe(
      (users: Utilisateur) => {
        this.user = users;
        console.log( 'dans nav' +  this.user)
      }
    );
    this.c.emitUser();

  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  clickdp1(){
    // @ts-ignore
    this.dp.nativeElement.classList.toggle("visibility");
  }

  constructor(public c: ConnexionComponent, private breakpointObserver: BreakpointObserver) {

    // c.chargerUtilisateur();
    // setTimeout(() => {this.user = c.getUtilisateur();}, 200);

  }

}
