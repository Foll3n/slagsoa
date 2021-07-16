import {HttpClient} from "@angular/common/http";
import {SortDirection} from "@angular/material/sort";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Conge} from "../Modeles/conge";


export class CongesHttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getConges(idUtilisateur: string){
    const href = environment.urlConges;
    const requestUrl =
      `${href}/${idUtilisateur}`;

    return this._httpClient.get<any>(requestUrl);
  }
}
