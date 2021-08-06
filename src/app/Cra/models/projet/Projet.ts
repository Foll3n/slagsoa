import {CompteRendu} from '../compteRendu/CompteRendu';
import {CompteRenduInsert} from '../compteRendu/CompteRenduInsert';

export class Projet {
  constructor(
    public code_projet: string,
    public color: string,
    public id: string,
    public modeRealisation: string


  ) {}
}
