import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommandeHttpDatabase} from '../configuration-http/CommandeHttpDatabase';
import {Subject} from 'rxjs';
import {Realisation} from '../Cra/models/realisation/Realisation';
import {Utilisateur} from "../Modeles/utilisateur";
import {UtilisateursHttpService} from "../configuration-http/utilisateurs-http.service";


@Injectable()
export class UserService {
  listeRealisations: Realisation[] = [];
  listeUsers: Utilisateur[] = [];
  usersSubject = new Subject<Utilisateur[]>();
  realisationsSubject = new Subject<Realisation[]>();
  constructor(private httpClient: HttpClient) {

    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    this.getCommandeFromServer(`${sessionStorage.getItem('id')}`);
    this.getUsersFromServer();

  }
  httpOptions = {
    headers: new HttpHeaders()
  };
  getMail(idUsr: string){
    return this.listeUsers.find(u => u.id == idUsr)?.mail;
  }
  emitUsersSubject(): void {
    this.usersSubject.next(this.listeUsers.slice());
  }
  findUserById(id: string){
    return this.listeUsers.find(user => user.id == id);
  }
  emitRealisationSubject(): void {
    this.realisationsSubject.next(this.listeRealisations.slice());
  }
  getUsersFromServer(): void {
    const userHttp = new UtilisateursHttpService(this.httpClient);
    const response = userHttp.getUtilisateurs();
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        if(reponse.getAllutilisateurOutput)
          this.listeUsers = reponse.getAllutilisateurOutput;
        this.emitUsersSubject();
      }
      else{
        console.log("Erreur : get All users");
      }
    });
  }
  refreshRealisationsUser(){
    this.getCommandeFromServer(`${sessionStorage.getItem('id')}`);
  }
  getCommandeFromServer(idUser: string): void {
    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const response = commandeHttp.getAllCommandsUser(idUser);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        if (reponse.realisations)
        this.listeRealisations = reponse.realisations;
        this.emitRealisationSubject();
      }
      else{
        console.log("Erreur : getAllCommandsUser");
      }

    });
  }
}

//
//
// import {Injectable} from '@angular/core';
//
// import {HttpClient, HttpHeaders} from '@angular/common/http';
// import {CommandeHttpDatabase} from '../configuration-http/CommandeHttpDatabase';
// import {Subject} from 'rxjs';
// import {Realisation} from '../Cra/models/realisation/Realisation';
//
// import {UtilisateursHttpService} from "../configuration-http/utilisateurs-http.service";
// import {Utilisateur} from "../Modeles/utilisateur";
//
//
// @Injectable()
// export class UserService {
//   listeUsers!: Utilisateur[];
//   realisationsSubject = new Subject<Utilisateur[]>();
//   constructor(private httpClient: HttpClient) {
//
//     this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`});
//     this.getUsersFromServer();
//
//   }
//   httpOptions = {
//     headers: new HttpHeaders()
//   };
//
//   emitUsersSubject(): void {
//     this.realisationsSubject.next(this.listeUsers.slice());
//   }
//
//   getUsersFromServer(): void {
//     const userHttp = new UtilisateursHttpService(this.httpClient);
//     const response = userHttp.getUtilisateurs();
//     response.subscribe(reponse => {
//       if(reponse.status == 'OK'){
//         this.listeUsers = reponse.getAllutilisateurOutput();
//         this.emitUsersSubject();
//       }
//       else{
//         console.log("Erreur : get All users");
//       }
//
//     });
//   }
//
// }

