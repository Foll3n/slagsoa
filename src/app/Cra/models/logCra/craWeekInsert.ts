import {CompteRendu} from '../compteRendu/CompteRendu';

export class CraWeekInsert {
  constructor(
    public dateStart: string,
    public dateEnd: string,
    public status: string,
    public idUsr: string,
    public nomUsername?: string,
    public prenomUsername?: string,
    public idCra?: string
  ) {}
}
