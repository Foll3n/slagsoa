import {CompteRendu} from '../compteRendu/CompteRendu';
import {CraWeekInsert} from './craWeekInsert';

export class CraWeekInsertStatus {
  constructor(
    public craWeek:CraWeekInsert,
    public idUserDoRequest:string
  ) {}
}
