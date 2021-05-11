import { Pipe, PipeTransform } from '@angular/core';
import { Facture } from './Modeles/facture';

@Pipe({
  name: 'recherche'
})
export class RecherchePipe implements PipeTransform {
  transform(factures: Facture[], searchTerm: string): Facture[] {
    if (!factures  || !searchTerm) {
      return factures;
    }
    return factures.filter(facture => {
      return facture.idFacture.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    });
  }
}
