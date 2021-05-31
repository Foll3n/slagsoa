import {Component, OnInit, Output} from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})

export class DatePickerComponent implements OnInit{

  //Attributs en lien avec le datePicker
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  //Attributs utilisé pour stocker la date de debut et la date de fin dans le composant
  dateDebut!: string;
  dateFin!: string;

  //Emetteurs utilisé pour emettre la date de debut et la date de fin au composant père qui est visualisation
  @Output() dateD: EventEmitter<string> = new EventEmitter();
  @Output() dateF: EventEmitter<string> = new EventEmitter();




  //-------------------------------------------FIN ATTRIBUTS -------------------------------------------------------------------------------------
  /*
  -
  -
  -
   */
  //--------------------------------------------DEBUT CONSTRUCTOR ET INIT ------------------------------------------------------------------------


  //Le constructeur permet d'initialiser à l'ouverture au 29/04/l'année actuel au 29/04/2022
  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {


    //this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.toDate = calendar.getToday();
    this.fromDate = calendar.getNext(this.toDate,'m',-4);

  }

  //A l'initialisation, on verifie si dans le storage il n'y a pas de date de debut et de fin stocké. Si oui alors le datePicker prend les valeurs stockés.
  //Cela permet ainsi lors d'une actualisation de page de garder la date qui avait été choisie.

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
  //--------------------------------------------FIN CONSTRUCTOR ET INIT ------------------------------------------------------------------------
  /*
  -
  -
  -
   */
  //--------------------------------------------Debut Méthodes propre au DatePicker ------------------------------------------------------------
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
  //--------------------------------------------FIN Méthodes propre au DatePicker ------------------------------------------------------------------------
  /*

    Méthode de chargement permettant:

    1- Stocker dans dateDebut et dans dateFin les date sous for YYYY-MM-JJ
    2- Le stocker sous ce même format dans le sessionStorage
    3- On emet les dates au composant père

   */
  changement(fromDate: NgbDate, toDate: NgbDate) {
    this.dateDebut = this.formatter.format(this.fromDate);
    this.dateFin = this.formatter.format(this.toDate);
    sessionStorage.setItem('dateD', this.dateDebut);
    sessionStorage.setItem('dateF', this.dateFin);
    this.dateD.emit(this.dateDebut);
    this.dateF.emit(this.dateFin);
  }
}
