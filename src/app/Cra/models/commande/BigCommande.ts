import {InsertCra} from '../cra/InsertCra';
import {Cra} from '../cra/Cra';
import {CommandeInsert} from './CommandeInsert';

export class BigCommande {
  constructor(
    public status: string,
    public listeCommande: CommandeInsert[]
  ) {}


}
