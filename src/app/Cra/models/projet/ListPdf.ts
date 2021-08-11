import {CompteRendu} from '../compteRendu/CompteRendu';
import {CompteRenduInsert} from '../compteRendu/CompteRenduInsert';

export class ListPdf {
  constructor(
    public date: string,
    public codeProjet: string,
    public duree: string

  ) {}
}
