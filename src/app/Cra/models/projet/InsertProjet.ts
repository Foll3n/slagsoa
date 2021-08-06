import {Projet} from './Projet';

export class InsertProjet {
  constructor(
    public idUserDoRequest: string,
    public projet: Projet

  ) {}
}
