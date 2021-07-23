import { MatPaginatorIntl } from "@angular/material/paginator";

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Items par page:';
  customPaginatorIntl.previousPageLabel = 'page précédente';
  customPaginatorIntl.nextPageLabel = 'page suivante';
  customPaginatorIntl.lastPageLabel = 'dernière page';
  customPaginatorIntl.firstPageLabel = 'première page';

  return customPaginatorIntl;
}
