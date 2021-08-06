import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommandeHttpDatabase} from '../configuration-http/CommandeHttpDatabase';
import {Subject} from 'rxjs';
import {Realisation} from '../Cra/models/realisation/Realisation';
import {Projet} from '../Cra/models/projet/Projet';
import {ProjetHttpDatabase} from '../configuration-http/ProjetHttpDatabase';


@Injectable()
export class ProjetService {
  userId = '10';
  listeProjet!: Projet[];
  projetSubject = new Subject<Projet[]>();
  ajout = new Subject<boolean>();
  constructor(private httpClient: HttpClient) {

    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    this.chargerProjet();
  }

  httpOptions = {
    headers: new HttpHeaders()
  };

  emitProjetSubject(): void {
    this.projetSubject.next(this.listeProjet.slice());
  }
  emitAjoutSubject(value:boolean): void {
    this.ajout.next(value);
  }

  addProjet(projet: Projet) {
    console.log(projet);
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.addProjet(projet);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse);
        projet.id = reponse.idProjet;
        this.listeProjet.push(projet);
        this.emitProjetSubject();
        this.emitAjoutSubject(true);

      }
      else{
        console.log("Erreur de requete de base de données");
        this.emitAjoutSubject(false);
      }

    });
  }
  updateProjet(projet:Projet){
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.updateProjet(projet);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        this.chargerProjet();
        this.emitAjoutSubject(true);
      }
      else{
        this.emitAjoutSubject(false);
        console.log("Erreur de requete de base de données");
      }

    });
  }
  chargerProjet(){
    const projetHttp = new ProjetHttpDatabase(this.httpClient);
    const response = projetHttp.getAllProjects();
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        console.log(reponse);
        this.listeProjet = reponse.liste_projet;
        this.emitProjetSubject();
      }
      else{
        console.log("Erreur de requete de base de données");
      }

    });
  }
}
