import { Component,  OnInit} from '@angular/core';
import {
  ViewChild,
  TemplateRef
} from '@angular/core';
import {isSameDay, isSameMonth} from 'date-fns';
import {Subject, Subscription} from 'rxjs';
import {
  CalendarEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarView
} from 'angular-calendar';
import {CraService} from '../../services/cra.service';
import {CalendarService} from '../../services/calendar.service';
import {InsertCra} from '../models/cra/InsertCra';
import {Router} from '@angular/router';
import {formatDate} from '@angular/common';
import {JoursferiesService} from '../../services/joursferies.service';


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
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;
  listeJoursFeries: Date[] = [];
  view: CalendarView = CalendarView.Month;
  listeCra: InsertCra[] = [];
  CalendarView = CalendarView;
  calendarCraSubscription!: Subscription;
  jourFerieSubscription!: Subscription;
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
  constructor(private jourFerie: JoursferiesService, private craService: CraService, private calendarService: CalendarService, private router: Router) {
    this.jourFerieSubscription = this.jourFerie.joursSubject.subscribe((jours: Date[]) => this.listeJoursFeries = jours );
    this.calendarCraSubscription = this.calendarService.calendarSubject.subscribe(
      (listeCra: InsertCra[]) => {
        let i = 0;
        this.listeCra = listeCra;
        this.listeCra[20];
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


  ngOnInit(
  ) {



  }


  isFerie(date: Date){
    if (this.listeJoursFeries)
      return this.listeJoursFeries.find(d => isSameDay(date,d));
    return false;
  }
  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
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
      }
      if (this.isFerie(day.date)){
        day.backgroundColor = '#bdbdbd';
      }




    });
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {

    if (isSameMonth(date, this.viewDate) && !this.isFerie(date)) {
      if (isSameDay(this.viewDate, date) && this.activeDayIsOpen  ){
        console.log('test clic jour');
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      if ( events.length === 0){
        this.router.navigate(['/compte-rendu-activite',formatDate(date,'MM-dd-yyyy','en')]);
      }
      this.viewDate = date;
    }
  }


  handleEvent(action: string, event: CalendarEvent): void {
    this.router.navigate(['/compte-rendu-activite',formatDate(event.start,'MM-dd-yyyy','en')]);
  }

  addEvent(titre: string, start: string , color: any, duree: string): void {
    console.log('event');
    let display =  '<div class="d-flex justify-content-between"> <p>'+titre+'</p><p> Duree : '+duree+'</p><div>';

      let t = `<div class="duree-calendar">`+"Dur??e: "+duree+`</div>`;
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
