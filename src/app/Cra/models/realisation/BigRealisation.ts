import {Commande} from '../commande/Commande';
import {Realisation} from './Realisation';

export class BigRealisation {
  constructor(
    public status: string,
    public realisations: Realisation[]
  ) {}


}
