import {Injectable} from '@angular/core';
import {Cra} from '../Cra/models/cra/Cra';
import {Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {CraWeek} from '../Cra/models/cra/craWeek';
import {Commande} from '../Cra/models/commande/Commande';
import {BigCommande} from '../Cra/models/commande/BigCommande';

// Classe permettant d'abonner les composants au cra week représentant une vue à la semaine
@Injectable()
export class CraWeekService {
  constructor(private httpClient: HttpClient) {
    this.dateDay = new Date();
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
  }

  httpOptions = {
    headers: new HttpHeaders()
  };

  dateDay = new Date();
  dateToday = new Date();
  listeCraWeek: CraWeek[] = [];
  craWeekLast: CraWeek = new CraWeek(0, new Date(this.dateDay.setDate(this.dateDay.getDate() - this.dateDay.getDay() - 7)));
  craWeek: CraWeek = new CraWeek(1, new Date(this.dateDay.setDate(this.dateDay.getDate() - this.dateDay.getDay() + 7)));
  craWeekNext: CraWeek = new CraWeek(2, new Date(this.dateDay.setDate(this.dateDay.getDate() - this.dateDay.getDay() + 7)));


  public listeCommandes: Commande[] = [];
  craSubject = new Subject<CraWeek[]>();
  private listeCra: Cra[] = [];


  emitCraSubject(): void {
    // tslint:disable-next-line:triple-equals
    this.craSubject.next(this.listeCraWeek.slice());
  }

  getCraWeekToServerStatus(index: number): void {
    const requestUrl = environment.urlCraWeek + '/' + this.listeCraWeek[index].firstDateWeekFormat + '/' + this.listeCraWeek[index].lastDateWeekFormat + '/' + '10';
    this.httpClient.get<BigCommande>(requestUrl, this.httpOptions).subscribe(
      response => {
        this.listeCraWeek[index].listeCommandesWeek = response.listeCommande;
        // this.getCraToServer(index); // patch car je reload tout le serveur
        this.emitCraSubject();
      },
      error => {
        console.log(error + 'le serveur ne répond pas ');
      }
    );
  }

}
