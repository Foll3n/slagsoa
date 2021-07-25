import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import { Conge } from "../../../Modeles/conge";
import { environment } from "../../../../environments/environment";

// TODO: Replace this with your own data model type
export interface TableCongesItem {
  dateDebut: string;
  dateFin: string;
  commentaire: string;
  type: string;
  etat: string;
  id: string;
}



/**
 * Data source for the TableConges view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableCongesDataSource extends DataSource<TableCongesItem> {
  data: TableCongesItem[] =[];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  listeConges!: TableCongesItem[];

  constructor(private httpClient: HttpClient) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TableCongesItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TableCongesItem[]): TableCongesItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TableCongesItem[]): TableCongesItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'dateDebut': return compare((a.dateDebut).toUpperCase(), (b.dateDebut).toUpperCase(), isAsc);
        case 'dateFin': return compare((a.dateFin).toUpperCase(), (b.dateFin).toUpperCase(), isAsc);
        case 'commentaire': return compare(a.commentaire, b.commentaire, isAsc);
        case 'type': return compare((a.type).toUpperCase(), (b.type).toUpperCase(), isAsc);
        case 'etat': return compare((a.etat).toUpperCase(), (b.etat).toUpperCase(), isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
