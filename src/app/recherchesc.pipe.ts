import { Pipe, PipeTransform } from '@angular/core';
import {Facture} from "./Modeles/facture";

@Pipe({
  name: 'recherchesc'
})
export class RecherchescPipe implements PipeTransform {

  transform(factures: Facture[], searchTerm: string): Facture[] {
    if (!factures  || !searchTerm) {
      return factures;
    }
    return factures.filter(facture => {
      if(facture.sousCategorie == null){
        facture.sousCategorie = "";
      }
      return facture.sousCategorie.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    });
  }
}
