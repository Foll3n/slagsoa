import {Injectable} from '@angular/core';
import {InsertCra} from '../Cra/models/cra/InsertCra';
import {Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CraHttpDatabase} from '../configuration-http/CraHttpDatabase';




@Injectable()
export class CalendarService {
  userId = '10';
  listeCra: InsertCra[] = [];
  calendarSubject = new Subject<InsertCra[]>();

  constructor(private httpClient: HttpClient) {

    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
    this.chargerCalendar();
  }

  httpOptions = {
    headers: new HttpHeaders()
  };

  emitCalendarSubject(): void {
    this.calendarSubject.next(this.listeCra.slice());
  }


  chargerCalendar(){
    const craHttp = new CraHttpDatabase(this.httpClient);
    const response = craHttp.getAllCra();
    response.subscribe(reponse => {
      if (reponse.status == 'OK'){
        console.log(reponse);
        if (reponse.liste_cra)
           this.listeCra = reponse.liste_cra;
        this.emitCalendarSubject();
      }
      else{
        console.log('Erreur de requete de base de données');
      }

    });
  }
}
