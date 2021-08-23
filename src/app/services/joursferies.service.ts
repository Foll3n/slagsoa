import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommandeHttpDatabase} from '../configuration-http/CommandeHttpDatabase';
import {Subject} from 'rxjs';
import {Realisation} from '../Cra/models/realisation/Realisation';
import {Utilisateur} from "../Modeles/utilisateur";
import {UtilisateursHttpService} from "../configuration-http/utilisateurs-http.service";
import {JoursFeries} from '../Cra/models/joursFeries/JoursFeries';
import {JoursFeriesHttpDatabase} from '../configuration-http/JoursFeriesHttpDatabase';


@Injectable()
export class JoursferiesService {
  listeJoursFeries: Date[] = [];
  joursSubject = new Subject<Date[]>();
  constructor(private httpClient: HttpClient) {

    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    this.getJoursFeriesFromServer();

  }
  httpOptions = {
    headers: new HttpHeaders()
  };

  emitJoursFeriesSubject(): void {
    this.joursSubject.next(this.listeJoursFeries.slice());
  }
  getJoursFeriesFromServer(): void {
    this.listeJoursFeries = [];
    const joursFeries = new JoursFeriesHttpDatabase(this.httpClient);
    const response = joursFeries.getJoursFeries('2020-01-01','2021-01-01');
    response.subscribe(reponse => {console.log(reponse);
      let a: string[] = reponse.joursFeries;
      for (const elem of a){
        this.listeJoursFeries.push(new Date(elem));

      }
      this.emitJoursFeriesSubject();
      console.log("dates feriees -> ", this.listeJoursFeries);
    } );
  }
}

