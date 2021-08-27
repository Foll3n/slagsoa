import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Result} from '../Cra/models/Result';
import {Responsable} from '../Cra/models/responsable/responsable';
import {BigResponsable} from '../Cra/models/responsable/BigResponsable';
import {BigInsertResponsable} from '../Cra/models/responsable/BigInsertResponsable';


export class ResponsableHttpService {
  httpOptions = {
    headers: new HttpHeaders()
  };

  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }

  getAllResponsables() {
    const href = environment.urlResponsable + '/all';
    // tslint:disable-next-line:max-line-length
    const requestUrl = href + '/' + `${sessionStorage.getItem('id')}`;
    return this._httpClient.get<BigResponsable>(requestUrl, this.httpOptions);
  }

  addResponsable(responsable: Responsable) {
    const send = new BigInsertResponsable(`${sessionStorage.getItem('id')}`, responsable);
    const json = JSON.stringify(send);
    const href = environment.urlResponsable;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.post<Result>(href, json, this.httpOptions);
  }

  updateResponsable(responsable: Responsable) {
    const send = new BigInsertResponsable(`${sessionStorage.getItem('id')}`, responsable);
    const json = JSON.stringify(send);
    const href = environment.urlResponsable;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.put<Result>(href, json, this.httpOptions);
  }

}
