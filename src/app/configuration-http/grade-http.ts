import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GradeHttpService {
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }

  httpOptions = {
    headers: new HttpHeaders()
  };

  getGrade() {
    const href = environment.urlGrade;
    const requestUrl =
      `${href}/${sessionStorage.getItem('id')}`;

    return this._httpClient.get<any>(requestUrl, this.httpOptions);

  }
}
