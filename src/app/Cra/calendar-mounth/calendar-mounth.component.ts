import {AfterViewInit, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns';
import {Subject, Subscription} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent, CalendarMonthViewBeforeRenderEvent,
  CalendarView
} from 'angular-calendar';
import {Cra} from '../models/cra/Cra';
import {CompteRenduInsert} from '../models/compteRendu/CompteRenduInsert';
import {CraService} from '../../services/cra.service';
import {CalendarService} from '../../services/calendar.service';
import {CraWeekInsert} from '../models/logCra/craWeekInsert';
import {InsertCra} from '../models/cra/InsertCra';
import {Router} from '@angular/router';





@Component({
  selector: 'app-calendar-mounth',
  templateUrl: './calendar-mounth.component.html',
  styleUrls: ['./calendar-mounth.component.scss'],
  styles: [
    `
      .cal-month-view .bg-pink,
      .cal-week-view .cal-day-columns .bg-pink,
      .cal-day-view .bg-pink
      .cal-month-view .cal-cell.cal-event-highlight{
        background-color: hotpink !important;
      }
    `,
  ],
})
export class CalendarMounthComponent implements OnInit {

  constructor(private craService: CraService, private calendarService: CalendarService, private router: Router) {

  }

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;


  view: CalendarView = CalendarView.Month;
  listeCra: InsertCra[] = [];
  CalendarView = CalendarView;
  calendarCra!: Subscription;
  locale = 'fr';
  events: CustomEvent[] = [];
  viewDate: Date = new Date();
  dayToStart = 1;
  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;

  refresh: Subject<any> = new Subject();


  activeDayIsOpen = true;



  ngOnInit(
  ) {

    this.calendarCra = this.calendarService.calendarSubject.subscribe(
      (listeCra: InsertCra[]) => {
        let i = 0;
        this.listeCra = listeCra;
        this.listeCra[20];
        console.log('je suis la aaaaaaaaaaaaaaaaaaaaaaaaaaa', this.listeCra);
        for (const cra of this.listeCra){
          console.log(i);
          i++;
          if (cra.listeCr) {
          for (const cr of cra.listeCr){
            this.addEvent('Commande: ' + cr.id_commande, cra.date, cr.color, cr.duree);
          }
          }
        }
      });

  }



  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    console.log('ok');
    renderEvent.body.forEach((day) => {

      const dayOfMonth = day.date.getDate();

      for (const c of this.listeCra){



        if (new Date(c.date).getDate() == dayOfMonth && isSameMonth(new Date(c.date), this.viewDate) && (isSameDay(day.date, new Date(c.date)))){
          if (c.status! == '1'){
            day.backgroundColor = '#d4e4fc'; }
          else if (c.status == '2'){
            day.backgroundColor = '#e7f5e4';
          }
          else if (c.status == '0' ){
            day.backgroundColor = '#F6CECE';
          }
          else{
            day.backgroundColor = 'yellow';
          }
        }
        else{
          day.backgroundColor == 'red';
        }
      }




    });
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true)
      ) {
        console.log('test clic jour');
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      if ( events.length === 0){
        this.craService.initialisation(date, true);
        this.router.navigate(['/compte-rendu-activite']);

      }
      this.viewDate = date;
    }
  }


  handleEvent(action: string, event: CalendarEvent): void {
    // console.log("iciii");
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
    this.craService.initialisation(event.start, true);
    this.router.navigate(['/compte-rendu-activite']);
  }

  addEvent(titre: string, start: string , color: any, duree: string): void {
    console.log('event');
    let display =  '<div class="d-flex justify-content-between"> <p> Titre : '+titre+'</p><p> Duree : '+duree+'</p><div>';

      let t = `<div class="duree-calendar">`+"Durée: "+duree+`</div>`;
    this.events = [
      ...this.events,
      {
        title: display,
        start: new Date(start),
        end: new Date(start),
        color: {primary: color, secondary: color},
        duree
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }




}

interface CustomEvent extends CalendarEvent {
  duree: string;
}
