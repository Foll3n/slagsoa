import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { ConnexionComponent } from "../../app/connexion/connexion.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  active = 'top';
  constructor(public c: ConnexionComponent) { }
  droit: number = 2;
  ngOnInit(): void {
  }

}
