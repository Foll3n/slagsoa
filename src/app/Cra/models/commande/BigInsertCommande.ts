import {CommandeInsert} from './CommandeInsert';

export class BigInsertCommande {
  constructor(
    public idUserDoRequest: string,
    public listeCommandes: CommandeInsert[]
  ) {}


}
