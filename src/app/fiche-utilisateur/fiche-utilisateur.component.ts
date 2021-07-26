import {Component, Input, OnInit} from '@angular/core';
import {Utilisateur} from "../Modeles/utilisateur";
import {Conge} from "../Modeles/conge";

@Component({
  selector: 'app-fiche-utilisateur',
  templateUrl: './fiche-utilisateur.component.html',
  styleUrls: ['./fiche-utilisateur.component.scss']
})
export class FicheUtilisateurComponent implements OnInit {

  @Input() user!: Utilisateur;
  @Input() conge!: Conge;
  constructor() { }

  ngOnInit(): void {
  }

}
