import {InsertCra} from '../cra/InsertCra';
import {Cra} from '../cra/Cra';
import {Commande} from './Commande';

export class InserCommande {
  constructor(
    public idUserDoRequest: string,
    public commande: Commande
  ) {}


}
