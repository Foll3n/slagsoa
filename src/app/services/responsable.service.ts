import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommandeHttpDatabase} from '../configuration-http/CommandeHttpDatabase';
import {Subject} from 'rxjs';
import {Realisation} from '../Cra/models/realisation/Realisation';
import {Utilisateur} from "../Modeles/utilisateur";
import {UtilisateursHttpService} from "../configuration-http/utilisateurs-http.service";
import {Responsable} from '../Cra/models/responsable/responsable';
import {ResponsableHttpService} from '../configuration-http/responsableHttp.service';
import {Client} from '../Cra/models/client/Client';
import {ClientHttpService} from '../configuration-http/clientHttp.service';


@Injectable()
export class ResponsableService {
  listeResponsables: Responsable[] = [];

  responsablesSubject = new Subject<Responsable[]>();
  constructor(private httpClient: HttpClient) {

    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    this.getAllResponsablesFromServer();

  }
  httpOptions = {
    headers: new HttpHeaders()
  };
  emitResponsablesSubject(): void {
    this.responsablesSubject.next(this.listeResponsables.slice());
  }
  getresponsable(idResp: string){
    return this.listeResponsables.find(r => r.idResponsable == idResp);
  }
  getAllResponsablesFromServer(): void {
    const responsableHttp = new ResponsableHttpService(this.httpClient);
    const response = responsableHttp.getAllResponsables();
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        if(reponse.listeResponsables)
          this.listeResponsables = reponse.listeResponsables;
        this.emitResponsablesSubject();
      }
      else{
        console.log("Erreur : get All responsables");
      }

    });
  }
  addResponsable(responsable: Responsable): void {
    const responsableHttp = new ResponsableHttpService(this.httpClient);
    const response = responsableHttp.addResponsable(responsable);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        // this.listeResponsables.push(responsable);
        // this.emitResponsablesSubject();
        ////////////////// patch pour pouvoir modifier l'utilisateur qu'on ajoute (fait un appel api de plus quand on ajoute pour recharger)
        this.getAllResponsablesFromServer();
      }
      else{
        console.log("Erreur : add responsable");
      }

    });
  }

  updateResponsable(responsable: Responsable){
    const responsableHttp = new ResponsableHttpService(this.httpClient);
    const response = responsableHttp.updateResponsable(responsable);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        this.updateInList(responsable);
        // this.getAllClientsFromServer();
        this.emitResponsablesSubject();
      }
      else{
        console.log("Erreur : get All clients");
      }

    });
  }

  updateInList(responsable: Responsable){
    for (const c of this.listeResponsables){
      if (c.idResponsable == responsable.idResponsable){
        c.nom = responsable.nom;
        c.prenom = responsable.prenom;
        c.mail = responsable.mail;
        c.idClient = responsable.idClient;
      }
    }
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

