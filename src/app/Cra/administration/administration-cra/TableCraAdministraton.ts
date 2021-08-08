import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CraWeekInsert} from '../../models/logCra/craWeekInsert';
import {PDFNet} from "@pdftron/webviewer";

// TODO: Replace this with your own data model type
export interface TableCraItem {
  name: string;
  id: number;
}



/**
 * Data source for the TableCongesEnAttente view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableCraAdministration extends DataSource<CraWeekInsert> {
  data: CraWeekInsert[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  index!: string;
  constructor(private httpClient: HttpClient) {
    super();
    this.data = [];



  }


  setListe(liste: CraWeekInsert[] ){
    this.data = liste;
    this.paginator!._changePageSize(this.paginator!.pageSize);

  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */

  connect(): Observable<CraWeekInsert[]> {
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
  private getPagedData(data: CraWeekInsert[]): CraWeekInsert[] {
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
  private getSortedData(data: CraWeekInsert[]): CraWeekInsert[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'dateStart': return compare(a.dateStart, b.dateStart, isAsc);
        case 'dateEnd': return compare(a.dateEnd, b.dateEnd, isAsc);
        // tslint:disable-next-line:no-non-null-assertion
        case 'nomUsername': return compare(a.nomUsername!, b.nomUsername!, isAsc);
        // tslint:disable-next-line:no-non-null-assertion
        case 'prenomUsername': return compare(a.prenomUsername!, b.prenomUsername!, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
