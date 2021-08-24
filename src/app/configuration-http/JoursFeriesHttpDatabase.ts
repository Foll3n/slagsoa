import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment} from '../../environments/environment';
import {Result} from "../Cra/models/Result";
import {JoursFeries} from '../Cra/models/joursFeries/JoursFeries';



/**
 * Class qui regroupe l'ensemble des appels API de l'api Projet
 */
export class JoursFeriesHttpDatabase{
  httpOptions = {
    headers: new HttpHeaders()
  };
  // tslint:disable-next-line:variable-name
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`});

  }
  // tslint:disable-next-line:variable-name
  getJoursFeries(dateDebut: string, dateFin: string){
    const href = environment.urlJoursFeries + "/joursFeries" + "/?dateDebut=" + dateDebut + "&dateFin=" + dateFin;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.get<JoursFeries>(href, this.httpOptions);
  }

}
