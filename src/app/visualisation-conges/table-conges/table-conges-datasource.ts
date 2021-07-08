import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TableCongesItem {
  dateDebut: string;
  dateFin: string;
  quantite: number;
  type: string;
  etat: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: TableCongesItem[] = [
  { dateDebut: 'Hydrogen', dateFin: 'test' , quantite: 10, type:'ARM', etat:'en cours'},
  { dateDebut: 'fezqf', dateFin: 'zaqfrz' , quantite: 9, type:'ARM', etat:'en cours'},
  { dateDebut: 'ktuk', dateFin: 'qzdd' , quantite: 6, type:'ARM', etat:'en cours'},
  { dateDebut: 'ktr', dateFin: 'ydqzdgrgo' , quantite: 5, type:'ARM', etat:'en cours'},
  { dateDebut: 'zqfqsf', dateFin: 'yyfjqazao' , quantite: 2, type:'ARM', etat:'en cours'},
  { dateDebut: 'ze', dateFin: 'ayao' , quantite: 10, type:'ARM', etat:'en cours'},
  { dateDebut: 'afsger', dateFin: 'byo' , quantite: 9, type:'ARM', etat:'en cours'},
  { dateDebut: 'bjedgr', dateFin: 'tyo' , quantite: 6, type:'ARM', etat:'en cours'},
  { dateDebut: 'jegzsergfz', dateFin: 'hyo' , quantite: 5, type:'ARM', etat:'en cours'},
  { dateDebut: 'hzefzz', dateFin: 'yo' , quantite: 2, type:'ARM', etat:'en cours'},

];

/**
 * Data source for the TableConges view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableCongesDataSource extends DataSource<TableCongesItem> {
  data: TableCongesItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
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
        case 'quantite': return compare(+a.quantite, +b.quantite, isAsc);
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
