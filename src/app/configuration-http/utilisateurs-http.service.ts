import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Utilisateur} from '../partage/Modeles/utilisateur';

export class UpdatedUser {
  idUtilisateur!: string;
  utilisateur!: Utilisateur;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateursHttpService {
  constructor(private _httpClient: HttpClient) {
  }

  httpOptions = {
    headers: new HttpHeaders()
  };

  getUtilisateurs() {
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    const href = environment.urlUtilisateurs;
    const requestUrl =
      `${href}/${sessionStorage.getItem('id')}`;

    return this._httpClient.get<any>(requestUrl, this.httpOptions);
  }

  getUtilisateursProjet(projetCode: string) {
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    const href = environment.urlUtilisateurs;
    const requestUrl = href + '/projet/?codeProjet=' + projetCode.toString() + '&idUtilisateur=' + `${sessionStorage.getItem('id')}`;

    return this._httpClient.get<any>(requestUrl, this.httpOptions);
  }

  addUtilisateurs(body: any) {
    console.log(body);
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    const href = environment.urlUtilisateurs;
    const requestUrl =
      `${href}`;

    return this._httpClient.post<any>(requestUrl, body, this.httpOptions);
  }

  deleteUtilisateur(id: string) {
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    const href = environment.urlUtilisateurs;
    const requestUrl =
      `${href}/${id}`;

    return this._httpClient.delete<any>(requestUrl, this.httpOptions);
  }

  updateUtilisateur(utilisateur: Utilisateur) {
    let updatedUtilisateur = new UpdatedUser();
    // @ts-ignore
    updatedUtilisateur.idUtilisateur = sessionStorage.getItem('id');
    updatedUtilisateur.utilisateur = utilisateur;
    this.httpOptions.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    const href = environment.urlUtilisateurs;
    const requestUrl =
      `${href}`;

    return this._httpClient.put<any>(requestUrl, updatedUtilisateur, this.httpOptions);
  }
}
