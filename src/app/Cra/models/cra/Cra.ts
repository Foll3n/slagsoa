import {CompteRendu} from '../compteRendu/CompteRendu';

export class Cra {
  constructor(
    public id_cra: number,
    public id_usr: number,
    public date: Date,
    public duree_totale: number,
    public statusConge: number,
    public listeCr: CompteRendu[]
  ) {}
}
