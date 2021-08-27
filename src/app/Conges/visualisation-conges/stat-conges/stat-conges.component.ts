import { Component, OnInit } from '@angular/core';
import { Utilisateur } from "../../../partage/Modeles/utilisateur";
import {Subscription} from 'rxjs';
import {ConnexionService} from '../../../connexion/connexion.service';

@Component({
  selector: 'app-stat-conges',
  templateUrl: './stat-conges.component.html',
  styleUrls: ['./stat-conges.component.scss']
})
export class StatCongesComponent implements OnInit {

  congesCumules = '';
  congesPoses = '';
  congesRestant = '';
  users!: Utilisateur[];
  user!: Utilisateur;
  userSubscription!: Subscription;

  constructor(private connexionService: ConnexionService) { }

  ngOnInit(): void {
    this.userSubscription = this.connexionService.usersSubject.subscribe(
      (users: Utilisateur[]) => {
        if(users){
          this.users = users;
          this.user = this.users[0];
          this.congesCumules = this.user.nbCongesCumules;
          this.congesPoses = this.user.nbCongesPoses;
          this.congesRestant = this.user.nbCongesRestant;
        }
      }
    );
  }
}
