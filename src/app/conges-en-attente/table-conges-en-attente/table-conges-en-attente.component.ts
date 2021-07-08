import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TableCongesEnAttenteDataSource, TableCongesEnAttenteItem } from './table-conges-en-attente-datasource';

@Component({
  selector: 'app-table-conges-en-attente',
  templateUrl: './table-conges-en-attente.component.html',
  styleUrls: ['./table-conges-en-attente.component.scss']
})
export class TableCongesEnAttenteComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableCongesEnAttenteItem>;
  dataSource: TableCongesEnAttenteDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  constructor() {
    this.dataSource = new TableCongesEnAttenteDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
