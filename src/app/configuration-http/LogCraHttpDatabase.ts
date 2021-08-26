import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BigLog} from '../Cra/models/logCra/BigLog';
import {Log} from '../Cra/models/logCra/Log';


/**
 * Class qui regroupe l'ensemble des appels API de l'api LogCra qui permet de faire des logs d'acceptation ou non des cras par les administrateurs
 */
export class LogCraHttpDatabase {
  httpOptions = {
    headers: new HttpHeaders()
  };

  // tslint:disable-next-line:variable-name
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });

  }

  // tslint:disable-next-line:variable-name
  getAllLogs() {
    const href = environment.urlLogCra;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.get<BigLog>(href, this.httpOptions);
  }

  addLog(log: Log) {
    const json = JSON.stringify(log);
    const href = environment.urlLogCra;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.post(href, json, this.httpOptions);
  }


}
