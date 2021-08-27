import {Commande} from './Commande';

export class BigInsertCommande {
  constructor(
    public idUserDoRequest: string,
    public listeCommandes: Commande[]
  ) {}


}
