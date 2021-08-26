import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BigCommande} from '../Cra/models/commande/BigCommande';
import {BigRealisation} from '../Cra/models/realisation/BigRealisation';
import {Commande} from '../Cra/models/commande/Commande';
import {RealisationPost} from '../Cra/models/realisation/RealisationPost';
import {Result} from '../Cra/models/Result';
import {InserCommande} from '../Cra/models/commande/InserCommande';
import {CraWeekInsert} from '../Cra/models/logCra/craWeekInsert';
import {BigInsertCommande} from '../Cra/models/commande/BigInsertCommande';

/**
 * Class qui regroupe l'ensemble des appels API de l'api Commande
 */
export class CommandeHttpDatabase {
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
  getAllCommandsUser(idUser: string) {
    const href = environment.urlRealisation;
    // tslint:disable-next-line:max-line-length
    const requestUrl = href + '/' + idUser;
    return this._httpClient.get<BigRealisation>(requestUrl, this.httpOptions);
  }

  updateCommands(commandes: Commande[]) {
    const send = new BigInsertCommande(`${sessionStorage.getItem('id')}`, commandes);
    const json = JSON.stringify(send);

    const href = environment.urlCommande;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.put<Result>(href, json, this.httpOptions);
  }

  getAllCommands() {
    const href = environment.urlCommande;
    // tslint:disable-next-line:max-line-length
    const requestUrl = href + '/all' + '?idUserDoRequest=' + `${sessionStorage.getItem('id')}`;
    return this._httpClient.get<BigCommande>(requestUrl, this.httpOptions);
  }

  // tslint:disable-next-line:variable-name
  getAllCommandsProjet(code_projet: string) {
    const href = environment.urlCommande;
    // tslint:disable-next-line:max-line-length
    const requestUrl = href + '/' + '?code_projet=' + code_projet + '&idUserDoRequest=' + `${sessionStorage.getItem('id')}`;
    console.log(requestUrl);
    return this._httpClient.get<BigCommande>(requestUrl, this.httpOptions);
  }

  addCommande(commande: Commande) {
    const send = new InserCommande(`${sessionStorage.getItem('id')}`, commande);
    const json = JSON.stringify(send);
    console.log('commande : ', commande);
    const href = environment.urlCommande;
    // tslint:disable-next-line:max-line-length
    return this._httpClient.post<Result>(href, json, this.httpOptions);
  }

  addCommandeUser(realisation: RealisationPost) {
    const href = environment.urlRealisation;
    const json = JSON.stringify(realisation);
    return this._httpClient.post<Result>(href, json, this.httpOptions);
  }

  deleteCommandeUser(realisation: RealisationPost) {
    const href = environment.urlRealisation;
    const requestUrl = href + '/?id_usr=' + realisation.id_usr + '&id_com=' + realisation.id_com;
    return this._httpClient.delete<Result>(requestUrl, this.httpOptions);
  }

  getDistinctCommandsWeek(craWeek: CraWeekInsert, id_usr: string) {
    const requestUrl = environment.urlCommande + '/' + craWeek.dateStart + '/' + craWeek.dateEnd + '/' + id_usr;
    return this._httpClient.get<BigCommande>(requestUrl, this.httpOptions);
  }
}
