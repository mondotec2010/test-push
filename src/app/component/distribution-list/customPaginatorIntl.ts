import {MatPaginatorIntl} from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class MatPaginatorIntlDistList extends MatPaginatorIntl {
  itemsPerPageLabel = 'Items per pagina';
  firstPageLabel = 'Prima pagina';
  nextPageLabel     = 'Pagina successiva';
  previousPageLabel = 'Pagina precedente';
  lastPageLabel = 'Ultima pagina';

  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return '0 su ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    // return startIndex + 1 + ' - ' + endIndex + ' su ' + length;
    return startIndex + 1 + ' - ' + endIndex + ' su ' + length; // Pagination label - bug fix
  };

}