import {Component, ElementRef, ViewChild} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon'
import { map, shareReplay } from 'rxjs/operators';
import {ConnexionComponent} from "../connexion/connexion.component";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  hidden = false;

  notificationsConges = 8;
  @ViewChild('navdrop') dp: ElementRef | undefined;


  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  clickdp1(){
    // @ts-ignore
    this.dp.nativeElement.classList.toggle("visibility");
  }

  constructor(public c: ConnexionComponent, private breakpointObserver: BreakpointObserver) {}

}
