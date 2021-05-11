import { Pipe, PipeTransform } from '@angular/core';
import { Facture } from './Modeles/facture';

@Pipe({
  name: 'recherchec'
})
export class RecherchecPipe implements PipeTransform {

  transform(factures: Facture[], searchTerm: string): Facture[] {
    if (!factures  || !searchTerm) {
      return factures;
    }
    return factures.filter(facture => {
      if(facture.commentaire == null){
        facture.commentaire = "";
      }
      return facture.commentaire.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    });
  }
}
