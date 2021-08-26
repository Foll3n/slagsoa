import {Commande} from './Commande';

export class BigCommande {
  constructor(
    public status: string,
    public listeCommande: Commande[]
  ) {}


}
