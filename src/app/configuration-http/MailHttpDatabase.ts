import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment} from '../../environments/environment';
import {Result} from "../Cra/models/Result";



/**
 * Class qui regroupe l'ensemble des appels API de l'api Projet
 */
export class MailHttpDatabase{
  httpOptions = {
    headers: new HttpHeaders()
  };
  // tslint:disable-next-line:variable-name
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`});

  }
  // tslint:disable-next-line:variable-name
  sendMail(group_id: string, nomDestinataire: string, adresseDestinataire: string, saveBoiteEnvoie = false){
    console.log("getAllProjects : id = " +  `${sessionStorage.getItem('id')}`);
    const href = environment.urlMail + "/?group_id=" + group_id + "&nomDestinataire=" + nomDestinataire + "&saveBoiteEnvoie=false" +"&adresseDestinataire=" + adresseDestinataire;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.get<Result>(href, this.httpOptions);
  }

}
