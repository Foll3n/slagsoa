import {Component, OnInit, Output} from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit{
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  dateDebut!: string;
  dateFin!: string;
  @Output() dateD: EventEmitter<string> = new EventEmitter();
  @Output() dateF: EventEmitter<string> = new EventEmitter();

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getToday();
    this.fromDate.day = 29;
    this.fromDate.month = 4;
    this.fromDate.year = calendar.getToday().year;

    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.toDate.day = 29;
    this.toDate.month = 4;
    this.toDate.year = 2022;
  }

  ngOnInit(){
    if(sessionStorage.getItem('dateD') != null && sessionStorage.getItem('dateF')!=null){
      let s1 = sessionStorage.getItem('dateD');
      let s2 = sessionStorage.getItem('dateF');
      if(s1 != null && s2!= null){
        let s11 = s1.split('-');
        let s12 = s2.split('-');
        // @ts-ignore
        this.fromDate.day = s11[2];
        // @ts-ignore
        this.fromDate.month = s11[1];
        // @ts-ignore
        this.fromDate.year = s11[0];
        // @ts-ignore
        this.toDate.day = s12[2];
        // @ts-ignore
        this.toDate.month = s12[1];
        // @ts-ignore
        this.toDate.year = s12[0];
    }
  }}

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  changement(fromDate: NgbDate, toDate: NgbDate) {
    this.dateDebut = this.formatter.format(this.fromDate);
    this.dateFin = this.formatter.format(this.toDate);
    sessionStorage.setItem('dateD', this.dateDebut);
    sessionStorage.setItem('dateF', this.dateFin);
    this.dateD.emit(this.dateDebut);
    this.dateF.emit(this.dateFin);
  }
}
