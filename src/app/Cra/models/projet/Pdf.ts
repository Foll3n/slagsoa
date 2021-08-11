import {CompteRendu} from '../compteRendu/CompteRendu';
import {CompteRenduInsert} from '../compteRendu/CompteRenduInsert';
import {ListPdf} from './ListPdf';

export class Pdf {
  constructor(
    public nomSociete: string,
    public codeProjet: string,
    public responsablePrenom: string,
    public responsableNom: string,
    public listeFill: ListPdf[]


  ) {}
}
