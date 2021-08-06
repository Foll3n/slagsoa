import {InsertCra} from '../cra/InsertCra';
import {Cra} from '../cra/Cra';
import {CommandeInsert} from './CommandeInsert';

export class InserCommande {
  constructor(
    public idUserDoRequest: string,
    public commande: CommandeInsert
  ) {}


}
