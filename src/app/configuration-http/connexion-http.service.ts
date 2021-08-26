import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConnexionHttpService {

  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(sessionStorage.getItem('ndc') + ':' + sessionStorage.getItem('mdp'))
    });
  }

  httpOptions = {
    headers: new HttpHeaders()
  };

  connexion(ndc: string, mdp: string) {
    this.httpOptions.headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(`${ndc}:${mdp}`)});
    const href = environment.urlConnexion;
    const requestUrl =
      `${href}/${ndc}`;

    return this._httpClient.get<any>(requestUrl, this.httpOptions);
  }

}
