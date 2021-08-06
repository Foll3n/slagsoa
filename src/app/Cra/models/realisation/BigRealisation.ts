import {CommandeInsert} from '../commande/CommandeInsert';
import {Realisation} from './Realisation';

export class BigRealisation {
  constructor(
    public status: string,
    public realisations: Realisation[]
  ) {}


}
