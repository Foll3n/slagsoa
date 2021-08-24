import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment} from '../../environments/environment';
import { InsertCra} from '../Cra/models/cra/InsertCra';
import {Big} from '../Cra/models/cra/Big';
import {BigCraWeek} from '../Cra/models/cra/BigCraWeek';
import {CraWeekInsert} from '../Cra/models/logCra/craWeekInsert';
import {BigCraWeekWaiting} from '../Cra/models/cra/BigCraWeekWaiting';
import {BigCraCalendar} from '../Cra/models/logCra/BigCraCalendar';
import {CraWeekInsertStatus} from '../Cra/models/logCra/craWeekInsertStatus';
import {Cra} from '../Cra/models/cra/Cra';
/**
 * Class qui regroupe l'ensemble des appels API de l'api Cra
 */
export class CraHttpDatabase{
  httpOptions = {
    headers: new HttpHeaders()
  };

  // getUtilisateurs(){
  //   this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`})
  //   const href = environment.urlUtilisateurs;
  //   const requestUrl =
  //     `${href}/${sessionStorage.getItem('id')}`;
  //
  //   return this._httpClient.get<any>(requestUrl, this.httpOptions );
  // }


  // tslint:disable-next-line:variable-name
  constructor(private _httpClient: HttpClient) {
    this.httpOptions.headers = new HttpHeaders({      'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}`})

  }
  // tslint:disable-next-line:variable-name
  getCra(date_start: string, date_end: string, idUsr:string, checkAvailable=''){
    const href = environment.urlCra;
    // tslint:disable-next-line:max-line-length
    let requestUrl='';
    if(checkAvailable == ''){
      requestUrl = href + '/?date_start=' + date_start + '&date_end=' + date_end + '&id_usr=' + idUsr ;// + `${href}/?date_start=${href}&date_end=${date_end}&id_usr=${id_usr}`;
    }
    else{
      requestUrl = href + '/?date_start=' + date_start + '&date_end=' + date_end + '&id_usr=' + idUsr + "&checkValidity=" + checkAvailable;// + `${href}/?date_start=${href}&date_end=${date_end}&id_usr=${id_usr}`;
    }
    return this._httpClient.get<Big>(requestUrl, this.httpOptions);
  }

  getAllCra(){
    const href = environment.urlCra;
    // tslint:disable-next-line:max-line-length
    const requestUrl = href + '/' + `${sessionStorage.getItem('id')}` ;// + `${href}/?date_start=${href}&date_end=${date_end}&id_usr=${id_usr}`;
    return this._httpClient.get<Big>(requestUrl, this.httpOptions);
  }

  postCra(listCra: InsertCra[] ){
    const json =  JSON.stringify(listCra);
    const href = environment.urlCra;
    // tslint:disable-next-line:max-line-length
    this._httpClient.post(href, json, this.httpOptions);
  }
  // tslint:disable-next-line:variable-name
  getCraWeekStatus(date_start: string, date_end: string){
    const href = environment.urlCraWeek;
    // tslint:disable-next-line:max-line-length
    const requestUrl = href + '/?dateStart=' + date_start + '&dateEnd=' + date_end + '&idUsr=' + `${sessionStorage.getItem('id')}` ;// + `${href}/?date_start=${href}&date_end=${date_end}&id_usr=${id_usr}`;
    return this._httpClient.get<BigCraWeek>(requestUrl, this.httpOptions);
  }
  getCraWeekWaiting(statusCra: string){
    const href = environment.urlCraWeek + '/status';
    // tslint:disable-next-line:max-line-length
    const requestUrl = href + '/?statusCra=' + statusCra + "&idUsrDoRequest="+ `${sessionStorage.getItem('id')}`;
    return this._httpClient.get<BigCraWeekWaiting>(requestUrl, this.httpOptions);
  }
  addCraWeek(craWeek: CraWeekInsert){
    const href = environment.urlCraWeek;
    // tslint:disable-next-line:max-line-length
    const json =  JSON.stringify(craWeek);
    return this._httpClient.post<CraWeekInsert>(href, json, this.httpOptions);
  }
  updateStatusCraWeek(craWeek: CraWeekInsert){
    let insertCraWeek = new CraWeekInsertStatus(craWeek, `${sessionStorage.getItem('id')}`);
    const href = environment.urlCraWeek;
    // tslint:disable-next-line:max-line-length
    const json =  JSON.stringify(insertCraWeek);
    return this._httpClient.put<{ status:string }>(href, json, this.httpOptions);
  }
}
