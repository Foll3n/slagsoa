import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment} from '../../environments/environment';
import { InsertCra} from '../Cra/models/cra/InsertCra';
import {Big} from '../Cra/models/cra/Big';
import {BigCommande} from '../Cra/models/commande/BigCommande';
import {BigRealisation} from '../Cra/models/realisation/BigRealisation';
import {CompteRendu} from '../Cra/models/compteRendu/CompteRendu';
import {CompteRenduInsert} from '../Cra/models/compteRendu/CompteRenduInsert';
import {BigProjet} from '../Cra/models/projet/BigProjet';
import {Projet} from '../Cra/models/projet/Projet';
import {ProjetAdd} from '../Cra/models/projet/ProjetAdd';
import {InsertProjet} from "../Cra/models/projet/InsertProjet";
import {Result} from "../Cra/models/Result";


/**
 * Class qui regroupe l'ensemble des appels API de l'api Projet
 */
export class ProjetHttpDatabase{
  httpOptions = {
    headers: new HttpHeaders()
  };
  // tslint:disable-next-line:variable-name
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`});

  }
  // tslint:disable-next-line:variable-name
  getAllProjects(){
    console.log("getAllProjects : id = " +  `${sessionStorage.getItem('id')}`);
    const href = environment.urlProjet + "/?idUserDoRequest=" + `${sessionStorage.getItem('id')}`;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.get<BigProjet>(href, this.httpOptions);
  }
  addProjet(projet: Projet){
    const send = new InsertProjet( `${sessionStorage.getItem('id')}`,projet);
    const json =  JSON.stringify(send);
    const href = environment.urlProjet;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.post<ProjetAdd>(href, json, this.httpOptions);
  }
  updateProjet(projet:Projet){
    const send = new InsertProjet( `${sessionStorage.getItem('id')}`,projet);
    const json =  JSON.stringify(send);
    const href = environment.urlProjet;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.put<Result>(href, json, this.httpOptions);
  }

  deleteProjet(projet: Projet){
    const href = environment.urlProjet + '/' + projet.id;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.delete(href, this.httpOptions);
  }
}