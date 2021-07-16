import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {CongesHttpDatabase} from "../ConfigurationTs/CongesHttpDatabase";
import {Conge} from "../Modeles/conge";


@Component({
  selector: 'app-mes-conges',
  templateUrl: './mes-conges.component.html',
  styleUrls: ['./mes-conges.component.scss']
})
export class MesCongesComponent implements AfterViewInit  {
  displayedColumns = ['dateDebut', 'dateFin', 'type', 'etat', 'commentaire', 'actions'];
  congeDataBase!: CongesHttpDatabase;
  data: Conge[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _httpClient: HttpClient) { }

  ngAfterViewInit(){
    this.congeDataBase = new CongesHttpDatabase(this._httpClient)

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.congeDataBase!.getConges('11')
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          //this.resultsLength = data.total_count;
          return data.listConges;
        })
      ).subscribe(data => this.data = data);

  }

}
/*
let reponse = this.congeDataBase.getConges('11');
reponse.subscribe(resultat=>{
  this.data = resultat.listConges;
  console.log(this.data);
});

 */
